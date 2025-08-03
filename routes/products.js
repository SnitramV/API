// Ficheiro: API LIVE/routes/products.js (VERSÃO FINAL E CORRIGIDA)

const express = require('express');
const router = express.Router();

// Importar o controlador e os middlewares
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    adjustStock
} = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// --- DEFINIÇÃO DAS ROTAS DE PRODUTOS ---

// Rotas públicas (não precisam de login)
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Rotas protegidas que exigem permissão de admin
router.post('/', authMiddleware, adminMiddleware, createProduct);
router.put('/:id', authMiddleware, adminMiddleware, updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);
router.post('/:productId/adjust-stock', authMiddleware, adminMiddleware, adjustStock);


// --- DOCUMENTAÇÃO SWAGGER ---
const docs = {
    
        '/products': {
            get: {
                summary: 'Lista todos os produtos',
                tags: ['Produtos'],
                responses: { '200': { description: 'Lista de produtos' } }
            },
            post: {
                summary: '(Admin) Cria um novo produto',
                tags: ['Produtos', 'Admin'],
                security: [{ bearerAuth: [] }],
                responses: { '201': { description: 'Produto criado' } }
            }
        },
        '/products/{id}': {
            get: {
                summary: 'Busca um produto por ID',
                tags: ['Produtos'],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { '200': { description: 'Detalhes do produto' } }
            },
            put: {
                summary: '(Admin) Atualiza um produto por ID',
                tags: ['Produtos', 'Admin'],
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { '200': { description: 'Produto atualizado' } }
            },
            delete: {
                summary: '(Admin) Deleta um produto por ID',
                tags: ['Produtos', 'Admin'],
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { '204': { description: 'Produto deletado' } }
            }
        },
        '/products/{productId}/adjust-stock': {
            post: {
                summary: '(Admin) Ajusta o stock de um produto',
                tags: ['Produtos', 'Admin'],
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: { content: { 'application/json': { schema: { properties: {
                    quantity: { type: 'number', description: 'Valor a ser adicionado (positivo) ou removido (negativo) do stock.' }
                }}}}},
                responses: { '200': { description: 'Stock ajustado' } }
            }
        }
    
};

// Exportamos o router e os docs no formato esperado pelo app.js
module.exports = {
    router,
    docs,
};