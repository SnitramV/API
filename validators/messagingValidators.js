const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validationHandler');

const scheduleTrainingValidator = [
    body('groupId').notEmpty().withMessage('O ID do grupo é obrigatório.'),
    body('sport').notEmpty().withMessage('O desporto é obrigatório.'),
    body('day').notEmpty().withMessage('O dia é obrigatório.'),
    body('time').notEmpty().withMessage('A hora é obrigatória.'),
    body('location').notEmpty().withMessage('O local é obrigatório.'),
    body('gender').notEmpty().withMessage('O género é obrigatório.'),
    handleValidationErrors,
];

const broadcastValidator = [
    body('groupId').notEmpty().withMessage('O ID do grupo é obrigatório.'),
    body('message').notEmpty().withMessage('A mensagem não pode estar vazia.'),
    handleValidationErrors,
];

module.exports = {
    scheduleTrainingValidator,
    broadcastValidator,
};