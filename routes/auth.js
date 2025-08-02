// Ficheiro: API LIVE/routes/auth.js (VERSÃO FINAL COM LOGIN)

const express = require('express');
const authController = require('../controllers/authController');
// Importamos o validador de registo e o novo validador de login
const { registerValidator, loginValidator } = require('../validators/authValidators');

const authDocs = {
  '/auth/register': {
    post: {
      tags: ['Auth'],
      summary: 'Regista um novo utilizador na aplicação',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password', 'name'],
              properties: {
                email: { type: 'string', format: 'email' },
                password: { type: 'string', format: 'password', description: 'Mínimo de 6 caracteres.' },
                name: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        '201': { description: 'Utilizador registado com sucesso.' },
        '400': { description: 'Dados de entrada inválidos.' },
        '409': { description: 'O email fornecido já está em uso.' },
      },
    },
  },
  // --- DOCUMENTAÇÃO PARA A NOVA ROTA DE LOGIN ---
  '/auth/login': {
    post: {
      tags: ['Auth'],
      summary: 'Autentica um utilizador e retorna um token JWT',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: { type: 'string', format: 'email' },
                password: { type: 'string', format: 'password' },
              },
            },
          },
        },
      },
      responses: {
        '200': { description: 'Login bem-sucedido, token retornado.' },
        '401': { description: 'Credenciais inválidas.' },
      },
    },
  },
};

// Esta função configura o router, adicionando as rotas de registo e login.
const configureRouter = (router) => {
  router.post('/register', registerValidator, authController.registerUser);
  // --- ADICIONAMOS A NOVA ROTA DE LOGIN AQUI ---
  router.post('/login', loginValidator, authController.loginUser);
};

module.exports = {
  configureRouter,
  docs: authDocs,
};