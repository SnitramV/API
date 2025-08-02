/**
 * "Embrulha" uma função assíncrona de um controlador.
 * Executa a função e captura qualquer erro, passando-o para o próximo
 * middleware de erro do Express.
 * @param {Function} fn A função assíncrona do controlador.
 * @returns {Function} Uma nova função que pode ser usada como middleware de rota.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;