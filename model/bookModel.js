const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  book_Id: { type: Number, unique: true },
  Title: { type: String, required: true },        // বাংলা শিরোনাম
  Author: { type: String, required: true },       // বাংলা লেখক
  CategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  coverImage: String,                              // Image path or URL
  cellNumber: String,                              // বাংলা সেল নম্বর (বাংলা সংখ্যা)
  isAvailable: { type: Boolean, default: true }
});



const Book = mongoose.model('Book', bookSchema);
module.exports = Book;