const logger = require('../config/logger'); // <-- IMPORTA O LOGGER

/**
 * Middleware de erro global.
 */
const errorHandler = (err, req, res, next) => {
  // Usa o logger para registar o erro com o nível 'error'
  logger.error(err.message);
  // Também podemos registar o stack trace completo num nível de depuração
  logger.debug(err.stack);

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message || 'Ocorreu um erro inesperado no servidor.',
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

module.exports = { errorHandler };