// services/sheetSyncService.js
const { google } = require('googleapis');
const { db, admin } = require('../config/firebase');

// Função principal de sincronização
const syncProductsFromSheet = async () => {
  try {
    // 1. AUTENTICAÇÃO
    const auth = new google.auth.GoogleAuth({
      keyFile: 'firebase-credentials.json', // O mesmo arquivo de credenciais
      scopes: 'https://www.googleapis.com/auth/spreadsheets',
    });
    const sheets = google.sheets({ version: 'v4', auth });

    // 2. BUSCAR DADOS DA PLANILHA
    // Substitua pelo ID e pelo nome/intervalo da sua planilha
    const spreadsheetId = '1B9UNjmk7KTmTdHViKNR2S-9Qxnc13T2_os4_2mLjgm8'; 
    const range = 'Produtos!A2:D'; // Ex: Página 'Produtos', da célula A2 até a coluna D

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log('Nenhum dado encontrado na planilha.');
      return { success: true, message: 'Nenhum dado na planilha para sincronizar.' };
    }

    // 3. PROCESSAR E SALVAR NO FIRESTORE
    console.log(`Encontrados ${rows.length} produtos para sincronizar.`);
    const batch = db.batch(); // Usamos um 'batch' para salvar tudo de uma vez

    rows.forEach(row => {
      // Supondo que suas colunas são: ID, Nome, Preço, Estoque
      const [id, name, price, stock] = row;

      // Ignora linhas que não têm um ID ou nome
      if (!id || !name) return;

      const productRef = db.collection('products').doc(id.trim());
      batch.set(productRef, {
        name: name,
        price: parseFloat(price) || 0, // Converte para número
        stock: parseInt(stock) || 0,   // Converte para número inteiro
      });
    });

    // 4. EXECUTAR O BATCH
    await batch.commit();

    console.log('Sincronização com o Firestore concluída com sucesso.');
    return { success: true, message: `Sincronizados ${rows.length} produtos.` };

  } catch (error) {
    console.error('Erro durante a sincronização da planilha:', error);
    // Retorna o erro para que o controller possa lidar com ele
    throw new Error('Falha ao sincronizar dados da planilha.');
  }
};

module.exports = {
  syncProductsFromSheet,
};