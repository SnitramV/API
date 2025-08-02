// Arquivo: API LIVE/app.js (VERSÃO CORRIGIDA)

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

// --- IMPORTAÇÃO DAS ROTAS ---
const adminRoutes = require('./routes/admin');
const coachRoutes = require('./routes/coach');
const voucherRoutes = require('./routes/vouchers');
const authRoutes = require('./routes/auth');
const botRoutes = require('./routes/bot');
const eventRoutes = require('./routes/events');
const feedbackRoutes = require('./routes/feedback');
const internalRoutes = require('./routes/internal');
const messagingRoutes = require('./routes/messaging');
const newsRoutes = require('./routes/news');
const notificationRoutes = require('./routes/notifications');
const orderRoutes = require('./routes/orders');
const passwordRoutes = require('./routes/password');
const productRoutes = require('./routes/products');
const syncRoutes = require('./routes/sync');
const trainingRoutes = require('./routes/trainings');
const userRoutes = require('./routes/users');

// Inicializa o aplicativo Express
const app = express();

// --- MIDDLEWARES ESSENCIAIS ---
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('tiny', { stream: { write: (message) => logger.http(message.trim()) } }));

// !! A INICIALIZAÇÃO DO BOT FOI REMOVIDA DESTE ARQUIVO !!
// A API não deve mais iniciar uma instância do WhatsApp.

// --- AGRUPAMENTO DA DOCUMENTAÇÃO SWAGGER ---
const allDocs = {
  ...authRoutes.docs,
  ...botRoutes.docs,
  ...eventRoutes.docs,
  ...feedbackRoutes.docs,
  ...internalRoutes.docs,
  ...messagingRoutes.docs,
  ...newsRoutes.docs,
  ...notificationRoutes.docs,
  ...orderRoutes.docs,
  ...passwordRoutes.docs,
  ...productRoutes.docs,
  ...syncRoutes.docs,
  ...trainingRoutes.docs,
  ...userRoutes.docs,
};
const swaggerSpec = generateSwaggerSpec(allDocs);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- CONFIGURAÇÃO DAS ROTAS DA API ---
const apiRouter = express.Router();

const applyRoutes = (path, routeConfig, router) => {
  const subRouter = express.Router();
  routeConfig.configureRouter(subRouter);
  router.use(path, subRouter);
};

applyRoutes('/admin', adminRoutes, apiRouter);
applyRoutes('/coach', coachRoutes, apiRouter);
applyRoutes('/auth', authRoutes, apiRouter);
applyRoutes('/bot', botRoutes, apiRouter);
apiRouter.use('/events', eventRoutes.configureRouter());
applyRoutes('/vouchers', voucherRoutes, apiRouter); 
applyRoutes('/feedback', feedbackRoutes, apiRouter);
applyRoutes('/internal', internalRoutes, apiRouter);
applyRoutes('/messaging', messagingRoutes, apiRouter);
applyRoutes('/news', newsRoutes, apiRouter);
applyRoutes('/notifications', notificationRoutes, apiRouter);
applyRoutes('/orders', orderRoutes, apiRouter);
applyRoutes('/password', passwordRoutes, apiRouter);
applyRoutes('/products', productRoutes, apiRouter);
applyRoutes('/sync', syncRoutes, apiRouter);
applyRoutes('/trainings', trainingRoutes, apiRouter);
applyRoutes('/users', userRoutes, apiRouter);

app.use('/api', apiRouter);

// --- ROTA RAIZ E TRATAMENTO DE ERROS ---
app.get('/', (req, res) => {
  res.send('API está funcionando! Acesse /api-docs para ver a documentação.');
});

// Middleware de erro deve ser o último
app.use(errorHandler);

module.exports = app;