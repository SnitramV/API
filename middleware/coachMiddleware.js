// Ficheiro: API LIVE/middleware/coachMiddleware.js (VERSÃO CORRIGIDA)

const logger = require('../config/logger');

/**
 * @desc    Middleware para verificar se o utilizador tem a role 'coach'.
 * Este middleware deve ser usado DEPOIS do authMiddleware,
 * pois ele depende do req.user que o authMiddleware define.
 */
const coachMiddleware = (req, res, next) => {
    // Verifica se o objeto 'user' existe e se a sua role é 'coach'
    if (req.user && req.user.role === 'coach') {
        // Se for um coach, permite que a requisição continue
        next();
    } else {
        // Se não for um coach, nega o acesso
        logger.warn(`Acesso negado: Utilizador ${req.user?.uid || '(desconhecido)'} sem permissão de coach.`);
        return res.status(403).json({ error: 'Acesso negado. Recurso exclusivo para treinadores.' });
    }
};

// Exporta a função diretamente, em vez de um objeto
module.exports = coachMiddleware;