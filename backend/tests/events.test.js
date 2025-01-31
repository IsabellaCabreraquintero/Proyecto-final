const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Event = require('../models/Event');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.close();
});

beforeEach(async () => {
    await Event.deleteMany({});
});

describe('API de Eventos', () => {
    const sampleEvent = { nombre: 'Evento de prueba', fecha: new Date(), descripcion: 'Descripción del evento de prueba' };

    test('POST /events - Crear un nuevo evento', async () => {
        const response = await request(app).post('/events').send(sampleEvent);
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.nombre).toBe(sampleEvent.nombre);
    });

    test('GET /events - Obtener todos los eventos', async () => {
        await Event.create(sampleEvent);
        const response = await request(app).get('/events');
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBe(1);
    });
});