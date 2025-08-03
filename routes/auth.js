// Ficheiro: API LIVE/routes/auth.js (VERSÃO CORRIGIDA E MODERNIZADA)

const express = require('express');
const router = express.Router();

// Importar o controlador e os validadores
const { registerUser, loginUser } = require('../controllers/authController');
// Se você tiver validadores, importe-os aqui. Ex:
// const { registerValidator, loginValidator } = require('../validators/authValidators');
// const validationHandler = require('../middleware/validationHandler');

// --- DEFINIÇÃO DAS ROTAS DE AUTENTICAÇÃO ---

/**
 * @desc    Regista um novo utilizador
 * @route   POST /api/auth/register
 */
router.post(
    '/register',
    // registerValidator, // Adicione seu validador aqui, se houver
    // validationHandler,
    registerUser
);

/**
 * @desc    Autentica um utilizador e retorna um token
 * @route   POST /api/auth/login
 */
router.post(
    '/login',
    // loginValidator, // Adicione seu validador aqui, se houver
    // validationHandler,
    loginUser
);


// --- DOCUMENTAÇÃO SWAGGER ---
const docs = {
    
        '/auth/register': {
            post: {
                summary: 'Regista um novo utilizador',
                tags: ['Autenticação'],
                requestBody: { content: { 'application/json': { schema: { properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', format: 'password' },
                    name: { type: 'string' }
                } } } } },
                responses: { '201': { description: 'Utilizador registado com sucesso' } }
            }
        },
        '/auth/login': {
            post: {
                summary: 'Autentica um utilizador e obtém um token JWT',
                tags: ['Autenticação'],
                requestBody: { content: { 'application/json': { schema: { properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', format: 'password' }
                } } } } },
                responses: { '200': { description: 'Login bem-sucedido, retorna token' } }
            }
        }
    
};

// Exportamos o router e os docs no formato esperado pelo app.js
module.exports = {
    router,
    docs,
};