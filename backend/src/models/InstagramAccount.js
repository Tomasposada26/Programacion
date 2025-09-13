const mongoose = require('mongoose');

const InstagramAccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  username: { type: String, required: true },
  linkedAt: { type: Date, required: true },
  active: { type: Boolean, default: true },
  expiresAt: { type: Date },
  autoRefresh: { type: Boolean, default: true }
});

module.exports = mongoose.model('InstagramAccount', InstagramAccountSchema);
