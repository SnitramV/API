const { body, param } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validationHandler');

const createEventValidator = [
    body('name').notEmpty().withMessage('O nome do evento é obrigatório.').trim().escape(),
    body('date').isISO8601().withMessage('A data do evento é obrigatória e deve estar no formato AAAA-MM-DD.'),
    body('points').isInt({ gt: 0 }).withMessage('A quantidade de pontos deve ser um número inteiro positivo.'),
    handleValidationErrors,
];

const checkInValidator = [
    param('eventId').isString().notEmpty().withMessage('O ID do evento na URL é obrigatório.'),
    handleValidationErrors,
];

module.exports = {
    createEventValidator,
    checkInValidator,
};