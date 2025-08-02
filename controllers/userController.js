const { db, admin } = require('../config/firebase');
const asyncHandler = require('../utils/asyncHandler');
const botService = require('../services/botService');

/**
 * Sincroniza o perfil do usuário.
 */
const syncUserProfile = asyncHandler(async (req, res) => {
  const { uid, name, email, phone_number } = req.user;
  const userRef = db.collection('users').doc(uid);
  const doc = await userRef.get();

  if (!doc.exists) {
    console.log(`Criando perfil para o novo usuário: ${uid}`);
    await userRef.set({
      name: name || 'Usuário sem nome',
      email: email || null,
      phoneNumber: phone_number || null,
      createdAt: new Date(),
      points: 0,
      role: 'student',
      isProfileComplete: false,
    });
    return res.status(201).json({ message: 'Perfil de usuário criado com sucesso.', profileStatus: 'incomplete' });
  } else {
    return res.status(200).json({ message: 'Perfil de usuário já sincronizado.', profileStatus: doc.data().isProfileComplete ? 'complete' : 'incomplete' });
  }
});

/**
 * Adiciona pontos a um usuário.
 */
const addPointsToUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { points } = req.body;

  const userRef = db.collection('users').doc(userId);
  const doc = await userRef.get();

  if (!doc.exists) {
    return res.status(404).json({ message: 'Usuário não encontrado.' });
  }

  await userRef.update({
    points: admin.firestore.FieldValue.increment(points)
  });

  res.status(200).json({
    message: `${points} pontos adicionados com sucesso ao usuário ${userId}.`
  });
});

/**
 * Busca o perfil do usuário logado.
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const { uid } = req.user;
  const userRef = db.collection('users').doc(uid);
  const doc = await userRef.get();

  if (!doc.exists) {
    return res.status(404).json({ message: 'Perfil de usuário não encontrado no banco de dados.' });
  }

  res.status(200).json({ id: doc.id, ...doc.data() });
});

/**
 * Completa o perfil do usuário.
 */
const completeUserProfile = asyncHandler(async (req, res) => {
  const { uid } = req.user;
  const {
      firstName, lastName, nickname, cpf, birthDate, gender, phoneNumber
  } = req.body;

  const userRef = db.collection('users').doc(uid);
  let newRole = 'student';

  const memberRef = db.collection('specialMembers').doc(phoneNumber);
  const memberDoc = await memberRef.get();

  if (memberDoc.exists) {
      newRole = memberDoc.data().role || 'member';
      console.log(`Usuário ${uid} promovido para a role '${newRole}' através do telefone.`);
  }

  await userRef.update({
      name: `${firstName} ${lastName}`,
      nickname: nickname || null,
      cpf,
      birthDate,
      gender,
      phoneNumber,
      role: newRole,
      isProfileComplete: true,
  });

  res.status(200).json({ message: 'Perfil completado com sucesso!', newRole: newRole });
});

/**
 * Registra o token de notificação de um dispositivo.
 */
const registerDeviceToken = asyncHandler(async (req, res) => {
  const { uid } = req.user;
  const { token, deviceId } = req.body;

  const tokenRef = db.collection('users').doc(uid).collection('fcmTokens').doc(deviceId);

  await tokenRef.set({
      token: token,
      updatedAt: new Date(),
  });

  res.status(200).json({ message: 'Dispositivo registrado para notificações com sucesso.' });
});

/**
 * Atualiza o perfil do usuário.
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  const { uid } = req.user;
  const { firstName, lastName, nickname, phoneNumber, email } = req.body;

  const userRef = db.collection('users').doc(uid);
  const dataToUpdate = {
      name: `${firstName} ${lastName}`,
      nickname: nickname || null,
      phoneNumber: phoneNumber || null,
      email: email || req.user.email,
  };

  if (email && email !== req.user.email) {
      await admin.auth().updateUser(uid, { email });
  }

  await userRef.update(dataToUpdate);
  res.status(200).json({ message: 'Perfil atualizado com sucesso!' });
});

/**
 * Exclui a conta do utilizador (Firestore e Auth).
 */
const deleteUserAccount = asyncHandler(async (req, res) => {
  const { uid } = req.user;
  const batch = db.batch();
  const userRef = db.collection('users').doc(uid);

  batch.delete(userRef);
  await admin.auth().deleteUser(uid);
  await batch.commit();

  res.status(200).json({ message: 'Conta excluída com sucesso.' });
});

/**
 * Solicita alteração de dados sensíveis.
 */
const requestSensitiveDataChange = asyncHandler(async (req, res) => {
  const { uid } = req.user;
  const { action, newValue } = req.body;

  const userRef = db.collection('users').doc(uid);
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await userRef.update({
      verificationCode: { code, action, newValue, expiresAt }
  });

  const userDoc = await userRef.get();
  const phoneNumber = userDoc.data().phoneNumber;
  if (!phoneNumber) {
      return res.status(400).json({ message: "Nenhum número de telemóvel registado para enviar o código." });
  }

  const whatsappId = phoneNumber.replace(/[^0-9]/g, '') + '@c.us';
  const message = `Seu código de verificação para alterar ${action === 'updatePassword' ? 'a sua senha' : 'o seu número de telemóvel'} é: *${code}*`;

  await botService.sendMessageToUser(whatsappId, message);

  res.status(200).json({ message: "Código de verificação enviado para o seu WhatsApp." });
});

/**
 * Verifica o código e executa a alteração.
 */
const verifyAndSaveChanges = asyncHandler(async (req, res) => {
  const { uid } = req.user;
  const { code } = req.body;

  const userRef = db.collection('users').doc(uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists || !userDoc.data().verificationCode) {
    return res.status(400).json({ message: "Nenhuma verificação pendente encontrada." });
  }

  const verificationData = userDoc.data().verificationCode;

  if (verificationData.expiresAt.toDate() < new Date()) {
    return res.status(400).json({ message: "Código de verificação expirado." });
  }
  if (verificationData.code !== code) {
    return res.status(400).json({ message: "Código de verificação inválido." });
  }

  if (verificationData.action === 'updatePassword') {
    await admin.auth().updateUser(uid, { password: verificationData.newValue });
  } else if (verificationData.action === 'updatePhone') {
    await userRef.update({ phoneNumber: verificationData.newValue });
  }

  await userRef.update({ verificationCode: admin.firestore.FieldValue.delete() });

  res.status(200).json({ message: "Alteração realizada com sucesso!" });
});


module.exports = {
  syncUserProfile,
  addPointsToUser,
  getUserProfile,
  completeUserProfile,
  registerDeviceToken,
  updateUserProfile,
  deleteUserAccount,
  requestSensitiveDataChange,
  verifyAndSaveChanges
};