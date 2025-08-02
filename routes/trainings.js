const express = require('express');
const trainingController = require('../controllers/trainingController');
const { verifyFirebaseToken } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');
const { createTrainingValidator } = require('../validators/trainingValidators');

// Objeto de documentação para as rotas de treinos
const trainingDocs = {
  '/trainings': {
    get: {
      tags: ['Trainings'],
      summary: 'Retorna a lista dos próximos treinos',
      responses: {
        '200': { description: 'Lista de treinos agendados.' },
      },
    },
    post: {
      tags: ['Trainings'],
      summary: '(Admin/Coach) Agenda um novo treino',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                sport: { type: 'string' },
                date: { type: 'string', format: 'date' },
                time: { type: 'string', example: '19:30' },
                location: { type: 'string' },
                gender: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        '201': { description: 'Treino agendado com sucesso.' },
        '403': { description: 'Acesso negado.' },
      },
    },
  },
  '/trainings/{trainingId}': {
    delete: {
      tags: ['Trainings'],
      summary: '(Admin/Coach) Cancela um treino agendado',
      security: [{ bearerAuth: [] }],
      parameters: [{ in: 'path', name: 'trainingId', required: true, schema: { type: 'string' } }],
      responses: {
        '200': { description: 'Treino cancelado com sucesso.' },
        '404': { description: 'Treino não encontrado.' },
      },
    },
  },
};

// Esta função configura o router
const configureRouter = (router) => {
  router.get('/', trainingController.getUpcomingTrainings);
  router.post(
    '/',
    [verifyFirebaseToken, checkRole(['admin', 'coach'])],
    createTrainingValidator,
    trainingController.createTraining
  );
  router.delete(
    '/:trainingId',
    [verifyFirebaseToken, checkRole(['admin', 'coach'])],
    trainingController.deleteTraining
  );
};

module.exports = {
  configureRouter,
  docs: trainingDocs,
};