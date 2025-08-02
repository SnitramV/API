const { body, param } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validationHandler');

const createProductValidator = [
  body('name').notEmpty().withMessage('O nome do produto é obrigatório.').trim().escape(),
  body('price').isFloat({ gt: 0 }).withMessage('O preço deve ser um número positivo.'),
  body('stock').isInt({ min: 0 }).withMessage('O stock deve ser um número inteiro não negativo.'),
  body('description').optional().trim().escape(),
  handleValidationErrors,
];

const updateProductValidator = [
  param('id').isString().notEmpty().withMessage('O ID do produto na URL é obrigatório.'),
  body('name').optional().notEmpty().withMessage('O nome do produto não pode ser vazio.').trim().escape(),
  body('price').optional().isFloat({ gt: 0 }).withMessage('O preço deve ser um número positivo.'),
  body('stock').optional().isInt({ min: 0 }).withMessage('O stock deve ser um número inteiro não negativo.'),
  handleValidationErrors,
];

const adjustStockValidator = [
  param('productId').isString().notEmpty().withMessage('O ID do produto na URL é obrigatório.'),
  body('quantity').isNumeric().withMessage('A quantidade para ajuste deve ser um número.'),
  handleValidationErrors,
];

module.exports = {
  createProductValidator,
  updateProductValidator,
  adjustStockValidator,
};