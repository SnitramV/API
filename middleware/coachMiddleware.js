// Ficheiro: API LIVE/middleware/coachMiddleware.js

const { admin } = require('../config/firebase');

/**
 * Middleware para verificar se o utilizador autenticado tem a função de 'coach'.
 * Deve ser usado DEPOIS do middleware de autenticação (verifyFirebaseToken).
 */
const isCoach = async (req, res, next) => {
    // A UID do utilizador vem do middleware de autenticação
    const { uid } = req.user;

    try {
        const userRecord = await admin.auth().getUser(uid);
        // Verificamos se a 'custom claim' é 'coach' OU 'admin'
        // Isto permite que um admin também possa usar as ferramentas de treinador.
        const userRole = userRecord.customClaims?.role;
        if (userRole === 'coach' || userRole === 'admin') {
            return next();
        } else {
            return res.status(403).json({ message: 'Acesso negado. Apenas treinadores ou administradores podem realizar esta ação.' });
        }
    } catch (error) {
        console.error('Erro ao verificar a função de treinador:', error);
        return res.status(500).json({ message: 'Erro interno ao verificar permissões.' });
    }
};

module.exports = { isCoach };