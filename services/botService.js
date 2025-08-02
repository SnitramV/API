// APIv6/services/botService.js

const axios = require('axios');
const logger = require('../config/logger');

// A URL base da API interna do seu bot de WhatsApp.
// Certifique-se de que esta variável está no seu arquivo .env
const BOT_API_URL = process.env.BOT_API_URL || 'http://localhost:3001';

/**
 * Função genérica para enviar mensagens através da API do bot.
 * @param {string} number - O número ou ID do grupo para enviar a mensagem.
 * @param {string} message - O conteúdo da mensagem.
 * @returns {Promise<object>} A resposta da API do bot.
 */
const sendMessage = async (number, message) => {
  try {
    logger.info(`Tentando enviar mensagem para ${number} via bot.`);
    const response = await axios.post(`${BOT_API_URL}/send-message`, {
      number, // Pode ser um ID de grupo ou número de usuário
      message,
    });
    logger.info(`Mensagem enviada com sucesso para ${number}. Resposta do bot: ${response.data.message}`);
    return response.data;
  } catch (error) {
    logger.error(`Erro ao enviar mensagem para ${number}: ${error.response ? error.response.data.error : error.message}`);
    throw new Error('Falha ao comunicar com o serviço do bot.');
  }
};

/**
 * Envia uma mensagem para um grupo de WhatsApp específico.
 * É um apelido para a função sendMessage para clareza no código.
 * @param {string} groupId - O ID do grupo (ex: '1234567890@g.us').
 * @param {string} message - A mensagem a ser enviada.
 */
const sendMessageToGroup = async (groupId, message) => {
  logger.info(`Encaminhando chamada para sendMessageToGroup para o grupo: ${groupId}`);
  return sendMessage(groupId, message);
};

/**
 * Envia uma mensagem para um usuário de WhatsApp específico.
 * É um apelido para a função sendMessage para clareza no código.
 * @param {string} userNumber - O número do usuário (ex: '5511999998888@c.us').
 * @param {string} message - A mensagem a ser enviada.
 */
const sendMessageToUser = async (userNumber, message) => {
  logger.info(`Encaminhando chamada para sendMessageToUser para o usuário: ${userNumber}`);
  return sendMessage(userNumber, message);
};

/**
 * Pede ao bot para sincronizar sua lista de grupos com o Firestore.
 * O bot será responsável por pegar sua lista interna de grupos e enviá-la
 * para um endpoint da API que a salvará no banco.
 */
const syncGroupsToFirestore = async () => {
  try {
    logger.info('Enviando requisição para o bot sincronizar os grupos com o Firestore.');
    const response = await axios.post(`${BOT_API_URL}/sync-groups`);
    logger.info(`Requisição de sincronização enviada com sucesso. Resposta do bot: ${response.data.message}`);
    return response.data;
  } catch (error) {
    logger.error(`Erro ao solicitar a sincronização de grupos: ${error.response ? error.response.data.error : error.message}`);
    throw new Error('Falha ao comunicar com o serviço do bot para sincronização.');
  }
};

module.exports = {
  sendMessage,
  sendMessageToGroup,
  sendMessageToUser,
  syncGroupsToFirestore,
};