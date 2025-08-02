const asyncHandler = require('../utils/asyncHandler');
const trainingService = require('../services/trainingService');

/**
 * @desc    Agenda um novo treino
 * @route   POST /api/trainings
 * @access  Private (Admin, Coach)
 */
const createTraining = asyncHandler(async (req, res) => {
    const { sport, date, time, location, gender } = req.body;

    const trainingData = {
        sport,
        date,
        time,
        location,
        gender,
        coachId: req.user.uid,
        coachName: req.user.name || req.user.email,
    };

    const newTrainingId = await trainingService.create(trainingData);

    res.status(201).json({ message: 'Treino agendado com sucesso', id: newTrainingId });
});

/**
 * @desc    Lista os próximos treinos
 * @route   GET /api/trainings
 * @access  Public
 */
const getUpcomingTrainings = asyncHandler(async (req, res) => {
    const trainingList = await trainingService.findUpcoming();
    res.status(200).json(trainingList);
});

/**
 * @desc    Cancela/deleta um treino
 * @route   DELETE /api/trainings/:trainingId
 * @access  Private (Admin, Coach)
 */
const deleteTraining = asyncHandler(async (req, res) => {
    const { trainingId } = req.params;
    const wasDeleted = await trainingService.deleteById(trainingId);

    if (!wasDeleted) {
        return res.status(404).json({ message: 'Treino não encontrado.' });
    }

    res.status(200).json({ message: 'Treino cancelado com sucesso.' });
});

module.exports = {
    createTraining,
    getUpcomingTrainings,
    deleteTraining,
};