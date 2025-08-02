// Ficheiro: API LIVE/middleware/adminMiddleware.js

const { admin } = require('../config/firebase');

/**
 * Middleware para verificar se o utilizador autenticado tem a função de 'admin'.
 * Este middleware deve ser usado DEPOIS do middleware de autenticação.
 */
const isAdmin = async (req, res, next) => {
    // O middleware de autenticação (que você já deve ter) deve adicionar o 'user' ao 'req'.
    const { uid } = req.user;

    try {
        const userRecord = await admin.auth().getUser(uid);
        // Verifica as 'custom claims' do utilizador
        if (userRecord.customClaims && userRecord.customClaims.role === 'admin') {
            // Se for admin, permite que a requisição continue
            return next();
        } else {
            // Se não for admin, retorna um erro de acesso proibido
            return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem realizar esta ação.' });
        }
    } catch (error) {
        console.error('Erro ao verificar a função de administrador:', error);
        return res.status(500).json({ message: 'Erro interno ao verificar permissões.' });
    }
};

module.exports = { isAdmin };