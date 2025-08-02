const asyncHandler = require('../utils/asyncHandler');
const newsService = require('../services/newsService'); // <-- IMPORTA O NOVO SERVIÇO

/**
 * @desc    Cria uma nova notícia
 * @route   POST /api/news
 * @access  Private (Admin)
 */
const createNews = asyncHandler(async (req, res) => {
  const { title, content, imageUrl } = req.body;

  // Prepara os dados a serem enviados para o serviço
  const newsData = {
    title,
    content,
    imageUrl: imageUrl || null,
    authorId: req.user.uid,
    authorName: req.user.name || req.user.email,
  };

  const newNewsId = await newsService.create(newsData);

  res.status(201).json({ message: 'Notícia criada com sucesso', id: newNewsId });
});

/**
 * @desc    Busca todas as notícias
 * @route   GET /api/news
 * @access  Public
 */
const getAllNews = asyncHandler(async (req, res) => {
  const newsList = await newsService.findAll();
  res.status(200).json(newsList);
});

/**
 * @desc    Deleta uma notícia
 * @route   DELETE /api/news/:newsId
 * @access  Private (Admin)
 */
const deleteNews = asyncHandler(async (req, res) => {
  const { newsId } = req.params;
  const wasDeleted = await newsService.deleteById(newsId);

  if (!wasDeleted) {
    return res.status(404).json({ message: 'Notícia não encontrada.' });
  }

  res.status(200).json({ message: 'Notícia deletada com sucesso.' });
});

module.exports = {
  createNews,
  getAllNews,
  deleteNews,
};