// DELETE /api/instagram-token/simulate-link/:id
exports.deleteSimulatedAccount = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: 'No autorizado' });
    const { id } = req.params;
    const deleted = await require('../models/InstagramAccount').findOneAndDelete({ _id: id, userId });
    if (!deleted) return res.status(404).json({ error: 'No encontrada' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar la cuenta' });
  }
};
const InstagramAccount = require('../models/InstagramAccount');

// POST /api/instagram-token/simulate-link
exports.simulateLink = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: 'No autorizado' });
    const { username, linkedAt, active } = req.body;
    if (!username || !linkedAt) return res.status(400).json({ error: 'Faltan datos' });

    const account = new InstagramAccount({
      userId,
      username,
      linkedAt,
      active: active !== undefined ? active : true
    });
    await account.save();
    res.status(201).json({ success: true, account });
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar la cuenta' });
  }
};

// GET /api/instagram-token/user-accounts
exports.getUserAccounts = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: 'No autorizado' });
    const accounts = await InstagramAccount.find({ userId });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener cuentas' });
  }
};
