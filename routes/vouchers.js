// Ficheiro: API LIVE/routes/vouchers.js (VERSÃO COM IMPORTAÇÃO CORRIGIDA)

const express = require('express');
const router = express.Router();

// Importar controladores e middlewares
// CORREÇÃO: O nome do ficheiro é 'vouchersController' (com "s")
const { createVoucher, redeemVoucher } = require('../controllers/vouchersController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// --- DEFINIÇÃO DAS ROTAS ---

// Rota para um utilizador resgatar um voucher (requer apenas login)
router.post('/redeem', authMiddleware, redeemVoucher);

// Rota para um admin criar um voucher (requer login de admin)
router.post('/create', authMiddleware, adminMiddleware, createVoucher);


// --- DOCUMENTAÇÃO SWAGGER ---
const docs = {
    
        '/vouchers/redeem': {
            post: {
                summary: 'Utilizador resgata um voucher por código',
                tags: ['Vouchers'],
                security: [{ bearerAuth: [] }],
                requestBody: { content: { 'application/json': { schema: { properties: { code: { type: 'string' } } } } } },
                responses: { '200': { description: 'Voucher resgatado' } }
            }
        },
        '/vouchers/create': {
            post: {
                summary: 'Admin cria um novo voucher',
                tags: ['Vouchers', 'Admin'],
                security: [{ bearerAuth: [] }],
                requestBody: { content: { 'application/json': { schema: { properties: {
                    code: { type: 'string' },
                    points: { type: 'number' },
                    expiresAt: { type: 'string', format: 'date-time' }
                } } } } },
                responses: { '201': { description: 'Voucher criado' } }
            }
        }
    
};

// Exportamos o router e os docs no formato esperado pelo app.js
module.exports = {
    router,
    docs,
};