
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../model/admins'); 
const authenticateToken = require('../Middleware/auth');

const upload = require('../Middleware/upload');
const  db  =require('../data/database');
const methodOverride = require ('method-override');
router.use(methodOverride('_method'));
const path = require('path');
const Book = require('../model/bookModel'); 
const Category = require('../model/categoryModel');
const Counter = require('../model/Counter');

//.........................
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find(); 
        res.render('home', { categories }); 
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).send('Error loading home page');
    }
});
//..........................................................
router.get('/admindeshboard', async (req, res) => {
  try {
    const books = await Book.find().populate('CategoryId'); 
    res.render('admindeshboard', { books });
  } catch (err) {
    console.error('Error fetching books:', err.message);
    res.status(500).send('Error fetching posts'); 
  }
});
//.........................................

// Display login form



// Add this to your routes


// Display registration form
router.get('/milestore', (req, res) => {
    res.render('milestore'); // Assuming register.ejs is in your views folder
  });



  router.get('/EventCalender', (req, res) => {
    res.render('EventCalender'); // Assuming register.ejs is in your views folder
  });

//.......................................


router.get('/LibraryMembershipActivation', (req, res) => {
    res.render('LibraryMembershipActivation'); // Assuming register.ejs is in your views folder
  });


router.get('/BorrowingPrivilege', (req, res) => {
    res.render('BorrowingPrivilege'); // Assuming register.ejs is in your views folder
  });

router.get('/StudyPods', (req, res) => {
    res.render('StudyPods'); // Assuming register.ejs is in your views folder
  });

router.get('/Kanopy', (req, res) => {
    res.render('Kanopy'); // Assuming register.ejs is in your views folder
  });

//...........................................................
router.get('/Accesstoebooks', (req, res) => {
    res.render('Accesstoebooks'); // Assuming register.ejs is in your views folder
  });

router.get('/DatabaseA-Z', (req, res) => {
    res.render('DatabaseA-Z'); // Assuming register.ejs is in your views folder
  });

router.get('/OpenAccesseBooks', (req, res) => {
    res.render('OpenAccesseBooks'); // Assuming register.ejs is in your views folder
  });

router.get('/InstitutionalRepository', (req, res) => {
    res.render('InstitutionalRepository'); // Assuming register.ejs is in your views folder
  });


router.get('/AccesstoKanopyr', (req, res) => {
    res.render('AccesstoKanopyr'); // Assuming register.ejs is in your views folder
  });
//...............................................................................

router.get('/Architecture', (req, res) => {
    res.render('Architecture'); // Assuming register.ejs is in your views folder
  });

  router.get('/ComputerSceince', (req, res) => {
    res.render('ComputerSceince'); // Assuming register.ejs is in your views folder
  });

  router.get('/Business', (req, res) => {
    res.render('Business'); // Assuming register.ejs is in your views folder
  });

  router.get('/ENH', (req, res) => {
    res.render('ENH'); // Assuming register.ejs is in your views folder
  });

//..............................................................



  router.get('/DOWNLOADS', (req, res) => {
    res.render('DOWNLOADS'); // Assuming register.ejs is in your views folder
  });

    router.get('/CONTACTS', (req, res) => {
    res.render('CONTACTS'); // Assuming register.ejs is in your views folder
  });
//........................................................................

  router.get('/OpenAccessWeek', (req, res) => {
    res.render('OpenAccessWeek'); // Assuming register.ejs is in your views folder
  });


router.get('/libraryUserPolicy', (req, res) => {
    res.render('libraryUserPolicy'); // Assuming register.ejs is in your views folder
  });

  
  router.get('/register', (req, res) => {
    res.render('register'); // Assuming register.ejs is in your views folder
  });
    // Display registration form
router.get('/login', (req, res) => {
  res.render('login'); // Assuming register.ejs is in your views folder

});
    // Display registration form
router.get('/adminlogin', (req, res) => {
  res.render('adminlogin'); // Assuming register.ejs is in your views folder

})

    // Display registration form



// Rrgister kaj korbe 

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      // Check if email already exists in the database
      const existingAdmin = await Admin.findOne({ email: email });
      if (existingAdmin) {
        return res.render('register', { errorMessage: 'Email already exists' });
      }
  
      // Validate the password
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
      if (!passwordRegex.test(password)) {
        return res.render('register', { errorMessage: 'Password must be at least 6 characters long and contain at least one uppercase and one lowercase letter' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new admin document
      const newAdmin = new Admin({
        name: name,
        email: email,
        password: hashedPassword
      });
  
      // Save the new admin document to the database
      await newAdmin.save();
      console.log('student registered successfully');
  
      // Redirect to a success page or login page
      res.redirect('/login');
    } catch (error) {
      console.error('Error registering admin:', error);
      res.render('register', { errorMessage: 'Server error' });
    }

    
  });



  
  //...............................................................
// register kaj ses   

  // Handle login form submission
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
      // Check if the admin exists in the database
      const admin = await Admin.findOne({ email: email });
      if (!admin) {
          return res.render('login', { errorMessage: 'student not found' });
      }

      // Validate password
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
          return res.render('login', { errorMessage: 'Invalid password' });
      }

      // Issue JWT token
      const payload = {
          admin: {
              id: admin.id
          }
      };

      const jwtSecret = process.env.JWT_SECRET || "4715aed3c946f7b0a38e6b534a9583628d84e96d10fbc04700770d572af3dce43625dd";
      jwt.sign(payload, jwtSecret, { expiresIn: '1h' }, (err, token) => {
          if (err) throw err;
          res.cookie('token', token, { httpOnly: true }); // Set cookie with JWT token
          res.redirect('/dashboard');
      });

  } catch (error) {
      console.error('Error logging in admin:', error);
      res.render('login', { errorMessage: 'Server error' });
  }
});
//.........................................................





//....................................................
router.get('/deletebook', (req, res) => {
  res.render('deletebook');  // deleteBookForm.ejs রেন্ডার করবে
});
// POST /deletebook
// POST /deletebook
router.post('/deletebook', async (req, res) => {
  const bookId = req.body.bookId;

  if (!bookId) {
    return res.status(400).send('Book ID is required');
  }

  try {
    const result = await Book.deleteOne({ book_Id:parseInt(bookId)});
    if (result.deletedCount === 0) {
      return res.status(404).send('Book not found');
    }
    res.redirect('/admindeshboard');
  } catch (err) {
    console.error('Error deleting book:', err);
    res.status(500).send('Internal Server Error');
  }
});
//.................................................................



//...............................................................
router.get('/books', async (req, res) => {
    try {
        const books = await Book.find({}).populate('CategoryId');
        res.render('booksList', { books });
    } catch (err) {
      console.error(err);

        res.status(500).send('Error retrieving books: ' + err.message);
    }
});

//......................................................









//......................................................

router.get('/addBook', async (req, res) => {
    try {
        const categories = await Category.find({}, { _id: 1, catName: 1 });
        res.render('addBook', { categories });
    } catch (err) {
        console.error('Error fetching categories:', err.message, err.stack);
        res.status(500).send('Error fetching categories');
    }
});

// POST /addBook - Handle form submission to add a new book
// Configure storage
// POST রুট: ফর্ম সাবমিট করার জন্য
router.post('/addBook', upload.single('coverImage'), async (req, res) => {
  try {
    const { title, author, catId, cellNumber } = req.body;
    const isAvailable = req.body.isAvailable === 'on' ? true : false;
    // সর্বশেষ book_Id বের করো
         const lastBook = await Book.findOne().sort({ book_Id: -1 }).exec();
         const nextBookId = lastBook ? lastBook.book_Id + 1 : 1001; // প্রথম বই হলে 1001


    let coverImagePath = '';
    if (req.file) {
      coverImagePath = '/uploads/' + req.file.filename;
    }

    const newBook = new Book({
       book_Id: nextBookId,
      Title: title,
      Author: author,
      CategoryId: catId,
      coverImage: coverImagePath,
      cellNumber: cellNumber,
      isAvailable: isAvailable
    });

    await newBook.save();
    res.redirect('/admindeshboard'); // বা যেই পেজে পাঠাতে চাও
  } catch (err) {
    console.error(err);
    res.status(500).send('বই যোগ করতে সমস্যা হয়েছে');
  }
});

//....................................................................................................





//................................................................................

router.get('/searchBooks', async (req, res) => {
    try {
        const categories = await Category.find();  // categories নামক ডাটা নিয়ে আসা
        res.render('searchBooks', { categories });  // categories ভিউতে পাস করা
    } catch (err) {
        console.error(err);
        res.status(500).send('Problem');
    }
});

//.......................................................







//.................................................
// POST /searchBooks - সার্চ রেজাল্ট দেখানোর জন্য
router.post('/searchResults', async (req, res) => {
    const { title, author, category } = req.body;

    try {
        const query = {};
        if (title) query.Title = new RegExp(title, 'i');
        if (author) query.Author = new RegExp(author, 'i');
        const mongoose = require('mongoose');
          if (category && category !== 'all') query.CategoryId = new mongoose.Types.ObjectId(category);

        const books = await Book.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'CategoryId',
                    foreignField: '_id',
                    as: 'categoryInfo'
                }
            },
            {
                $addFields: {
                    catName: { $arrayElemAt: ['$categoryInfo.catName', 0] }
                }
            }
        ]);

        res.render('searchResults', { books });
    } catch (err) {
        console.error(err);
        res.status(500).send('সার্চ করতে সমস্যা হয়েছে');
    }
});

//...............................





//..............................................................
  // Handle ADmin deshord login form submission
router.post('/adminlogin', async (req, res) => {
  const { email, password } = req.body;
    try {
    // পূর্বনির্ধারিত ইমেইল এবং পাসওয়ার্ড যাচাই
    const predefinedEmail = 'admin@example.com';
    const predefinedPassword = 'admin123';

    if (email !== predefinedEmail) {
      return res.render('adminlogin', { errorMessage: 'Email not vailed' });
    }

    if (password !== predefinedPassword) {
      return res.render('adminlogin', { errorMessage: 'Passwoerd not vailed' });
    }

      // Issue JWT token
      const payload = {
          admin: {
              id: 1
          }
      };

      const jwtSecret = process.env.JWT_SECRET || "4715aed3c946f7b0a38e6b534a9583628d84e96d10fbc04700770d572af3dce43625dd";
      const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
          
          res.cookie('token', token, { httpOnly: true }); // Set cookie with JWT token
          res.redirect('/admindeshboard');


  } catch (error) {
      console.error('Error logging in admin:', error);
      res.render('admindeshboard', { errorMessage: 'Server error' });
  }
});
//....................................................................






//..........................................................
// desboard bitore ja ja thoake 

router.get('/profile', authenticateToken, async (req, res) => {
  try {
      const admin = await Admin.findById(req.admin.id).select('-password');
      if (!admin) {
          return res.status(404).send('student not found');
      }
      res.render('profile', { admin });
  } catch (error) {
      console.error('Error fetching admin:', error);
      res.status(500).send('Server error');
  }
});

// POST route to handle profile updates
router.post('/profile', authenticateToken, upload.single('picture'), async (req, res) => {
  try {
      const { name, bio } = req.body;
      const picture = req.file ? '/images/' + req.file.filename : null; // Construct path to store in database

      // Find the admin by ID and update the fields
      const updatedFields = { name, bio };
      if (picture) {
          updatedFields.picture = picture;
      }

      const admin = await Admin.findByIdAndUpdate(req.admin.id, updatedFields, { new: true });

      if (!admin) {
          return res.status(404).send('student not found');
      }

      res.render('profile', { admin, successMessage: 'Profile updated successfully' });
  } catch (error) {
      console.error('Error updating admin profile:', error);
      res.status(500).send('Server error');
  }
});
//...........................................................





//.............................................................


router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
      const admin = await Admin.findById(req.admin.id).select('-password');
      if (!admin) {
          return res.status(404).send('student not found');
      }
      res.render('dashboard', { admin });
  } catch (error) {
      console.error('Error fetching admin:', error);
      res.status(500).send('Server error');
  }
});
//..............................................................




//............................................................
router.get('/logout', (req, res) => {
  res.clearCookie('token'); // Clear the token cookie
  res.redirect('/'); // Redirect to login page after logout
});

  module.exports = router;
  