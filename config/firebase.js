// config/firebase.js
const admin = require('firebase-admin');

// Carrega as credenciais do arquivo JSON que você baixou
const serviceAccount = require('../firebase-credentials.json');

// Inicializa o app APENAS UMA VEZ
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

// Exporta a instância do Firestore E a instância principal do admin
const db = admin.firestore();

console.log("Conexão com o Firebase estabelecida com sucesso.");

module.exports = { db, admin };