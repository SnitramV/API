// controllers/internalController.js

const { db, admin } = require('../config/firebase');

/**
 * Endpoint interno para o bot do WhatsApp buscar dados de um usuário.
 * Ele encontra o usuário pelo ID do WhatsApp e retorna seu perfil e último pedido.
 */
const getBotUserData = async (req, res) => {
    const { whatsappId } = req.body;
    if (!whatsappId) {
        return res.status(400).send('O ID do WhatsApp (whatsappId) é obrigatório.');
    }

    try {
        // Encontra o usuário na coleção 'users' pelo campo 'whatsappId'
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('whatsappId', '==', whatsappId).limit(1).get();

        if (snapshot.empty) {
            return res.status(404).send('Usuário com este WhatsApp ID não foi encontrado no banco de dados.');
        }

        const userDoc = snapshot.docs[0];
        const userData = userDoc.data();

        // Após encontrar o usuário, busca o último pedido dele
        const ordersSnapshot = await db.collection('orders')
            .where('userId', '==', userDoc.id) // Filtra os pedidos pelo ID do usuário
            .orderBy('createdAt', 'desc')     // Ordena para pegar o mais recente
            .limit(1)                         // Pega apenas um
            .get();

        let lastOrder = null;
        if (!ordersSnapshot.empty) {
            lastOrder = { id: ordersSnapshot.docs[0].id, ...ordersSnapshot.docs[0].data() };
        }

        // Retorna os dados combinados do perfil e do último pedido
        res.status(200).json({
            ...userData,
            lastOrder: lastOrder
        });

    } catch (error) {
        console.error("Erro ao buscar dados do usuário para o bot:", error);
        res.status(500).send('Erro interno ao buscar dados do usuário.');
    }
};

module.exports = { getBotUserData };