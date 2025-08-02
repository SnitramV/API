const { db, admin } = require('../config/firebase');
const productService = require('../services/productService');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/products
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await productService.findAll();
  res.json(products);
});

// GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Produto não encontrado.' });
  }
  res.json(product);
});

// POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  const newProductId = await productService.create(req.body);
  res.status(201).json({ id: newProductId, ...req.body });
});

// PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const updatedProduct = await productService.update(req.params.id, req.body);
  if (!updatedProduct) {
      return res.status(404).json({ message: 'Produto não encontrado para atualizar.' });
  }
  res.json(updatedProduct);
});

// DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  await productService.remove(req.params.id);
  res.status(204).send();
});

// POST /api/products/:productId/adjust-stock
const adjustStock = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  const productRef = db.collection('products').doc(productId);
  const doc = await productRef.get();

  if (!doc.exists) {
    return res.status(404).json({ message: 'Produto não encontrado.' });
  }

  await productRef.update({
    stock: admin.firestore.FieldValue.increment(quantity)
  });

  res.status(200).json({
    message: `Estoque do produto ${productId} ajustado em ${quantity} unidades.`
  });
});

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustStock,
};