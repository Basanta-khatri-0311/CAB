const express = require('express');
const { 
  getPublicStats, 
  getPublicPosts, 
  getPublicMembers, 
  getPublicFinances 
} = require('../controllers/public.controller.js');

const router = express.Router();

router.get("/stats", getPublicStats);
router.get("/posts", getPublicPosts);
router.get("/members", getPublicMembers);
router.get("/finances", getPublicFinances);

module.exports = router;
