const rateLimit = require('express-rate-limit');

/**
 * Limitador de pedidos para rotas sensíveis (login, recuperação de senha, etc.).
 * Permite 10 pedidos a cada 15 minutos por IP.
 */
const sensitiveRoutesLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Limita cada IP a 10 pedidos por 'windowMs'
  message: 'Demasiados pedidos a partir deste IP. Por favor, tente novamente após 15 minutos.',
  standardHeaders: true, // Retorna a informação do limite nos cabeçalhos `RateLimit-*`
  legacyHeaders: false, // Desativa os cabeçalhos `X-RateLimit-*` (legacy)
});

module.exports = {
    sensitiveRoutesLimiter,
};