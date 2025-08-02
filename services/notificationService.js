// services/notificationService.js
const cron = require('node-cron');
const { db, admin } = require('../config/firebase');
const botService = require('./botService');
const pushNotificationService = require('./pushNotificationService');

const startNotificationScheduler = () => {
    // Adicionada uma verificação para evitar que o cron job quebre em ambientes de teste
    if (process.env.NODE_ENV === 'test') {
        return;
    }

    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();
            const notificationsRef = db.collection('notifications');
            const snapshot = await notificationsRef.where('scheduledAt', '<=', now).where('status', '==', 'scheduled').get();

            if (snapshot.empty) {
                return;
            }

            snapshot.forEach(async (doc) => {
                const notification = { id: doc.id, ...doc.data() };
                console.log(`Processando notificação agendada: ${notification.id}`);

                if (notification.targetGroups && notification.targetGroups.length > 0) {
                    for (const groupId of notification.targetGroups) {
                        await botService.sendMessageToGroup(groupId, notification.botContent);
                    }
                }

                if (notification.appContent && notification.appContent.title && notification.appContent.body) {
                    await pushNotificationService.sendPushToAllUsers(
                        notification.appContent.title,
                        notification.appContent.body
                    );
                }
                
                if (notification.repeats === 'weekly') {
                    const nextSchedule = new Date(notification.scheduledAt.toDate());
                    nextSchedule.setDate(nextSchedule.getDate() + 7);
                    await doc.ref.update({ scheduledAt: nextSchedule });
                } else {
                    await doc.ref.update({ status: 'sent' });
                }
            });
        } catch (error) {
            console.error('[NODE-CRON] [ERROR]', error);
        }
    });
};

module.exports = { startNotificationScheduler };