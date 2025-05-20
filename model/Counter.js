const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  id: String,
  seq: Number
});

module.exports = mongoose.model('Counter', counterSchema);
