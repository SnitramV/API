const { body, validationResult } = require('express-validator');

// Middleware para verificar o resultado da validação
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Se houver erros, retorna uma resposta 400 com os erros
    return res.status(400).json({ errors: errors.array() });
  }
  // Se não houver erros, passa para o próximo middleware (o controlador)
  next();
};

// Regras de validação para a criação de uma notícia
const createNewsValidator = [
  // O campo 'title' não pode estar vazio
  body('title')
    .notEmpty()
    .withMessage('O título da notícia é obrigatório.')
    .trim() // Remove espaços em branco no início e no fim
    .escape(), // Converte caracteres especiais para evitar ataques XSS

  // O campo 'content' deve ter no mínimo 10 caracteres
  body('content')
    .isLength({ min: 10 })
    .withMessage('O conteúdo da notícia deve ter pelo menos 10 caracteres.')
    .trim(),

  // O campo 'imageUrl' (se existir) deve ser um URL válido
  body('imageUrl')
    .optional() // Torna este campo opcional
    .isURL()
    .withMessage('O URL da imagem fornecido é inválido.'),

  // Após definir as regras, chama o handler para verificar os erros
  handleValidationErrors,
];

module.exports = {
  createNewsValidator,
};