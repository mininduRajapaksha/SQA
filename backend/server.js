const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = 'uploads/';
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// File filter for images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

// Export multer config for routes to use
exports.upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

//mongodb connection
const URL = process.env.MONGODB_URL;
mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connection established successfully');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

const userRouter = require('./routes/user');
const itemsRouter = require('./routes/items');
const cartRouter = require('./routes/cart');
const ratingsRouter = require('./routes/rating');

app.use("/user", userRouter)
app.use("/items", itemsRouter)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/cart', cartRouter);
app.use('/ratings', ratingsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

