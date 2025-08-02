// services/pushNotificationService.js
const { db, admin } = require('../config/firebase'); // <-- CORREÇÃO APLICADA

/**
 * Envia uma push notification para todos os dispositivos de todos os usuários.
 */
const sendPushToAllUsers = async (title, body) => {
    console.log("Iniciando envio de push notifications para todos os usuários...");

    try {
        const usersSnapshot = await db.collection('users').get();
        if (usersSnapshot.empty) {
            console.log("Nenhum usuário encontrado para enviar notificações.");
            return;
        }

        const allTokens = [];
        for (const userDoc of usersSnapshot.docs) {
            const tokensSnapshot = await userDoc.ref.collection('fcmTokens').get();
            if (!tokensSnapshot.empty) {
                tokensSnapshot.forEach(tokenDoc => {
                    allTokens.push(tokenDoc.data().token);
                });
            }
        }

        if (allTokens.length === 0) {
            console.log("Nenhum dispositivo registrado para receber notificações.");
            return;
        }
        
        console.log(`Enviando notificação para ${allTokens.length} dispositivos.`);

        const message = {
            notification: {
                title: title,
                body: body,
            },
            tokens: allTokens,
        };

        const response = await admin.messaging().sendMulticast(message);
        
        console.log(`${response.successCount} notificações enviadas com sucesso.`);
        if (response.failureCount > 0) {
            console.warn(`${response.failureCount} notificações falharam.`);
        }

    } catch (error) {
        console.error("Erro crítico ao enviar push notifications:", error);
    }
};

module.exports = { sendPushToAllUsers };