const morgan = require('morgan');
const logger = require('../config/logger');

// Cria um stream que pode ser usado pelo morgan para redirecionar
// os logs para o winston.
const stream = {
  // Usa o nível 'http' do winston, que definimos na configuração.
  write: (message) => logger.http(message.trim()),
};

// Pula os logs em ambiente de teste
const skip = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'test';
};

// Formato de log do Morgan
// :remote-addr :method :url :status :res[content-length] - :response-time ms
const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream, skip }
);

module.exports = morganMiddleware;