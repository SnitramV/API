// Ficheiro: API LIVE/routes/news.js (VERSÃO CORRIGIDA E MODERNIZADA)

const express = require('express');
const router = express.Router();

// Importar o controlador e os middlewares
const { createNews, getAllNews, deleteNews } = require('../controllers/newsController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// --- DEFINIÇÃO DAS ROTAS DE NOTÍCIAS ---

// Rota para buscar todas as notícias (pública)
router.get('/', getAllNews);

// Rota para criar uma nova notícia (requer permissão de admin)
router.post('/', authMiddleware, adminMiddleware, createNews);

// Rota para apagar uma notícia (requer permissão de admin)
router.delete('/:newsId', authMiddleware, adminMiddleware, deleteNews);


// --- DOCUMENTAÇÃO SWAGGER ---
const docs = {
    
        '/news': {
            get: {
                summary: 'Busca todas as notícias',
                tags: ['Notícias'],
                responses: { '200': { description: 'Lista de notícias' } }
            },
            post: {
                summary: '(Admin) Cria uma nova notícia',
                tags: ['Notícias'],
                security: [{ bearerAuth: [] }],
                requestBody: { content: { 'application/json': { schema: { properties: {
                    title: { type: 'string' },
                    content: { type: 'string' },
                    imageUrl: { type: 'string' }
                } } } } },
                responses: { '201': { description: 'Notícia criada' } }
            }
        },
        '/news/{newsId}': {
            delete: {
                summary: '(Admin) Deleta uma notícia por ID',
                tags: ['Notícias'],
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'newsId', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { '200': { description: 'Notícia deletada' } }
            }
        }
    
};

// Exportamos o router e os docs no formato esperado pelo app.js
module.exports = {
    router,
    docs,
};