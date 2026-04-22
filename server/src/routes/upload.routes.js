const express = require('express');
const multer = require('multer');
const { storage, cloudinary } = require('../config/cloudinary');
const { protect, adminOnly } = require('../middleware/auth.middleware');

const router = express.Router();

const upload = multer({ storage });

router.post('/', protect, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: 'No file uploaded' });
    }
    // Cloudinary returns the full URL in req.file.path or req.file.secure_url
    const imageUrl = req.file.path || req.file.secure_url;
    res.send(imageUrl);
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    res.status(500).send({ 
      message: 'Image upload failed', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
});

module.exports = router;
