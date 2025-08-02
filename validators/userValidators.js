const { body, param } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validationHandler');

const completeProfileValidator = [
  body('firstName').notEmpty().withMessage('O primeiro nome é obrigatório.').trim().escape(),
  body('lastName').notEmpty().withMessage('O apelido é obrigatório.').trim().escape(),
  body('nickname').optional().trim().escape(),
  body('cpf').isLength({ min: 11, max: 11 }).withMessage('O CPF deve ter 11 dígitos.').isNumeric().withMessage('O CPF deve conter apenas números.'),
  body('birthDate').isISO8601().withMessage('A data de nascimento deve estar no formato AAAA-MM-DD.'),
  body('gender').notEmpty().withMessage('O género é obrigatório.'),
  body('phoneNumber').notEmpty().withMessage('O número de telemóvel é obrigatório.').isMobilePhone('pt-BR').withMessage('Número de telemóvel inválido.'),
  handleValidationErrors,
];

const updateUserProfileValidator = [
  body('firstName').notEmpty().withMessage('O primeiro nome é obrigatório.').trim().escape(),
  body('lastName').notEmpty().withMessage('O apelido é obrigatório.').trim().escape(),
  body('email').optional().isEmail().withMessage('O email fornecido é inválido.'),
  handleValidationErrors,
];

const addPointsValidator = [
  // Usamos .isString() e .notEmpty() porque os IDs do Firestore são alfanuméricos
  param('userId').isString().notEmpty().withMessage('ID de utilizador inválido.'),
  body('points').isFloat({ gt: 0 }).withMessage('A quantidade de pontos deve ser um número positivo.'),
  handleValidationErrors,
];

const registerDeviceTokenValidator = [
    body('token').notEmpty().withMessage('O token do dispositivo é obrigatório.'),
    body('deviceId').notEmpty().withMessage('O deviceId é obrigatório.'),
    handleValidationErrors,
];

const requestChangeValidator = [
    body('action').isIn(['updatePassword', 'updatePhone']).withMessage("A ação deve ser 'updatePassword' ou 'updatePhone'."),
    body('newValue').notEmpty().withMessage('O novo valor é obrigatório.'),
    handleValidationErrors,
];

const verifyChangeValidator = [
    body('code').notEmpty().withMessage('O código de verificação é obrigatório.'),
    handleValidationErrors,
];


module.exports = {
  completeProfileValidator,
  updateUserProfileValidator,
  addPointsValidator,
  registerDeviceTokenValidator,
  requestChangeValidator,
  verifyChangeValidator,
};