// Arquivo: app.js (VERSÃO FINAL, ROBUSTA E DEFINITIVA)

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const morgan = require('morgan');
const helmet = require('helmet');

// --- ARQUIVOS DE CONFIGURAÇÃO E MIDDLEWARE ---
const generateSwaggerSpec = require('./config/swaggerConfig');
const { errorHandler } = require('./middleware/errorHandler');
const logger = require('./config/logger');

// --- IMPORTAÇÃO DE TODAS AS ROTAS ---
const routeModules = {
    admin: require('./routes/admin'),
    coach: require('./routes/coach'),
    vouchers: require('./routes/vouchers'),
    auth: require('./routes/auth'),
    bot: require('./routes/bot'),
    events: require('./routes/events'),
    feedback: require('./routes/feedback'),
    internal: require('./routes/internal'),
    messaging: require('./routes/messaging'),
    news: require('./routes/news'),
    notifications: require('./routes/notifications'),
    orders: require('./routes/orders'),
    password: require('./routes/password'),
    products: require('./routes/products'),
    sync: require('./routes/sync'),
    trainings: require('./routes/trainings'),
    users: require('./routes/users'),
};

// Inicializa o aplicativo Express
const app = express();

// --- MIDDLEWARES ESSENCIAIS ---
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('tiny', { stream: { write: (message) => logger.http(message.trim()) } }));


// --- DOCUMENTAÇÃO SWAGGER (INTELIGENTE) ---
const allDocs = {};
for (const key in routeModules) {
    if (routeModules[key] && routeModules[key].docs) {
        Object.assign(allDocs, routeModules[key].docs);
    }
}
const swaggerSpec = generateSwaggerSpec(allDocs);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// --- FUNÇÃO INTELIGENTE PARA CARREGAR ROTAS ---
// Esta função detecta o estilo de cada ficheiro e carrega-o da forma correta.
const loadRoute = (module) => {
    // Estilo Moderno: module.exports = router;
    if (typeof module === 'function') {
        return module;
    }
    // Estilo com Swagger: module.exports = { router: ..., docs: ... };
    if (module.router && typeof module.router === 'function') {
        return module.router;
    }
    // Estilo Antigo: module.exports = { configureRouter: ... };
    if (module.configureRouter && typeof module.configureRouter === 'function') {
        const subRouter = express.Router();
        module.configureRouter(subRouter);
        return subRouter;
    }
    // Se nenhum padrão for reconhecido, retorna null para ser ignorado.
    return null;
};

// --- CONFIGURAÇÃO DAS ROTAS DA API ---
// Usamos a função inteligente para carregar cada rota.
for (const key in routeModules) {
    const router = loadRoute(routeModules[key]);
    if (router) {
        app.use(`/api/${key}`, router);
        logger.info(`Rotas para /api/${key} carregadas com sucesso.`);
    } else {
        logger.warn(`Módulo de rotas para '${key}' não está num formato reconhecido e foi ignorado.`);
    }
}

// --- ROTA RAIZ E TRATAMENTO DE ERROS ---
app.get('/', (req, res) => {
    res.send('API está a funcionar! Aceda a /api-docs para ver a documentação.');
});

// Middleware de erro deve ser o último.
app.use(errorHandler);

module.exports = app;