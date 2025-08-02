// Ficheiro: API LIVE/middleware/sellerMiddleware.js

const { admin } = require('../config/firebase');

/**
 * Middleware para verificar se o utilizador autenticado tem a função de 'seller'.
 * Um 'admin' também terá acesso.
 * Deve ser usado DEPOIS do middleware de autenticação (verifyFirebaseToken).
 */
const isSeller = async (req, res, next) => {
    // A UID do utilizador vem do middleware de autenticação
    const { uid } = req.user;

    try {
        const userRecord = await admin.auth().getUser(uid);
        const userRole = userRecord.customClaims?.role;

        // Permite o acesso se a função for 'seller' OU 'admin'
        if (userRole === 'seller' || userRole === 'admin') {
            return next();
        } else {
            return res.status(403).json({ message: 'Acesso negado. Apenas vendedores ou administradores podem realizar esta ação.' });
        }
    } catch (error) {
        console.error('Erro ao verificar a função de vendedor:', error);
        return res.status(500).json({ message: 'Erro interno ao verificar permissões.' });
    }
};

module.exports = { isSeller };