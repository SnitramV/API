// Ficheiro: API LIVE/controllers/voucherController.js (CRIE ESTE FICHEIRO)

const { db } = require('../config/firebase');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../config/logger');

/**
 * @desc    Admin cria um novo voucher
 */
const createVoucher = asyncHandler(async (req, res) => {
    const { code, points, expiresAt } = req.body;

    // Garante que o código está em maiúsculas para evitar duplicados
    const upperCaseCode = code.toUpperCase();

    const newVoucher = {
        code: upperCaseCode,
        points: parseInt(points, 10),
        isActive: true,
        createdAt: new Date(),
        expiresAt: new Date(expiresAt),
        redeemedBy: null,
        redeemedAt: null,
    };

    // Usar o código como ID do documento para garantir que sejam únicos
    await db.collection('vouchers').doc(upperCaseCode).set(newVoucher);

    logger.info(`Voucher ${upperCaseCode} criado com sucesso.`);
    res.status(201).json({ message: 'Voucher criado com sucesso!', voucher: newVoucher });
});

/**
 * @desc    Utilizador resgata um voucher
 */
const redeemVoucher = asyncHandler(async (req, res) => {
    const { uid } = req.user;
    const { code } = req.body;
    const upperCaseCode = code.toUpperCase();

    const voucherRef = db.collection('vouchers').doc(upperCaseCode);
    const userRef = db.collection('users').doc(uid);

    // Usamos uma transação para garantir que a operação é atómica
    // (ou tudo funciona, ou nada funciona)
    await db.runTransaction(async (transaction) => {
        const voucherDoc = await transaction.get(voucherRef);
        const userDoc = await transaction.get(userRef);

        if (!voucherDoc.exists || !voucherDoc.data().isActive) {
            // Usamos return para parar a execução e enviar a resposta
            return res.status(404).json({ message: 'Voucher inválido, expirado ou já utilizado.' });
        }

        if (new Date() > voucherDoc.data().expiresAt.toDate()) {
            // Desativa o voucher se estiver expirado
            transaction.update(voucherRef, { isActive: false });
            return res.status(400).json({ message: 'Este voucher expirou.' });
        }

        const currentPoints = userDoc.data().points || 0;
        const voucherPoints = voucherDoc.data().points;

        // Atualiza os pontos do utilizador e desativa o voucher
        transaction.update(userRef, { points: currentPoints + voucherPoints });
        transaction.update(voucherRef, {
            isActive: false,
            redeemedBy: uid,
            redeemedAt: new Date(),
        });

        // Retornamos a resposta de sucesso dentro da transação
        return res.status(200).json({ message: `Voucher resgatado! Você ganhou ${voucherPoints} pontos.` });
    });
});

module.exports = {
    createVoucher,
    redeemVoucher,
};