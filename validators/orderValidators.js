const { body, param } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validationHandler');

const createOrderValidator = [
  body('items').isArray({ min: 1 }).withMessage('O carrinho não pode estar vazio.'),
  body('items.*.productId').isString().notEmpty().withMessage('O ID do produto é obrigatório em todos os itens.'),
  body('items.*.quantity').isInt({ gt: 0 }).withMessage('A quantidade deve ser um número inteiro positivo.'),
  body('pointsToUse').optional().isInt({ min: 0 }).withMessage('Os pontos a usar devem ser um número inteiro não negativo.'),
  handleValidationErrors,
];

const updateStatusValidator = [
  param('orderId').isString().notEmpty().withMessage('O ID do pedido é obrigatório.'),
  body('status').isString().notEmpty().withMessage('O novo status é obrigatório.'),
  handleValidationErrors,
];

module.exports = {
  createOrderValidator,
  updateStatusValidator,
};