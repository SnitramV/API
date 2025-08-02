// API LIVE/server.js (VERSÃO CORRIGIDA E SIMPLIFICADA)

require('dotenv').config();

// Ao importar 'app', todas as configurações do Express são carregadas.
const app = require('./app');

// Ao importar o arquivo de configuração do Firebase, a conexão é estabelecida.
// Não é necessário chamar uma função separada.
require('./config/firebase');

// Define a porta para o servidor. Usa a do .env ou 3000 como padrão.
const PORT = process.env.PORT || 3000;

// Inicia o servidor Express para receber requisições HTTP
app.listen(PORT, () => {
    console.log(`🚀 API principal rodando com sucesso na porta ${PORT}`);
    console.log(`🔗 Acessível em: http://localhost:${PORT}`);
});