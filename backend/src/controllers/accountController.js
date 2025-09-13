const AccountNotification = require('../models/AccountNotification');
const InstagramAccount = require('../models/InstagramAccount');

// Guardar notificaciones de cuentas (elimina previas)
exports.guardarAccountNotifications = async (req, res) => {
  try {
    const { userId, notifications } = req.body;
    if (!userId || !Array.isArray(notifications)) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }
    await AccountNotification.deleteMany({ userId });
    const docs = await AccountNotification.insertMany(
      notifications.map(n => ({ ...n, userId }))
    );
    res.status(201).json({ message: 'Account notifications guardadas', docs });
  } catch (err) {
    res.status(500).json({ message: 'Error al guardar account notifications', error: err.message });
  }
};

// Obtener notificaciones de cuentas
exports.obtenerAccountNotifications = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'Falta userId' });
    }
    const notifications = await AccountNotification.find({ userId }).sort({ date: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener account notifications', error: err.message });
  }
};

// Guardar cuentas vinculadas (elimina previas)
exports.guardarInstagramAccounts = async (req, res) => {
  try {
    const { userId, accounts } = req.body;
    if (!userId || !Array.isArray(accounts)) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }
    await InstagramAccount.deleteMany({ userId });
    const docs = await InstagramAccount.insertMany(
      accounts.map(acc => ({ ...acc, userId }))
    );
    res.status(201).json({ message: 'Cuentas IG guardadas', docs });
  } catch (err) {
    res.status(500).json({ message: 'Error al guardar cuentas IG', error: err.message });
  }
};

// Obtener cuentas vinculadas
exports.obtenerInstagramAccounts = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'Falta userId' });
    }
    const accounts = await InstagramAccount.find({ userId });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener cuentas IG', error: err.message });
  }
};
