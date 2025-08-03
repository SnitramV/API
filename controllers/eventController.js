// Ficheiro: APIv10/controllers/eventController.js (VERSÃO CORRIGIDA)

const { db } = require('../config/firebase');
const asyncHandler = require('../utils/asyncHandler');
const eventService = require('../services/eventService');
const logger = require('../config/logger');

/**
 * @desc    Admin cria um novo evento para check-in
 * @route   POST /api/events/create
 * @access  Private (Admin)
 */
const createEvent = asyncHandler(async (req, res) => {
    const { name, date, points } = req.body;
    const eventId = await eventService.createCheckinEvent({ name, date, points });
    res.status(201).json({
        message: `Evento '${name}' criado com sucesso.`,
        eventId: eventId
    });
});

/**
 * @desc    (Admin) Apaga um evento
 * @route   DELETE /api/events/:eventId
 * @access  Private (Admin)
 */
const deleteEvent = asyncHandler(async (req, res) => {
    const { eventId } = req.params;

    // O service já trata o caso de evento não encontrado, lançando um erro.
    await eventService.deleteEvent(eventId);

    logger.info(`Evento ${eventId} apagado com sucesso por um administrador.`);
    res.status(200).json({ message: 'Evento apagado com sucesso.' });
});

/**
 * @desc    Lista todos os eventos públicos da planilha
 * @route   GET /api/events/
 * @access  Public
 */
const listPublicEvents = asyncHandler(async (req, res) => {
    const events = await eventService.getEventsFromSheet();
    res.status(200).json(events);
});

/**
 * @desc    Utilizador faz check-in num evento e ganha pontos
 * @route   POST /api/events/:eventId/checkin
 * @access  Private (Utilizadores logados)
 */
const checkInToEvent = asyncHandler(async (req, res) => {
    const { eventId } = req.params;
    const { uid } = req.user;

    const eventRef = db.collection('events').doc(eventId);
    const eventDoc = await eventRef.get();

    if (!eventDoc.exists) {
        return res.status(404).json({ message: "Evento não encontrado." });
    }

    const eventData = eventDoc.data();
    // Passamos os pontos do evento para o serviço processar o check-in
    const result = await eventService.processCheckIn(eventId, uid, eventData.points);

    res.status(200).json({
        message: `Check-in no evento '${eventData.name}' realizado! Você ganhou ${result.pointsAwarded} pontos.`
    });
});

module.exports = {
  createEvent,
  checkInToEvent,
  listPublicEvents,
  deleteEvent,
};