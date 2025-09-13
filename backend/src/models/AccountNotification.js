const mongoose = require('mongoose');

const AccountNotificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  accountId: { type: String, required: true },
  type: { type: String, required: true }, // 'vinculada', 'desactivada', 'eliminada', etc.
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
  extra: { type: Object, default: {} }
});

module.exports = mongoose.model('AccountNotification', AccountNotificationSchema);
