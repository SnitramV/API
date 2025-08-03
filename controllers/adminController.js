// Ficheiro: APIv10/controllers/adminController.js (VERSÃO CORRIGIDA)

const { admin } = require('../config/firebase');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../config/logger');

/**
 * @desc    (Admin) Lista todos os utilizadores do Firebase
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
const listAllUsers = asyncHandler(async (req, res) => {
    const userRecords = await admin.auth().listUsers(1000); // Limite de 1000 por página

    const users = userRecords.users.map(user => ({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: user.customClaims?.role || 'user', // Mostra a role, padrão 'user'
        disabled: user.disabled,
        creationTime: user.metadata.creationTime,
    }));

    res.status(200).json(users);
});

/**
 * @desc    (Admin) Define a role de um utilizador (ex: 'admin')
 * @route   POST /api/admin/users/:uid/role
 * @access  Private (Admin)
 */
const setUserRole = asyncHandler(async (req, res) => {
    const { uid } = req.params;
    const { role } = req.body;

    if (!role || (role !== 'admin' && role !== 'user')) {
        return res.status(400).json({ message: "A role deve ser 'admin' ou 'user'." });
    }

    // Define a custom claim no Firebase Authentication
    await admin.auth().setCustomUserClaims(uid, { role: role });
    
    logger.info(`A role do utilizador ${uid} foi definida para '${role}'`);
    res.status(200).json({ message: `A role do utilizador ${uid} foi atualizada para '${role}'.` });
});

// Exporta um objeto contendo todas as funções do controlador
module.exports = {
    listAllUsers,
    setUserRole,
};