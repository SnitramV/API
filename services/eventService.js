const { google } = require('googleapis');
const { db, admin } = require('../config/firebase');

/**
 * Busca os eventos públicos de uma planilha do Google Sheets.
 * @returns {Array<object>} Uma lista de eventos.
 */
const getEventsFromSheet = async () => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'firebase-credentials.json',
      scopes: 'https://www.googleapis.com/auth/spreadsheets.readonly',
    });
    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = '1AdlD6eT8uw_OeLB0Cfo-BDte45GkeApQ8zSg3Q4sIx8'; 
    const range = 'Eventos!A2:C';

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    return rows.map(row => ({
      name: row[0],
      date: row[1],
      description: row[2]
    }));

  } catch (error) {
    console.error('Erro ao buscar eventos da planilha:', error);
    throw new Error('Falha ao buscar dados de eventos da planilha.');
  }
};

/**
 * Encontra um evento pelo seu ID e apaga-o permanentemente do Firestore.
 * @param {string} eventId - O ID do evento a ser apagado.
 * @throws {Error} Se o evento não for encontrado.
 */
const deleteEvent = async (eventId) => {
    // Cria uma referência para o documento do evento no Firestore
    const eventRef = db.collection('events').doc(eventId);
    
    // Obtém o documento para verificar se ele existe antes de tentar apagar
    const eventDoc = await eventRef.get();

    // Validação: Verifica se o evento existe
    if (!eventDoc.exists) {
        throw new Error(`Evento com ID ${eventId} não encontrado.`);
    }

    // Executa a operação de apagar
    await eventRef.delete();

    // NOTA: Se o evento tiver sub-coleções (como 'checkins'), elas não são apagadas automaticamente.
    // Para um sistema mais complexo, seria necessário apagar as sub-coleções de forma recursiva.
    // Para o seu caso de uso atual, esta abordagem é suficiente.

    logger.info(`O evento ${eventId} foi apagado permanentemente da base de dados.`);
};


/**
 * Cria um novo evento para check-in no Firestore.
 * @param {object} eventData - Dados do evento (name, date, points).
 * @returns {string} O ID do novo evento criado.
 */
const createCheckinEvent = async (eventData) => {
    const eventRef = await db.collection('events').add({
        ...eventData,
        points: Number(eventData.points),
        isActive: true,
        createdAt: new Date(),
    });
    return eventRef.id;
};

/**
 * Processa o check-in de um utilizador num evento.
 * @param {string} eventId - O ID do evento.
 * @param {string} userId - O ID do utilizador que faz o check-in.
 * @returns {object} Um objeto com os pontos ganhos e o nome do evento.
 */
const processCheckIn = async (eventId, userId, points) => {
    logger.info(`Processando check-in para o evento ${eventId} e usuário ${userId} com ${points} pontos.`);
    const eventRef = db.collection('events').doc(eventId);
    const userRef = db.collection('users').doc(userId);

    // Validação dos pontos
    const pointsToAward = Number(points);
    if (isNaN(pointsToAward) || pointsToAward <= 0) {
        logger.warn(`Pontos inválidos (${points}) fornecidos para o check-in do evento ${eventId}. O check-in será registrado sem conceder pontos.`);
        // Mesmo sem pontos, registramos o check-in
        await eventRef.collection('checkins').doc(userId).set({
            checkedInAt: admin.firestore.FieldValue.serverTimestamp(),
            userId: userId
        });
        // Retornamos um aviso para a API saber o que aconteceu
        return { message: 'Check-in realizado com sucesso, mas nenhum ponto foi concedido por valor inválido.', pointsAwarded: 0 };
    }

    // Se os pontos são válidos, continue com a transação
    try {
        await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) {
                throw new Error('Usuário não encontrado para dar os pontos.');
            }

            // Registrar o check-in na subcoleção do evento
            const checkInRef = eventRef.collection('checkins').doc(userId);
            transaction.set(checkInRef, {
                checkedInAt: admin.firestore.FieldValue.serverTimestamp(),
                userId: userId,
                pointsAwarded: pointsToAward
            });

            // Atualizar os pontos do usuário
            transaction.update(userRef, {
                points: admin.firestore.FieldValue.increment(pointsToAward)
            });
        });

        logger.info(`Check-in e concessão de ${pointsToAward} pontos para o usuário ${userId} no evento ${eventId} concluídos com sucesso.`);
        return { message: 'Check-in e pontos concedidos com sucesso.', pointsAwarded: pointsToAward };
    } catch (error) {
        logger.error(`Erro na transação de check-in para o evento ${eventId}: ${error.message}`);
        throw error;
    }
};

module.exports = {
  getEventsFromSheet,
  createCheckinEvent,
  processCheckIn,
  deleteEvent,
};