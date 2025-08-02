// Ficheiro: API LIVE/controllers/eventController.js (VERSÃO COM CHECK-IN)

const { db, admin } = require('../config/firebase');
const asyncHandler = require('../utils/asyncHandler');
const eventService = require('../services/eventService');

/**
 * @desc    Admin cria um novo evento para check-in
 * @route   POST /api/events/create
 * @access  Private (Admin)
 */
const createEvent = asyncHandler(async (req, res) => {
    const { name, date, points } = req.body;
    
    // A função no service agora deve receber 'points' como 'checkInPoints'
    const eventId = await eventService.createCheckinEvent({ name, date, checkInPoints: points });

    res.status(201).json({
        message: `Evento '${name}' criado com sucesso.`,
        eventId: eventId
    });
});

exports.deleteEvent = async (req, res) => {
    try {
        // Extrai o ID do evento dos parâmetros da rota
        const { eventId } = req.params;
        
        // Chama o serviço para executar a lógica de apagar
        await eventService.deleteEvent(eventId);
        
        // Envia uma resposta de sucesso
        res.status(200).json({ message: 'Evento apagado com sucesso.' });
        logger.info(`Evento ${eventId} apagado com sucesso por um administrador.`);

    } catch (error) {
        logger.error(`Erro ao apagar o evento ${req.params.eventId}: ${error.message}`);
        
        // Envia uma resposta de erro apropriada se o evento não for encontrado
        if (error.message.includes('não encontrado')) {
            return res.status(404).json({ error: error.message });
        }
        
        res.status(500).json({ error: 'Erro interno do servidor ao tentar apagar o evento.' });
    }
};

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

    const result = await eventService.processCheckIn(eventId, uid);

    res.status(200).json({
        message: `Check-in no evento '${result.eventName}' realizado! Você ganhou ${result.pointsAwarded} pontos.`
    });
});


module.exports = {
  createEvent,
  checkInToEvent, // <-- A NOVA FUNÇÃO
  listPublicEvents,
  deleteEvent,
};