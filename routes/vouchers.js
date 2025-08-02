// Ficheiro: API LIVE/routes/vouchers.js

const express = require('express');
const { redeemVoucher } = require('../controllers/vouchersController');
const { verifyFirebaseToken } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validationHandler');

const docs = {}; // Para documentação futura

// Validador simples para a rota de resgate
const redeemValidator = [
    body('code').isString().trim().notEmpty().withMessage('O código do voucher é obrigatório.'),
    handleValidationErrors,
];

const configureRouter = (router) => {
    // A rota é protegida para garantir que apenas um utilizador autenticado a possa aceder.
    router.post(
        '/redeem',
        verifyFirebaseToken,
        redeemValidator,
        redeemVoucher
    );
};

module.exports = {
    docs,
    configureRouter,
};