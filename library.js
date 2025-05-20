require('dotenv').config(); // .env ফাইল লোড করার জন্য
const express = require('express');
const path = require('path');
const chalk = require('chalk');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const multer = require('multer');

// Database connection
const connectToDatabase = require('./data/database');
connectToDatabase();

// Middleware imports
const authMiddleware = require('./Middleware/auth');
const upload = require('./Middleware/upload');

// Route imports
const routes = require('./routes/routes');

const fs = require('fs');
const uploadDir = path.join(__dirname, 'public', 'uploads');

// ডিরেক্টরি না থাকলে তৈরি করুন
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('আপলোড ডিরেক্টরি তৈরি হয়েছে:', uploadDir);
} 
const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', routes);
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
// API Routes
app.post('/api/books', authMiddleware, upload.single('coverImage'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
        }

        const imagePath = '/images/' + req.file.filename;
        
        // Save to database
        const newBook = {
            title: req.body.title,
            author: req.body.author,
            coverImage: imagePath,
            adminId: req.admin.id // Using the authenticated admin's ID
        };

        // ... save to database logic ...

        res.status(201).json({
            success: true,
            message: 'Book added successfully',
            data: newBook
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to add book'
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size exceeds 5MB limit'
            });
        }
        return res.status(400).json({
            success: false,
            message: 'File upload error: ' + err.message
        });
    } else if (err) {
        console.error('Error:', err);
        return res.status(500).json({
            success: false,
            message: err.message || 'Internal server error'
        });
    }
    next();
});

// 404 Handler
app.use((req, res) => {
    res.status(404).render('404');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Open in your browser: http://localhost:${PORT}`);
 
});