// middleware/authMiddleware.js
const { admin } = require('../config/firebase'); // <-- CORREÇÃO APLICADA

const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acesso não autorizado. Token não fornecido ou em formato inválido.' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Erro ao verificar o token:', error);
    return res.status(403).json({ message: 'Acesso proibido. Token inválido ou expirado.' });
  }
};

module.exports = {
  verifyFirebaseToken,
};