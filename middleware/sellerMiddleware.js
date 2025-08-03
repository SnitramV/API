// Ficheiro: API LIVE/middleware/sellerMiddleware.js (CRIE ESTE FICHEIRO)

const logger = require('../config/logger');

/**
 * @desc    Middleware para verificar se o utilizador tem a role 'seller' ou 'admin'.
 * Admins também devem poder realizar vendas.
 * @note    Este middleware deve ser usado DEPOIS do authMiddleware.
 */
const sellerMiddleware = (req, res, next) => {
    // Verifica se o utilizador tem a role 'seller' OU 'admin'
    if (req.user && (req.user.role === 'seller' || req.user.role === 'admin')) {
        // Se tiver a permissão, continua
        next();
    } else {
        // Se não tiver, nega o acesso
        logger.warn(`Acesso negado: Utilizador ${req.user?.uid || '(desconhecido)'} sem permissão de vendedor.`);
        return res.status(403).json({ error: 'Acesso negado. Recurso exclusivo para vendedores.' });
    }
};

// Exporta a função diretamente para ser usada nas rotas
module.exports = sellerMiddleware;