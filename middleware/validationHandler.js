const { validationResult } = require('express-validator');

/**
 * Middleware que verifica e manipula os erros de validação do express-validator.
 * Se houver erros, envia uma resposta 400. Caso contrário, continua para o próximo middleware.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Se houver erros, retorna uma resposta 400 com a lista de erros.
    return res.status(400).json({ errors: errors.array() });
  }
  // Se não houver erros, avança para o controlador.
  next();
};

module.exports = { handleValidationErrors };