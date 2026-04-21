const express = require('express');
const multer = require('multer');
const { storage, cloudinary } = require('../config/cloudinary');
const { protect, adminOnly } = require('../middleware/auth.middleware');

const router = express.Router();

const upload = multer({ storage });

router.post('/', protect, adminOnly, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded' });
  }
  // Cloudinary returns the full URL in req.file.path (or req.file.secure_url depending on multer-storage-cloudinary version)
  res.send(req.file.path || req.file.secure_url);
});

module.exports = router;
