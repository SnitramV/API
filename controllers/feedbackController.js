const { db } = require('../config/firebase');
const botService = require('../services/botService');
const asyncHandler = require('../utils/asyncHandler');

const MANAGEMENT_GROUP_ID = process.env.MANAGEMENT_GROUP_ID;

const createSuggestion = asyncHandler(async (req, res) => {
    const { suggestion, isAnonymous } = req.body;
    const user = req.user;

    const suggestionData = {
        suggestion,
        isAnonymous,
        createdAt: new Date(),
        source: user ? 'app' : 'whatsapp',
        status: 'recebida',
    };

    if (!isAnonymous && user) {
        suggestionData.userId = user.uid;
        suggestionData.userName = user.name || user.email;
    }

    await db.collection('suggestions').add(suggestionData);

    let notificationMessage;
    if (isAnonymous) {
        notificationMessage = `🔔 *Nova Sugestão Anónima Recebida* 🔔\n\n*Sugestão:*\n_"${suggestion}"_`;
    } else {
        const author = user ? suggestionData.userName : 'Utilizador do WhatsApp';
        notificationMessage = `🔔 *Nova Sugestão de ${author}* 🔔\n\n*Sugestão:*\n_"${suggestion}"_`;
    }

    await botService.sendMessageToGroup(MANAGEMENT_GROUP_ID, notificationMessage);

    res.status(201).json({ message: 'Sugestão enviada com sucesso. Obrigado pelo seu feedback!' });
});

module.exports = { createSuggestion };