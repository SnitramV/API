// Ficheiro: API LIVE/controllers/vouchersController.js (VERSÃO COM RESGATE)

const { db, admin } = require('../config/firebase');
const asyncHandler = require('../utils/asyncHandler');

/**
 * @desc    (Admin) Cria um novo código de voucher
 * @route   POST /api/admin/vouchers
 * @access  Admin
 */
const createVoucher = asyncHandler(async (req, res) => {
    const { code, points, usageLimit, expiresAt } = req.body;
    const voucherRef = db.collection('vouchers').doc(code.toUpperCase());
    const doc = await voucherRef.get();

    if (doc.exists) {
        return res.status(409).json({ message: 'Este código de voucher já existe.' });
    }

    const newVoucher = {
        code: code.toUpperCase(),
        points: Number(points),
        usageLimit: Number(usageLimit),
        timesUsed: 0,
        expiresAt: new Date(expiresAt),
        createdAt: new Date(),
        isActive: true,
    };

    await voucherRef.set(newVoucher);
    res.status(201).json({ message: 'Voucher criado com sucesso!', voucher: newVoucher });
});


/**
 * @desc    (User) Resgata um código de voucher
 * @route   POST /api/vouchers/redeem
 * @access  Private (Utilizadores logados)
 */
const redeemVoucher = asyncHandler(async (req, res) => {
    const { code } = req.body;
    const { uid } = req.user; // UID do utilizador que está a tentar resgatar

    const voucherRef = db.collection('vouchers').doc(code.toUpperCase());
    const userRef = db.collection('users').doc(uid);

    // Usamos uma transação para garantir que todas as operações ocorram com sucesso ou nenhuma ocorra.
    // Isto previne problemas de concorrência (vários utilizadores a tentar usar o último voucher ao mesmo tempo).
    try {
        const pointsAwarded = await db.runTransaction(async (transaction) => {
            const voucherDoc = await transaction.get(voucherRef);

            if (!voucherDoc.exists) {
                throw new Error('Código de voucher inválido.');
            }

            const voucherData = voucherDoc.data();

            if (!voucherData.isActive || new Date() > voucherData.expiresAt.toDate()) {
                throw new Error('Este voucher expirou ou não está mais ativo.');
            }
            if (voucherData.timesUsed >= voucherData.usageLimit) {
                throw new Error('Este voucher já atingiu o seu limite de utilizações.');
            }

            // Verifica se este utilizador específico já resgatou este voucher
            const redemptionRef = voucherRef.collection('redemptions').doc(uid);
            const redemptionDoc = await transaction.get(redemptionRef);
            if (redemptionDoc.exists) {
                throw new Error('Você já resgatou este código de voucher.');
            }

            // Se todas as verificações passaram, executa as atualizações
            transaction.update(userRef, {
                points: admin.firestore.FieldValue.increment(voucherData.points)
            });
            transaction.update(voucherRef, {
                timesUsed: admin.firestore.FieldValue.increment(1)
            });
            // Marca que este utilizador resgatou o voucher para não poder usar novamente
            transaction.set(redemptionRef, { redeemedAt: new Date() });

            return voucherData.points;
        });

        res.status(200).json({ message: `Parabéns! Você resgatou ${pointsAwarded} pontos!` });

    } catch (error) {
        // A transação falha e retorna o erro específico
        res.status(400).json({ message: error.message });
    }
});


module.exports = {
    createVoucher,
    redeemVoucher, // <-- ADICIONADO ÀS EXPORTAÇÕES
};