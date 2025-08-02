// services/productService.js
const { db } = require('../config/firebase'); // <-- CORREÇÃO APLICADA

const findAll = async () => {
  const productsCollection = db.collection('products');
  const snapshot = await productsCollection.get();
  if (snapshot.empty) return [];
  
  const products = [];
  snapshot.forEach(doc => {
    products.push({ id: doc.id, ...doc.data() });
  });
  return products;
};

const findById = async (productId) => {
  const productRef = db.collection('products').doc(productId);
  const doc = await productRef.get();

  if (!doc.exists) {
    return null;
  }
  return { id: doc.id, ...doc.data() };
};

const create = async (productData) => {
  const docRef = await db.collection('products').add(productData);
  return docRef.id;
};

const update = async (productId, updatedData) => {
  const productRef = db.collection('products').doc(productId);
  await productRef.set(updatedData, { merge: true });
  return { id: productId, ...updatedData };
};

const remove = async (productId) => {
  const productRef = db.collection('products').doc(productId);
  await productRef.delete();
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};