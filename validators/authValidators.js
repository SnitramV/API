const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validationHandler');

const registerValidator = [
    body('email').isEmail().withMessage('Por favor, forneça um email válido.'),
    body('password').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres.'),
    body('name').notEmpty().withMessage('O nome é obrigatório.').trim().escape(),
    handleValidationErrors,
];

// --- ADICIONE ESTE NOVO VALIDADOR ---
const loginValidator = [
    body('email').isEmail().withMessage('Por favor, forneça um email válido.'),
    body('password').notEmpty().withMessage('A senha é obrigatória.'),
    handleValidationErrors,
];

module.exports = {
    registerValidator,
    loginValidator, // <-- Não se esqueça de exportá-lo
};