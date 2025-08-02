// Ficheiro: API LIVE/controllers/orderController.js (VERSÃO COM PONTO DE VENDA)

const { db, admin } = require('../config/firebase'); // Garante que o admin está a ser importado
const salesService = require('../services/salesService');
const asyncHandler = require('../utils/asyncHandler');

// --- REGRAS DE NEGÓCIO GLOBAIS ---
const POINT_TO_BRL_RATIO = 0.01;
const BRL_TO_POINT_RATIO = 1;
const MAX_DISCOUNT_PERCENTAGE = 0.50;
const PRESENTIAL_CASHBACK_RATE = 0.05; // Ex: 5% de cashback em vendas presenciais

/**
 * Cria um novo pedido online para um utilizador logado.
 */
const createOrder = asyncHandler(async (req, res) => {
    const userId = req.user.uid;
    const { items, pointsToUse } = req.body;
    const requestedPoints = Number(pointsToUse) || 0;

    const orderData = await db.runTransaction(async (transaction) => {
        const userRef = db.collection('users').doc(userId);
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists) { throw new Error('Utilizador não encontrado.'); }

        const userPoints = userDoc.data().points || 0;
        if (userPoints < requestedPoints) { throw new Error('Você não tem pontos suficientes para realizar este resgate.'); }

        let subtotal = 0;
        let totalDiscount = 0;
        let totalPointsUsed = 0;
        let pointsAvailableToSpend = requestedPoints;

        const productDetails = [];
        const productUpdates = [];

        for (const item of items) {
            const productRef = db.collection('products').doc(item.productId);
            const productDoc = await transaction.get(productRef);
            if (!productDoc.exists) { throw new Error(`Produto com ID ${item.productId} não encontrado.`); }

            const productData = productDoc.data();
            const requestedQuantity = Number(item.quantity);
            if (productData.stock < requestedQuantity) { throw new Error(`Stock insuficiente para o produto: ${productData.name}.`); }

            const itemSubtotal = productData.price * requestedQuantity;
            subtotal += itemSubtotal;

            const maxDiscountForItem = itemSubtotal * MAX_DISCOUNT_PERCENTAGE;
            const pointsNeededForMaxDiscount = Math.round(maxDiscountForItem / POINT_TO_BRL_RATIO);
            const pointsToUseForItem = Math.min(pointsAvailableToSpend, pointsNeededForMaxDiscount);
            const discountForItem = pointsToUseForItem * POINT_TO_BRL_RATIO;

            totalDiscount += discountForItem;
            totalPointsUsed += pointsToUseForItem;
            pointsAvailableToSpend -= pointsToUseForItem;

            productUpdates.push({ ref: productRef, newStock: productData.stock - requestedQuantity });
            productDetails.push({ productId: item.productId, name: productData.name, quantity: requestedQuantity, price: productData.price, discount: discountForItem });
        }

        const finalAmount = subtotal - totalDiscount;
        const pointsEarned = Math.floor(finalAmount * BRL_TO_POINT_RATIO);
        const netPointChange = pointsEarned - totalPointsUsed;

        productUpdates.forEach(update => {
            transaction.update(update.ref, { stock: update.newStock });
        });

        transaction.update(userRef, { points: admin.firestore.FieldValue.increment(netPointChange) });

        const orderRef = db.collection('orders').doc();
        const newOrder = {
            userId,
            items: productDetails,
            subtotal: subtotal,
            discountApplied: totalDiscount,
            pointsUsed: totalPointsUsed,
            pointsEarned,
            totalAmount: finalAmount,
            status: 'pending_payment',
            createdAt: new Date()
        };

        transaction.set(orderRef, newOrder);
        return { id: orderRef.id, ...newOrder };
    });

    if (orderData) {
        try {
            await salesService.appendSaleToSheet(orderData);
        } catch(sheetError) {
            console.error("Falha ao registar venda na planilha, mas o pedido foi criado:", sheetError);
        }
    }

    res.status(201).json({ message: "Pedido criado com sucesso!", order: orderData });
});


/**
 * @desc    (Seller) Cria um novo pedido para uma venda presencial
 * @route   POST /api/orders/presential
 * @access  Seller/Admin
 */
const createPresentialOrder = asyncHandler(async (req, res) => {
    const sellerId = req.user.uid;
    const { items, paymentMethod, customerId } = req.body; // customerId (UID do cliente) é opcional

    if (!items || items.length === 0 || !paymentMethod) {
        return res.status(400).json({ message: 'A lista de itens e o método de pagamento são obrigatórios.' });
    }

    const orderData = await db.runTransaction(async (transaction) => {
        let totalAmount = 0;
        let totalPointsAwarded = 0;
        const productDetails = [];
        const productUpdates = [];

        for (const item of items) {
            const productRef = db.collection('products').doc(item.productId);
            const productDoc = await transaction.get(productRef);

            if (!productDoc.exists) { throw new Error(`Produto com ID ${item.productId} não encontrado.`); }
            
            const productData = productDoc.data();
            if (productData.stock < item.quantity) { throw new Error(`Stock insuficiente para ${productData.name}. Disponível: ${productData.stock}`); }
            
            const newStock = productData.stock - item.quantity;
            productUpdates.push({ ref: productRef, update: { stock: newStock } });
            
            totalAmount += productData.price * item.quantity;
            productDetails.push({ productId: item.productId, name: productData.name, quantity: item.quantity, price: productData.price });
        }
        
        // Se um cliente foi identificado, atribui pontos de cashback
        if (customerId) {
            const customerRef = db.collection('users').doc(customerId);
            totalPointsAwarded = Math.floor(totalAmount * PRESENTIAL_CASHBACK_RATE);
            transaction.update(customerRef, {
                points: admin.firestore.FieldValue.increment(totalPointsAwarded)
            });
        }
        
        // Executa as atualizações de stock
        productUpdates.forEach(p => transaction.update(p.ref, p.update));
        
        const orderRef = db.collection('orders').doc();
        const newOrder = {
            sellerId,
            customerId: customerId || null,
            items: productDetails,
            totalAmount,
            paymentMethod,
            pointsAwarded: totalPointsAwarded,
            status: 'completed',
            orderType: 'presential',
            createdAt: new Date(),
        };
        transaction.set(orderRef, newOrder);
        return { id: orderRef.id, ...newOrder };
    });

    res.status(201).json({ message: 'Venda presencial registada com sucesso!', order: orderData });
});


// --- AS SUAS OUTRAS FUNÇÕES CONTINUAM AQUI ---

const getUserOrders = asyncHandler(async (req, res) => {
  // ... (código existente)
});

const getAllOrders = asyncHandler(async (req, res) => {
  // ... (código existente)
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  // ... (código existente)
});


// Assegure-se de que a função confirmPresentialPayment está vazia ou removida se não for usada
const confirmPresentialPayment = asyncHandler(async (req, res) => {
    res.status(501).json({ message: 'Funcionalidade não implementada.'});
});


module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  createPresentialOrder, // <-- ADICIONADO ÀS EXPORTAÇÕES
  confirmPresentialPayment,
};