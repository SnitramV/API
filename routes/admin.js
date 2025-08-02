// Ficheiro: API LIVE/routes/admin.js (VERSÃO FINAL E CORRIGIDA)

const { listAllUsers, setUserRole } = require('../controllers/adminController');
const { isAdmin } = require('../middleware/adminMiddleware');
const { createVoucherValidator } = require('../validators/voucherValidators');
const { createVoucher } = require('../controllers/vouchersController');

// --- A CORREÇÃO ESTÁ AQUI ---
// Importamos a função com o seu nome real 'verifyFirebaseToken'
const { verifyFirebaseToken } = require('../middleware/authMiddleware');

// Objeto de documentação (pode ser preenchido mais tarde)
const docs = {};

/**
 * Configura as rotas de admin no router principal.
 * @param {import('express').Router} router - O router do Express para configurar.
 */
const configureRouter = (router) => {
    // Agora usamos 'verifyFirebaseToken' como o nosso middleware de autenticação.
    // A ordem está correta: primeiro verifica o token, depois se é admin.
    router.get(
        '/users',
        verifyFirebaseToken,
        isAdmin,
        listAllUsers
    );

    router.put(
        '/users/:userId/role',
        verifyFirebaseToken,
        isAdmin,
        setUserRole
    );
    router.post(
        '/vouchers',
        [verifyFirebaseToken, isAdmin], // Segurança
        createVoucherValidator,         // Validação
        createVoucher                   // Lógica
    );
};

module.exports = {
    docs,
    configureRouter,
};