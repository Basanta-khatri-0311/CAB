const express = require('express');
const { 
  getHomeData, 
  getPublicMembers,
  getPublicPosts
} = require('../controllers/public.controller.js');

const router = express.Router();

router.get("/home", getHomeData);
router.get("/members", getPublicMembers);
router.get("/posts", getPublicPosts);

module.exports = router;
