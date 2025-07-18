const mongoose = require('mongoose');

const VaultItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  site: String,
  username: String,
  passwordEncrypted: String
}, { timestamps: true });

module.exports = mongoose.model('VaultItem', VaultItemSchema);
