// Ficheiro: API LIVE/controllers/adminController.js

const { admin, db } = require('../config/firebase');
const asyncHandler = require('../utils/asyncHandler'); // Supondo que você tem este utilitário

/**
 * @desc    Listar todos os utilizadores da plataforma
 * @route   GET /api/admin/users
 * @access  Admin
 */
const listAllUsers = asyncHandler(async (req, res) => {
    const listUsersResult = await admin.auth().listUsers(1000); // Lista até 1000 utilizadores

    const usersPromises = listUsersResult.users.map(async (userRecord) => {
        const userDocRef = db.collection('users').doc(userRecord.uid);
        const userDoc = await userDocRef.get();
        const firestoreData = userDoc.exists ? userDoc.data() : {};

        // Combina os dados do Auth e do Firestore
        return {
            uid: userRecord.uid,
            email: userRecord.email,
            displayName: userRecord.displayName,
            role: userRecord.customClaims?.role || 'member', // Pega a role das custom claims
            points: firestoreData.points || 0,
            phoneNumber: firestoreData.phoneNumber || '',
            disabled: userRecord.disabled,
            creationTime: userRecord.metadata.creationTime,
        };
    });

    const users = await Promise.all(usersPromises);
    res.status(200).json(users);
});

/**
 * @desc    Alterar a função (role) de um utilizador
 * @route   PUT /api/admin/users/:userId/role
 * @access  Admin
 */
const setUserRole = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { newRole } = req.body; // ex: "admin", "coach", "seller", "member"

    if (!newRole) {
        return res.status(400).json({ message: 'A nova função (newRole) é obrigatória.' });
    }

    // Define a 'custom claim' no Firebase Authentication. É aqui que a permissão é guardada.
    await admin.auth().setCustomUserClaims(userId, { role: newRole });

    // Também atualizamos o campo 'role' no documento do Firestore para consistência.
    const userRef = db.collection('users').doc(userId);
    await userRef.update({ role: newRole });

    res.status(200).json({ message: `Função do utilizador ${userId} atualizada para '${newRole}' com sucesso.` });
});


module.exports = {
    listAllUsers,
    setUserRole,
};