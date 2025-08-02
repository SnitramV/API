const { db, admin } = require('../config/firebase');

/**
 * Regista um novo utilizador no Firebase Auth e cria o seu perfil no Firestore.
 * @param {object} userData - Dados do utilizador (email, password, name).
 * @returns {string} O UID do utilizador recém-criado.
 */
const registerUser = async (userData) => {
    const { email, password, name } = userData;

    try {
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
            displayName: name,
        });

        const userRef = db.collection('users').doc(userRecord.uid);
        await userRef.set({
            name: name,
            email: email,
            createdAt: new Date().toISOString(),
            points: 0,
            role: 'student',
            isProfileComplete: false,
        });
        
        return userRecord.uid;

    } catch (error) {
        if (error.code === 'auth/email-already-exists') {
            const customError = new Error('O e-mail fornecido já está em uso.');
            customError.statusCode = 409; // 409 Conflict
            throw customError;
        }
        // Lança o erro para ser capturado pelo asyncHandler
        throw error;
    }
};

module.exports = {
    registerUser,
};