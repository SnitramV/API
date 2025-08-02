const express = require('express');
const productController = require('../controllers/productController');
const { verifyFirebaseToken } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');
const {
  createProductValidator,
  updateProductValidator,
  adjustStockValidator,
} = require('../validators/productValidators');

// Objeto de documentação para as rotas de produtos
const productDocs = {
  '/products': {
    get: {
      tags: ['Products'],
      summary: 'Retorna uma lista de todos os produtos',
      responses: {
        '200': {
          description: 'Lista de produtos obtida com sucesso.',
          content: { 'application/json': { schema: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, price: { type: 'number' }, stock: { type: 'integer' } } } } } },
        },
      },
    },
    post: {
      tags: ['Products'],
      summary: 'Cria um novo produto',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, price: { type: 'number' }, stock: { type: 'integer' }, description: { type: 'string' } } } } },
      },
      responses: {
        '201': { description: 'Produto criado com sucesso.' },
        '403': { description: 'Acesso negado.' },
      },
    },
  },
  '/products/{id}': {
    get: {
      tags: ['Products'],
      summary: 'Obtém os detalhes de um produto específico',
      parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' }, description: 'O ID do produto.' }],
      responses: {
        '200': { description: 'Detalhes do produto.' },
        '404': { description: 'Produto não encontrado.' },
      },
    },
    put: {
      tags: ['Products'],
      summary: 'Atualiza um produto existente',
      security: [{ bearerAuth: [] }],
      parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
      requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, price: { type: 'number' }, stock: { type: 'integer' } } } } } },
      responses: {
        '200': { description: 'Produto atualizado com sucesso.' },
        '404': { description: 'Produto não encontrado.' },
      },
    },
    delete: {
      tags: ['Products'],
      summary: 'Apaga um produto',
      security: [{ bearerAuth: [] }],
      parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
      responses: {
        '204': { description: 'Produto apagado com sucesso.' },
        '403': { description: 'Acesso negado.' },
      },
    },
  },
  '/products/{productId}/adjust-stock': {
    post: {
      tags: ['Products'],
      summary: 'Ajusta o stock de um produto',
      security: [{ bearerAuth: [] }],
      parameters: [{ in: 'path', name: 'productId', required: true, schema: { type: 'string' } }],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { type: 'object', properties: { quantity: { type: 'number', description: 'A quantidade a ser adicionada (positiva) ou removida (negativa).' } } } } },
      },
      responses: {
        '200': { description: 'Stock ajustado com sucesso.' },
        '404': { description: 'Produto não encontrado.' },
      },
    },
  },
};

// Esta função configura o router, garantindo que os controllers já foram carregados.
const configureRouter = (router) => {
  router.get('/', productController.getAllProducts);
  router.post('/', [verifyFirebaseToken, checkRole(['admin', 'sellers'])], createProductValidator, productController.createProduct);
  router.get('/:id', productController.getProductById);
  router.put('/:id', [verifyFirebaseToken, checkRole(['admin', 'sellers'])], updateProductValidator, productController.updateProduct);
  router.delete('/:id', [verifyFirebaseToken, checkRole(['admin', 'sellers'])], productController.deleteProduct);
  router.post('/:productId/adjust-stock', [verifyFirebaseToken, checkRole(['admin', 'sellers'])], adjustStockValidator, productController.adjustStock);
};

module.exports = {
  configureRouter,
  docs: productDocs,
};