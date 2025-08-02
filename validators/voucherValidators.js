// Ficheiro: API LIVE/validators/voucherValidators.js

const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validationHandler');

const createVoucherValidator = [
    body('code')
        .isString()
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage('O código deve ter entre 4 e 20 caracteres.')
        .toUpperCase(),

    body('points')
        .isInt({ gt: 0 })
        .withMessage('A quantidade de pontos deve ser um número inteiro positivo.'),

    body('usageLimit')
        .isInt({ min: 1 })
        .withMessage('O limite de utilizações deve ser de, no mínimo, 1.'),

    body('expiresAt')
        .isISO8601()
        .toDate()
        .withMessage('A data de expiração deve estar no formato AAAA-MM-DD.'),

    handleValidationErrors,
];

module.exports = {
    createVoucherValidator,
};