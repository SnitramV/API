const { db } = require('../config/firebase');

/**
 * Cria uma nova notícia na base de dados.
 * @param {object} newsData - Os dados da notícia (title, content, imageUrl, authorId, authorName).
 * @returns {string} O ID da nova notícia criada.
 */
const create = async (newsData) => {
  const newsRef = await db.collection('news').add({
    ...newsData,
    createdAt: new Date(),
  });
  return newsRef.id;
};

/**
 * Busca todas as notícias, ordenadas pela mais recente.
 * @returns {Array<object>} Uma lista de notícias.
 */
const findAll = async () => {
  const snapshot = await db.collection('news').orderBy('createdAt', 'desc').get();
  if (snapshot.empty) {
    return [];
  }
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Apaga uma notícia pelo seu ID.
 * @param {string} newsId - O ID da notícia a ser apagada.
 * @returns {boolean} Retorna true se a notícia foi encontrada e apagada, false caso contrário.
 */
const deleteById = async (newsId) => {
  const newsRef = db.collection('news').doc(newsId);
  const doc = await newsRef.get();

  if (!doc.exists) {
    return false; // Indica que a notícia não foi encontrada
  }

  await newsRef.delete();
  return true; // Indica que a operação foi bem-sucedida
};

module.exports = {
  create,
  findAll,
  deleteById,
};