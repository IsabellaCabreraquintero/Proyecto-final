const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// GET: Obtener todos los eventos
router.get('/', async (req, res, next) => {
    try {
        const events = await Event.find().sort({ fecha: 1 });
        res.json({ success: true, data: events });
    } catch (error) {
        next(error);
    }
});

// POST: Crear un nuevo evento
router.post('/', async (req, res, next) => {
    try {
        const event = new Event(req.body);
        const savedEvent = await event.save();
        res.status(201).json({ success: true, data: savedEvent });
    } catch (error) {
        next(error);
    }
});

// PUT: Actualizar un evento
router.put('/:id', async (req, res, next) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!event) {
            return res.status(404).json({ success: false, message: 'Evento no encontrado' });
        }
        res.json({ success: true, data: event });
    } catch (error) {
        next(error);
    }
});

// DELETE: Eliminar un evento
router.delete('/:id', async (req, res, next) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: 'Evento no encontrado' });
        }
        res.json({ success: true, message: 'Evento eliminado' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;