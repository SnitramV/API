// Ficheiro: API LIVE/middleware/roleMiddleware.js (CRIE ESTE FICHEIRO)

const logger = require('../config/logger');

/**
 * Middleware genérico para verificar se o utilizador tem uma das roles permitidas.
 * @param {string[]} allowedRoles - Um array de strings com as roles permitidas (ex: ['admin', 'coach']).
 * @returns Um middleware do Express.
 */
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        // Pega a role do utilizador, definida pelo authMiddleware
        const userRole = req.user?.role;

        // Verifica se o utilizador tem uma role e se essa role está na lista de permitidas
        if (userRole && allowedRoles.includes(userRole)) {
            // Se tiver a permissão, continua para a próxima função
            next();
        } else {
            // Se não tiver, nega o acesso
            logger.warn(`Acesso negado para a role '${userRole}'. Utilizador: ${req.user?.uid}`);
            res.status(403).json({
                message: `Acesso negado. É necessária uma das seguintes permissões: ${allowedRoles.join(', ')}.`,
            });
        }
    };
};

// Exporta a função que cria o middleware
module.exports = roleMiddleware;