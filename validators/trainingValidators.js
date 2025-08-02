const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validationHandler');

const createTrainingValidator = [
    body('sport').notEmpty().withMessage('O desporto é obrigatório.').trim().escape(),
    body('date').isISO8601().withMessage('A data deve estar no formato AAAA-MM-DD.'),
    body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('A hora deve estar no formato HH:MM.'),
    body('location').notEmpty().withMessage('O local é obrigatório.').trim().escape(),
    body('gender').notEmpty().withMessage('O género é obrigatório.').trim().escape(),
    handleValidationErrors,
];

module.exports = {
    createTrainingValidator,
};