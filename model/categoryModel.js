const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
  catName: { type: String, required: true }
});
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;