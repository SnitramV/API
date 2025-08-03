// Ficheiro: APIv10/validators/eventValidators.js (VERSÃO CORRIGIDA)

const { body, param } = require('express-validator');

// Validador para a criação de eventos
const createEventValidator = [
    body('name')
        .trim()
        .notEmpty().withMessage('O nome do evento é obrigatório.'),

    body('date')
        .isISO8601().withMessage('A data deve estar no formato ISO8601 (YYYY-MM-DD).'),

    body('points')
        .isInt({ min: 1 }).withMessage('Os pontos devem ser um número inteiro positivo.')
];

// Validador para o check-in em eventos
const checkInValidator = [
    param('eventId')
        .trim()
        .notEmpty().withMessage('O ID do evento é obrigatório na URL.')
        .isString().withMessage('O ID do evento deve ser um texto.')
];

module.exports = {
    createEventValidator,
    checkInValidator,
};