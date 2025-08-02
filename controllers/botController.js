// controllers/botController.js
const botService = require('../services/botService');
const { db, admin } = require('../config/firebase');
const syncGroups = async (req, res) => {
    const result = await botService.syncGroupsToFirestore();
    if (result.success) {
        res.status(200).json(result);
    } else {
        res.status(500).json(result);
    }
};

const listGroups = async (req, res) => {
    try {
        const snapshot = await db.collection('whatsappGroups').get();
        const groups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(groups);
    } catch (error) {
        console.error("Erro ao listar grupos:", error);
        res.status(500).json({ message: "Erro interno ao listar grupos." });
    }
};

module.exports = { syncGroups, listGroups };