// Ficheiro: APIv10/middleware/validationHandler.js (VERSÃO CORRIGIDA)

const { validationResult } = require('express-validator');
const logger = require('../config/logger');

/**
 * @desc    Middleware para tratar erros de validação do express-validator.
 * Se houver erros, envia uma resposta 400. Caso contrário, continua.
 */
const validationHandler = (req, res, next) => {
    // Obtém os resultados da validação a partir do objeto de requisição
    const errors = validationResult(req);

    // Verifica se o array de erros não está vazio
    if (!errors.isEmpty()) {
        logger.warn('Falha na validação da requisição.', {
            errors: errors.array(),
            path: req.path,
            ip: req.ip
        });
        // Se houver erros, retorna uma resposta 400 Bad Request com os erros
        return res.status(400).json({ errors: errors.array() });
    }

    // Se não houver erros de validação, chama o próximo middleware na cadeia
    next();
};

// Exporta a função diretamente para ser usada pelo Express
module.exports = validationHandler;