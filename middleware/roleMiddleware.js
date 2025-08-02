// middleware/roleMiddleware.js
const { db, admin } = require('../config/firebase');

const checkRole = (allowedRoles) => {
  return async (req, res, next) => {
    const { uid } = req.user;

    try {
      const userRef = db.collection('users').doc(uid);
      const doc = await userRef.get();

      if (!doc.exists) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }

      const { role } = doc.data();

      if (allowedRoles.includes(role)) {
        return next();
      } else {
        return res.status(403).json({ message: 'Acesso negado. Você não tem a permissão necessária.' });
      }
    } catch (error) {
      // --- CORREÇÃO DE ERRO ---
      console.error('Erro ao verificar permissão:', error);
      return res.status(500).json({ message: 'Erro interno ao verificar permissões.' });
    }
  };
};

module.exports = { checkRole };