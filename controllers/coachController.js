// Ficheiro: API LIVE/controllers/coachController.js (VERSÃO CORRIGIDA)

const { db } = require('../config/firebase');
const asyncHandler = require('../utils/asyncHandler');
const botService = require('../services/botService');
const sportsGroups = require('../config/sportsGroups');

/**
 * @desc    Lógica para agendar um novo treino para a modalidade do treinador.
 */
const scheduleTraining = asyncHandler(async (req, res) => {
    const { uid } = req.user;
    const { title, date, location, description } = req.body;

    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists || !userDoc.data().sport) {
        return res.status(400).json({ message: 'A sua conta não está associada a nenhuma modalidade.' });
    }
    const sport = userDoc.data().sport;

    const newTraining = {
        title,
        date: new Date(date),
        location,
        description,
        sport,
        scheduledBy: uid,
        createdAt: new Date(),
    };

    const trainingRef = await db.collection('trainings').add(newTraining);

    res.status(201).json({ message: 'Treino agendado com sucesso!', trainingId: trainingRef.id });
});

/**
 * @desc    Lógica para enviar uma mensagem para o grupo de WhatsApp da equipa.
 */
const broadcastToTeam = asyncHandler(async (req, res) => {
    const { uid } = req.user;
    const { message } = req.body;

    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists || !userDoc.data().sport) {
        return res.status(400).json({ message: 'A sua conta não está associada a nenhuma modalidade para enviar mensagens.' });
    }
    const sport = userDoc.data().sport;
    const groupId = sportsGroups[sport];

    if (!groupId) {
        return res.status(404).json({ message: `Não foi encontrado um grupo de WhatsApp configurado para a modalidade '${sport}'.` });
    }
    
    await botService.sendMessage(groupId, message);

    res.status(200).json({ message: `Mensagem enviada para o grupo de ${sport}.` });
});

// Adicione aqui outras funções de lógica de coach que precisar.

// Exporta apenas as funções lógicas.
module.exports = {
    scheduleTraining,
    broadcastToTeam,
};