const { body } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validationHandler');

const createNotificationValidator = [
    body('name').notEmpty().withMessage('O nome da notificação é obrigatório.').trim(),
    body('botContent').notEmpty().withMessage('O conteúdo para o bot é obrigatório.'),
    body('appContent').notEmpty().withMessage('O conteúdo para a app é obrigatório.'),
    body('appContent.title').notEmpty().withMessage('O título do push (appContent.title) é obrigatório.'),
    body('appContent.body').notEmpty().withMessage('O corpo do push (appContent.body) é obrigatório.'),
    body('scheduledAt').isISO8601().withMessage('A data de agendamento é obrigatória e deve estar no formato ISO8601.'),
    body('repeats').optional().isIn(['once', 'weekly']).withMessage("O campo 'repeats' deve ser 'once' ou 'weekly'."),
    body('targetGroups').optional().isArray().withMessage('Os grupos alvo devem ser um array de IDs.'),
    handleValidationErrors,
];

module.exports = {
    createNotificationValidator,
};