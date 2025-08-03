// Ficheiro: API LIVE/routes/users.js (VERSÃO FINAL E CORRIGIDA)

const express = require('express');
const router = express.Router();

// Importar o controlador e os middlewares
const {
    syncUserProfile,
    addPointsToUser,
    getUserProfile,
    completeUserProfile,
    registerDeviceToken,
    updateUserProfile,
    deleteUserAccount,
    requestSensitiveDataChange,
    verifyAndSaveChanges
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// --- DEFINIÇÃO DAS ROTAS DE UTILIZADOR ---

// Todas as rotas abaixo requerem que o utilizador esteja logado.
router.use(authMiddleware);

// Rota para sincronizar/criar o perfil do utilizador no Firestore após o registo/login
router.post('/sync', syncUserProfile);

// Rota para obter o perfil do utilizador logado
router.get('/profile', getUserProfile);

// Rota para completar o perfil do utilizador com mais detalhes
router.post('/complete-profile', completeUserProfile);

// Rota para atualizar o perfil (dados não sensíveis)
router.put('/profile', updateUserProfile);

// Rota para registar o token de um dispositivo para notificações push
router.post('/register-device', registerDeviceToken);

// Rota para solicitar uma alteração de dados sensíveis (senha, telefone)
router.post('/request-change', requestSensitiveDataChange);

// Rota para verificar o código e salvar as alterações sensíveis
router.post('/verify-change', verifyAndSaveChanges);

// Rota para apagar a conta do utilizador
router.delete('/delete-account', deleteUserAccount);

// Rota de ADMIN para adicionar pontos a um utilizador específico
router.post('/:userId/add-points', adminMiddleware, addPointsToUser);


// --- DOCUMENTAÇÃO SWAGGER ---
const docs = {
    // A documentação para tantas rotas seria muito extensa,
    // mas pode ser adicionada aqui seguindo o padrão dos outros ficheiros.
};

// Exportamos o router e os docs no formato esperado pelo app.js
module.exports = {
    router,
    docs,
};