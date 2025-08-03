// Ficheiro: API LIVE/routes/orders.js (VERSÃO CORRIGIDA E MODERNIZADA)

const express = require('express');
const router = express.Router();

// Importar o controlador e os middlewares
const {
    createOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    createPresentialOrder
} = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
// Supondo que você tenha um middleware para vendedores
const sellerMiddleware = require('../middleware/sellerMiddleware'); 

// --- DEFINIÇÃO DAS ROTAS DE PEDIDOS ---

// Rota para um utilizador criar um novo pedido online
router.post('/', authMiddleware, createOrder);

// Rota para um utilizador buscar os seus próprios pedidos
router.get('/', authMiddleware, getUserOrders);

// Rota para um admin buscar todos os pedidos do sistema
router.get('/all', authMiddleware, adminMiddleware, getAllOrders);

// Rota para um admin atualizar o status de um pedido
router.patch('/:orderId/status', authMiddleware, adminMiddleware, updateOrderStatus);

// Rota para um vendedor criar um pedido presencial
router.post('/presential', authMiddleware, sellerMiddleware, createPresentialOrder);


// --- DOCUMENTAÇÃO SWAGGER ---
const docs = {
    
        '/orders': {
            post: {
                summary: 'Utilizador cria um novo pedido online',
                tags: ['Pedidos'],
                security: [{ bearerAuth: [] }],
                responses: { '201': { description: 'Pedido criado' } }
            },
            get: {
                summary: 'Utilizador busca os seus pedidos',
                tags: ['Pedidos'],
                security: [{ bearerAuth: [] }],
                responses: { '200': { description: 'Lista de pedidos do utilizador' } }
            }
        },
        '/orders/all': {
            get: {
                summary: '(Admin) Busca todos os pedidos do sistema',
                tags: ['Pedidos', 'Admin'],
                security: [{ bearerAuth: [] }],
                responses: { '200': { description: 'Lista de todos os pedidos' } }
            }
        },
        '/orders/{orderId}/status': {
            patch: {
                summary: '(Admin) Atualiza o status de um pedido',
                tags: ['Pedidos', 'Admin'],
                security: [{ bearerAuth: [] }],
                responses: { '200': { description: 'Status atualizado' } }
            }
        },
        '/orders/presential': {
            post: {
                summary: '(Vendedor) Cria um pedido de venda presencial',
                tags: ['Pedidos', 'Vendedor'],
                security: [{ bearerAuth: [] }],
                responses: { '201': { description: 'Venda presencial registada' } }
            }
        }
    
};

// Exportamos o router e os docs no formato esperado pelo app.js
module.exports = {
    router,
    docs,
};