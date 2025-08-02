// Arquivo: API - Copia/routes/password.js

const express = require('express');
const passwordController = require('../controllers/passwordController');
const { sensitiveRoutesLimiter } = require('../middleware/rateLimiter');
// Se você tiver validadores, pode adicioná-los aqui. Ex:
// const { requestResetValidator } = require('../validators/passwordValidators');

// Objeto de documentação para as rotas de senha
const passwordDocs = {
  '/password/request-reset': {
    post: {
      tags: ['Password'],
      summary: 'Solicita um código de recuperação de senha',
      description:
        'Envia um código de verificação para o WhatsApp do usuário associado ao e-mail.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email'],
              properties: { email: { type: 'string', format: 'email' } },
            },
          },
        },
      },
      responses: {
        '200': { description: 'Código de verificação enviado.' },
        '404': { description: 'Nenhuma conta encontrada com este e-mail.' },
      },
    },
  },
  '/password/verify-and-reset': {
    post: {
      tags: ['Password'],
      summary: 'Verifica o código e redefine a senha',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'code', 'newPassword'],
              properties: {
                email: { type: 'string', format: 'email' },
                code: { type: 'string' },
                newPassword: { type: 'string', format: 'password' },
              },
            },
          },
        },
      },
      responses: {
        '200': { description: 'Senha redefinida com sucesso.' },
        '400': { description: 'Código inválido, expirado ou dados incorretos.' },
      },
    },
  },
};

// Esta função configura o router
const configureRouter = (router) => {
  // Aplica um limite de requisições para estas rotas
  router.use(sensitiveRoutesLimiter);

  router.post('/request-reset', passwordController.requestPasswordReset);
  router.post(
    '/verify-and-reset',
    passwordController.verifyCodeAndResetPassword
  );
};

module.exports = {
  configureRouter,
  docs: passwordDocs,
};