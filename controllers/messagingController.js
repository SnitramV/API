const botService = require('../services/botService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Formata e envia uma mensagem de treino para o bot.
 */
const scheduleTraining = asyncHandler(async (req, res) => {
    const { groupId, sport, day, time, location, gender } = req.body;

    const trainingMessage = `*📣 Marcação de Treino 📣*\n\n*Esporte:* ${sport}\n*Dia:* ${day}\n*Horário:* ${time}\n*Local:* ${location}\n*Gênero:* ${gender}\n\n*Confirme sua presença reagindo a esta mensagem!* 💪`;

    const result = await botService.sendMessageToGroup(groupId, trainingMessage);

    if (result.success) {
        res.status(200).json({ message: "Anúncio de treino enviado com sucesso." });
    } else {
        // Lança um erro para ser pego pelo asyncHandler
        const error = new Error(result.message || 'Falha ao enviar mensagem para o grupo.');
        error.statusCode = 500;
        throw error;
    }
});

/**
 * Envia uma mensagem de broadcast através do bot.
 */
const broadcastMessage = asyncHandler(async (req, res) => {
    const { groupId, message } = req.body;

    const result = await botService.sendMessageToGroup(groupId, message);
    if (result.success) {
        res.status(200).json({ message: "Broadcast enviado com sucesso." });
    } else {
        const error = new Error(result.message || 'Falha ao enviar broadcast.');
        error.statusCode = 500;
        throw error;
    }
});

module.exports = {
    scheduleTraining,
    broadcastMessage
};