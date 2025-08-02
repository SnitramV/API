const { db } = require('../config/firebase');
const asyncHandler = require('../utils/asyncHandler');

const createNotification = asyncHandler(async (req, res) => {
    const {
        name,
        botContent,
        appContent,
        targetGroups,
        scheduledAt,
        repeats,
    } = req.body;

    const newNotification = {
        name,
        botContent,
        appContent,
        targetGroups: targetGroups || [],
        scheduledAt: new Date(scheduledAt),
        repeats: repeats || 'once',
        status: 'scheduled',
        createdAt: new Date(),
    };

    const docRef = await db.collection('notifications').add(newNotification);
    res.status(201).json({ message: 'Notificação agendada com sucesso.', id: docRef.id });
});

const listNotifications = asyncHandler(async (req, res) => {
    const snapshot = await db.collection('notifications').orderBy('createdAt', 'desc').get();
    const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(notifications);
});

module.exports = { createNotification, listNotifications };