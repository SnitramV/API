// API LIVE/controllers/passwordController.js (VERSÃO CORRIGIDA)

const { db, admin } = require('../config/firebase');
const asyncHandler = require('../utils/asyncHandler');
const botService = require('../services/botService');

/**
 * @desc    Solicita um código de recuperação de senha
 * @route   POST /api/password/request-reset
 * @access  Public
 */
const requestPasswordReset = asyncHandler(async (req, res) => {
    const { email } = req.body;
    let userRecord;

    try {
        userRecord = await admin.auth().getUserByEmail(email);
    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            return res.status(404).json({ message: 'Nenhuma conta encontrada com este email.' });
        }
        throw error;
    }

    const { uid } = userRecord;
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    // --- CORREÇÃO APLICADA AQUI ---
    // Trocamos userDoc.exists() por userDoc.exists
    if (!userDoc.exists || !userDoc.data().phoneNumber) {
        return res.status(400).json({ message: 'Não foi possível enviar o código. O usuário não possui um número de telefone associado.' });
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Expira em 10 minutos

    await userRef.update({
        passwordReset: { code, expiresAt },
    });

    const phoneNumber = userDoc.data().phoneNumber;
    // Garante que o ID do WhatsApp seja formatado corretamente
    const whatsappId = phoneNumber.endsWith('@c.us') ? phoneNumber : `${phoneNumber.replace(/[^0-9]/g, '')}@c.us`;
    const message = `Seu código de recuperação de senha é: *${code}*`;

    // AGORA ESTA CHAMADA DEVE FUNCIONAR
    await botService.sendMessage(whatsappId, message);

    res.status(200).json({ message: "Código de verificação enviado para o seu WhatsApp." });
});


/**
 * @desc    Verifica o código e redefine a senha
 * @route   POST /api/password/verify-and-reset
 * @access  Public
 */
const verifyCodeAndResetPassword = asyncHandler(async (req, res) => {
    const { email, code, newPassword } = req.body;
    let userRecord;

    try {
        userRecord = await admin.auth().getUserByEmail(email);
    } catch (error) {
        return res.status(404).json({ message: 'Nenhuma conta encontrada com este email.' });
    }

    const { uid } = userRecord;
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    // --- CORREÇÃO APLICADA AQUI TAMBÉM ---
    if (!userDoc.exists || !userDoc.data().passwordReset) {
        return res.status(400).json({ message: "Nenhuma solicitação de redefinição pendente." });
    }

    const { code: savedCode, expiresAt } = userDoc.data().passwordReset;

    if (savedCode !== code) {
        return res.status(400).json({ message: "Código de verificação inválido." });
    }

    if (expiresAt.toDate() < new Date()) {
        return res.status(400).json({ message: "Código de verificação expirado." });
    }

    await admin.auth().updateUser(uid, { password: newPassword });

    await userRef.update({
        passwordReset: admin.firestore.FieldValue.delete(),
    });

    res.status(200).json({ message: 'Senha redefinida com sucesso!' });
});

module.exports = {
    requestPasswordReset,
    verifyCodeAndResetPassword,
};