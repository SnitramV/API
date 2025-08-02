const express = require('express');
const userController = require('../controllers/userController');
const { verifyFirebaseToken } = require('../middleware/authMiddleware');
const {
  completeProfileValidator,
  updateUserProfileValidator,
} = require('../validators/userValidators');

// Objeto de documentação para as rotas de utilizadores
const userDocs = {
  '/users/sync': {
    post: {
      tags: ['Users'],
      summary: 'Sincroniza os dados do token de autenticação com o perfil no Firestore',
      description: 'Deve ser chamado após o login/registo. Cria um perfil no Firestore se não existir.',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': { description: 'Perfil já sincronizado.' },
        '201': { description: 'Perfil criado com sucesso.' },
      },
    },
  },
  '/users/profile': {
    get: {
      tags: ['Users'],
      summary: 'Retorna o perfil completo do utilizador autenticado',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': { description: 'Dados do perfil do utilizador.' },
        '404': { description: 'Perfil não encontrado.' },
      },
    },
    put: {
      tags: ['Users'],
      summary: 'Atualiza o perfil do utilizador autenticado',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                nickname: { type: 'string' },
                phoneNumber: { type: 'string' },
                email: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        '200': { description: 'Perfil atualizado com sucesso.' },
      },
    },
  },
  '/users/complete-profile': {
    post: {
      tags: ['Users'],
      summary: 'Completa o perfil do utilizador com dados adicionais',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                cpf: { type: 'string' },
                birthDate: { type: 'string', format: 'date' },
                gender: { type: 'string' },
                phoneNumber: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        '200': { description: 'Perfil completado com sucesso.' },
      },
    },
  },
  '/users/account': {
    delete: {
      tags: ['Users'],
      summary: 'Apaga a conta do utilizador autenticado',
      description: 'Esta ação é irreversível e apaga os dados do Firestore e do Firebase Auth.',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': { description: 'Conta apagada com sucesso.' },
      },
    },
  },
};

// Esta função configura o router, garantindo que os controllers já foram carregados.
const configureRouter = (router) => {
  router.post('/sync', verifyFirebaseToken, userController.syncUserProfile);
  router.get('/profile', verifyFirebaseToken, userController.getUserProfile);
  router.put(
    '/profile',
    verifyFirebaseToken,
    updateUserProfileValidator,
    userController.updateUserProfile
  );
  router.post(
    '/complete-profile',
    verifyFirebaseToken,
    completeProfileValidator,
    userController.completeUserProfile
  );
  router.delete('/account', verifyFirebaseToken, userController.deleteUserAccount);
};

module.exports = {
  configureRouter,
  docs: userDocs,
};