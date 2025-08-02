// services/salesService.js
const { google } = require('googleapis');

// Função para adicionar uma linha de venda na planilha
const appendSaleToSheet = async (saleData) => {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'firebase-credentials.json',
      scopes: 'https://www.googleapis.com/auth/spreadsheets', // Escopo de escrita
    });
    const sheets = google.sheets({ version: 'v4', auth });

    // IMPORTANTE: Substitua pelo ID da sua planilha de VENDAS
    const spreadsheetId = '1pL86T51Nid8M9SWQsXic5gQtD4Jy5AQEaGrZ2TAds-o';
    const range = 'Vendas!A1'; // A API vai adicionar a partir da primeira linha vazia

    // Formata os dados para uma linha da planilha
    const row = [
      saleData.id,
      new Date(saleData.createdAt.toDate()).toLocaleString("pt-BR"),
      saleData.userId,
      saleData.items.map(item => `${item.quantity}x ${item.name}`).join(', '),
      saleData.totalAmount,
      saleData.status,
      saleData.pointsUsed || 0,
      saleData.pointsEarned || 0,
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED', // Trata os dados como se tivessem sido digitados
      resource: {
        values: [row],
      },
    });
    console.log('Venda adicionada à planilha com sucesso.');

  } catch (error) {
    // Logamos o erro, mas não paramos a operação do pedido por causa disso
    console.error('ERRO CRÍTICO: Falha ao adicionar venda na planilha:', error);
  }
};

module.exports = {
  appendSaleToSheet,
};