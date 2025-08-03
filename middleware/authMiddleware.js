// Ficheiro: APIv10/middleware/authMiddleware.js (VERSÃO CORRIGIDA)

const { admin } = require('../config/firebase');
const logger = require('../config/logger');

/**
 * @desc    Middleware para verificar o token JWT do Firebase.
 * Se o token for válido, adiciona o utilizador (user) ao objeto de requisição (req).
 */
const authMiddleware = async (req, res, next) => {
    // Procura pelo cabeçalho de autorização
    const authHeader = req.headers.authorization;

    // Verifica se o cabeçalho existe e se começa com "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        logger.warn('Tentativa de acesso sem token de autenticação.');
        return res.status(401).json({ error: 'Não autorizado. Token não fornecido.' });
    }

    // Extrai o token do cabeçalho
    const idToken = authHeader.split('Bearer ')[1];

    try {
        // Verifica o token usando o SDK Admin do Firebase
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        
        // Anexa os dados do utilizador decodificados ao objeto 'req'
        // para que as rotas subsequentes possam aceder-lhe
        req.user = decodedToken;
        
        // Passa para o próximo middleware ou controlador
        next();
    } catch (error) {
        logger.error('Erro na verificação do token JWT:', error);
        return res.status(403).json({ error: 'Token inválido ou expirado.' });
    }
};

// Exporta a função diretamente, em vez de um objeto
module.exports = authMiddleware;