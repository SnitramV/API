// Ficheiro: APIv10/middleware/adminMiddleware.js (VERSÃO CORRIGIDA)

const logger = require('../config/logger');

/**
 * @desc    Middleware para verificar se o utilizador tem a role 'admin'.
 * Este middleware deve ser usado DEPOIS do authMiddleware.
 */
const adminMiddleware = (req, res, next) => {
    // O authMiddleware já deve ter colocado o objeto 'user' na requisição
    if (req.user && req.user.role === 'admin') {
        // Se o utilizador existe e tem a role 'admin', continua
        next();
    } else {
        // Se não tiver a role 'admin', nega o acesso
        logger.warn(`Acesso negado: Utilizador ${req.user?.uid || '(desconhecido)'} sem permissão de admin.`);
        return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
    }
};

// Exporta a função de middleware diretamente
module.exports = adminMiddleware;