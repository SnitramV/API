// Ficheiro: API LIVE/controllers/coachController.js

const { db } = require('../config/firebase');
const asyncHandler = require('../utils/asyncHandler');
const botService = require('../services/botService');
const sportsGroups = require('../config/sportsGroups'); // Importamos a nossa nova configuração

/**
 * @desc    Agenda um novo treino para a modalidade do treinador
 * @route   POST /api/coach/trainings
 * @access  Coach
 */
const scheduleTraining = asyncHandler(async (req, res) => {
    const { uid } = req.user;
    const { title, date, location, description } = req.body;

    // Busca os dados do treinador no Firestore para descobrir a sua modalidade
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
        sport, // Associa o treino à modalidade do treinador
        scheduledBy: uid,
        createdAt: new Date(),
    };

    const trainingRef = await db.collection('trainings').add(newTraining);

    res.status(201).json({ message: 'Treino agendado com sucesso!', trainingId: trainingRef.id });
});

/**
 * @desc    Envia uma mensagem para o grupo de WhatsApp da equipa
 * @route   POST /api/coach/broadcast
 * @access  Coach
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
    
    // Usamos o botService para comandar o bot a enviar a mensagem
    await botService.sendMessage(groupId, message);

    res.status(200).json({ message: `Mensagem enviada para o grupo de ${sport}.` });
});

module.exports = {
    scheduleTraining,
    broadcastToTeam,
};