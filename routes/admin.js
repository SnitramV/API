// Ficheiro: APIv10/routes/admin.js (VERSÃO CORRIGIDA)

const express = require('express');
const router = express.Router();

// Middlewares e Controladores
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const adminController = require('../controllers/adminController');

// Todas as rotas neste ficheiro exigem autenticação e permissão de admin.
// Podemos aplicar os middlewares a todas as rotas de uma só vez.
router.use(authMiddleware);
router.use(adminMiddleware);

/**
 * @desc    Rota para listar todos os utilizadores
 * @route   GET /api/admin/users
 */
router.get('/users', adminController.listAllUsers); // <--- Corresponde ao controlador

/**
 * @desc    Rota para definir a role de um utilizador
 * @route   POST /api/admin/users/:uid/role
 */
router.post('/users/:uid/role', adminController.setUserRole); // <--- Corresponde ao controlador

module.exports = router;