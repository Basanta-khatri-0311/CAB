const express =  require('express');
const getPublicStats  =require('../controllers/public.controller.js');

const router = express.Router();

router.get("/stats", getPublicStats);

module.exports = router
