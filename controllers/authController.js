// Ficheiro: API LIVE/controllers/authController.js (VERSÃO ATUALIZADA)

const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/authService');
const axios = require('axios'); // Precisamos do axios para comunicar com a API do Firebase

/**
 * @desc    Regista um novo utilizador
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;
    const uid = await authService.registerUser({ email, password, name });
    res.status(201).json({ 
        message: 'Utilizador registado com sucesso!', 
        uid: uid 
    });
});

/**
 * @desc    Autentica um utilizador e retorna um token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const apiKey = process.env.FIREBASE_WEB_API_KEY;

    if (!apiKey) {
        throw new Error('Chave de API do Firebase não configurada no servidor.');
    }

    const authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

    try {
        const response = await axios.post(authUrl, {
            email: email,
            password: password,
            returnSecureToken: true,
        });

        // A resposta da API do Firebase contém o idToken (o nosso JWT)
        const { idToken } = response.data;

        res.status(200).json({
            message: 'Login bem-sucedido.',
            token: idToken,
        });

    } catch (error) {
        // Se o login falhar (senha errada, etc.), a API do Firebase retorna um erro
        const errorMessage = error.response?.data?.error?.message || 'Email ou senha inválidos.';
        res.status(401).json({ message: errorMessage });
    }
});

module.exports = {
    registerUser,
    loginUser, // <-- Exportamos a nova função
};