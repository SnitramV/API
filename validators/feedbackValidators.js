const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validationHandler');

const createSuggestionValidator = [
    body('suggestion').notEmpty().withMessage('O campo de sugestão não pode estar vazio.').trim(),
    body('isAnonymous').isBoolean().withMessage('O campo isAnonymous deve ser um valor booleano (true ou false).'),
    handleValidationErrors,
];

module.exports = {
    createSuggestionValidator,
};