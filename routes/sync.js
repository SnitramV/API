const express = require('express');
const sheetSyncService = require('../services/sheetSyncService');

// Objeto de documentação para as rotas de sincronização
const syncDocs = {
  '/sync/products': {
    post: {
      tags: ['Sync'],
      summary: 'Aciona a sincronização de produtos a partir da planilha do Google Sheets',
      description: 'Este endpoint deve ser protegido por uma chave de API ou outro método em produção.',
      responses: {
        '200': {
          description: 'Sincronização concluída com sucesso.',
        },
        '500': {
          description: 'Falha durante a sincronização.',
        },
      },
    },
  },
};

// Esta função configura o router, garantindo que os controllers já foram carregados.
const configureRouter = (router) => {
  router.post('/products', async (req, res) => {
    console.log('Recebida requisição para sincronizar produtos da planilha.');
    try {
      const result = await sheetSyncService.syncProductsFromSheet();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
};

module.exports = {
  configureRouter,
  docs: syncDocs,
};