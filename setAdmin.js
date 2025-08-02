// Ficheiro: API LIVE/setAdmin.js

require('dotenv').config();
const { admin } = require('./config/firebase');

// O UID correto, fornecido por si.
const uidParaAdmin = 'cEpYdR9zoHUkAfV4X6aUQiGDbJ32';

async function setAdminRole() {
    if (!uidParaAdmin) {
        console.error('\nERRO: O UID não foi definido no script.');
        return;
    }

    try {
        console.log(`\nA tentar atribuir a função 'admin' ao UID: ${uidParaAdmin}...`);

        // Define a permissão 'admin' para o utilizador especificado
        await admin.auth().setCustomUserClaims(uidParaAdmin, { role: 'admin' });

        // Confirma a alteração para termos a certeza
        const userRecord = await admin.auth().getUser(uidParaAdmin);

        console.log(`\n✅ SUCESSO!`);
        console.log(`   Utilizador: ${userRecord.email}`);
        console.log(`   Permissões atribuídas:`, userRecord.customClaims);
        console.log('\nAgora pode fazer login com este utilizador para obter um novo token de admin.');

    } catch (error) {
        console.error('\n❌ FALHA AO ATRIBUIR PERMISSÃO:', error.message);
    }
}

setAdminRole();