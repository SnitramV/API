// Ficheiro: API LIVE/routes/orders.js (VERSÃO COM PONTO DE VENDA)

const express = require('express');
const orderController = require('../controllers/orderController');
const { verifyFirebaseToken } = require('../middleware/authMiddleware');
const { checkProfileCompletion } = require('../middleware/profileMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');
const { isSeller } = require('../middleware/sellerMiddleware'); // <-- IMPORTADO
const {
  createOrderValidator,
  updateStatusValidator,
} = require('../validators/orderValidators');

const orderDocs = {
  '/orders': {
    // ... (documentação existente)
  },
  // --- DOCUMENTAÇÃO PARA A NOVA ROTA DE PONTO DE VENDA ---
  '/orders/presential': {
    post: {
      tags: ['Orders', 'Seller'],
      summary: '(Seller/Admin) Cria um novo pedido para uma venda presencial',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                items: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      productId: { type: 'string' },
                      quantity: { type: 'integer' },
                    },
                  },
                },
                paymentMethod: { type: 'string', enum: ['cash', 'card', 'pix'] },
                customerId: { type: 'string', description: 'UID do cliente (opcional, para cashback)' },
              },
            },
          },
        },
      },
      responses: {
        '201': { description: 'Venda registada com sucesso.' },
        '400': { description: 'Dados inválidos ou stock insuficiente.' },
        '403': { description: 'Acesso negado (não é um vendedor).' },
      },
    },
  },
  '/orders/my-history': {
    // ... (documentação existente)
  },
  '/orders/all': {
    // ... (documentação existente)
  },
  '/orders/{orderId}/status': {
    // ... (documentação existente)
  },
};

const configureRouter = (router) => {
  // Rota para pedidos online de clientes
  router.post(
    '/',
    [verifyFirebaseToken, checkProfileCompletion],
    createOrderValidator,
    orderController.createOrder
  );

  // --- NOVA ROTA PARA O PONTO DE VENDA ---
  router.post(
    '/presential',
    verifyFirebaseToken,
    isSeller,
    orderController.createPresentialOrder
  );

  // Rotas de visualização e gestão
  router.get('/my-history', verifyFirebaseToken, orderController.getUserOrders);
  router.get('/all', [verifyFirebaseToken, checkRole(['admin'])], orderController.getAllOrders);
  router.put(
    '/:orderId/status',
    [verifyFirebaseToken, checkRole(['admin'])],
    updateStatusValidator,
    orderController.updateOrderStatus
  );
};

module.exports = {
  configureRouter,
  docs: orderDocs,
};