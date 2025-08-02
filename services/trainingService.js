const { db } = require('../config/firebase');

/**
 * Cria um novo treino na base de dados.
 * @param {object} trainingData - Dados do treino (sport, date, time, location, gender, coachId, coachName).
 * @returns {string} O ID do novo treino criado.
 */
const create = async (trainingData) => {
    const trainingRef = await db.collection('trainings').add({
        ...trainingData,
        createdAt: new Date(),
    });
    return trainingRef.id;
};

/**
 * Busca todos os próximos treinos, ordenados por data e hora.
 * @returns {Array<object>} Uma lista de treinos.
 */
const findUpcoming = async () => {
    const today = new Date().toISOString().split('T')[0];

    const snapshot = await db.collection('trainings')
        .where('date', '>=', today)
        .orderBy('date', 'asc')
        .orderBy('time', 'asc')
        .get();

    if (snapshot.empty) {
        return [];
    }

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * Apaga um treino pelo seu ID.
 * @param {string} trainingId - O ID do treino a ser apagado.
 * @returns {boolean} Retorna true se o treino foi encontrado e apagado, false caso contrário.
 */
const deleteById = async (trainingId) => {
    const trainingRef = db.collection('trainings').doc(trainingId);
    const doc = await trainingRef.get();

    if (!doc.exists) {
        return false;
    }

    await trainingRef.delete();
    return true;
};

module.exports = {
    create,
    findUpcoming,
    deleteById,
};