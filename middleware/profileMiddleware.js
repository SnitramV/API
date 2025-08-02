// middleware/profileMiddleware.js
const { db, admin } = require('../config/firebase');

const checkProfileCompletion = async (req, res, next) => {
  const { uid } = req.user;

  try {
    const userRef = db.collection('users').doc(uid);
    const doc = await userRef.get();

    if (doc.exists && doc.data().isProfileComplete === true) {
      return next();
    } else {
      return res.status(403).json({
        errorCode: 'PROFILE_INCOMPLETE',
        message: 'Acesso negado. Por favor, complete seu perfil para usar esta funcionalidade.'
      });
    }
  } catch (error) {
    // --- CORREÇÃO DE ERRO ---
    console.error('Erro ao verificar perfil:', error);
    return res.status(500).json({ message: 'Erro interno ao verificar o perfil do usuário.' });
  }
};

module.exports = { checkProfileCompletion };