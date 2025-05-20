const mongoose = require('mongoose');
const Admin = require('../model/admins'); // Adjust the path as needed
const Book = require('../model/bookModel');
const Category = require('../model/categoryModel');
const Counter = require('../model/Counter');

// MongoDB connection URI


const uri = 'mongodb+srv://user2000:test234@cluster0.q0qseq1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB using Mongoose
async function connectToDatabase() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected successfully to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
}

//.....................................

async function getNextSequence(name) {
  const counter = await Counter.findOneAndUpdate(
    { id: name },
    { $inc: { seq: 1} },
    { new: true, upsert: true }
  );
  return counter.seq;
}
//...............................................

async function insertInitialData() {
  try {
    // ১. পুরানো ডাটা ডিলিট করুন
    await Book.deleteMany({});
    await Category.deleteMany({});
    await Counter.updateOne(
      { id: 'book_Id' },
      { $set: { seq: 0 } },
      { upsert: true }
    );

    // ২. ক্যাটাগরি তৈরি করুন
    const categoriesData = [
      { catName: 'Fiction' },
      { catName: 'Science Fiction' },
      { catName: 'Romance' },
      { catName: 'Mystery' }
    ];
    const insertedCategories = await Category.insertMany(categoriesData);

    // ৩. বইয়ের ডাটা তৈরি করুন book_Id সহ
    const booksData = [
      {
        book_Id: await getNextSequence('book_Id'),
        Title: "Harry Potter and the Philosopher's Stone",
        Author: 'J.K. Rowling',
        CategoryId: insertedCategories[0]._id
      },
      {
        book_Id: await getNextSequence('book_Id'),
        Title: 'Dune',
        Author: 'Frank Herbert',
        CategoryId: insertedCategories[1]._id
      },
      {
        book_Id: await getNextSequence('book_Id'),
        Title: 'Pride and Prejudice',
        Author: 'Jane Austen',
        CategoryId: insertedCategories[2]._id
      },
      {
        book_Id: await getNextSequence('book_Id'),
        Title: 'Sherlock Holmes',
        Author: 'Arthur Conan Doyle',
        CategoryId: insertedCategories[3]._id
      }
    ];

    await Book.insertMany(booksData);

    console.log('✅ Categories and Books inserted successfully ');
  } catch (error) {
    console.error('❌ Error inserting data:', error);
  }
}

async function addAdmin(name, email, password, picture, bio) {
  try {
    // Create a new admin document
    const newAdmin = new Admin({
      name: name,
      email: email,
      password: password,
      picture: picture,
      bio: bio
    });

    // Save the new admin document to the database
    await newAdmin.save();
    console.log('Admin saved successfully');
  } catch (err) {
    console.error('Error saving admin:', err);
    throw err; // Propagate the error
  }
}


module.exports = addAdmin;
connectToDatabase();
module.exports = insertInitialData;
