const express = require('express');
const router = express.Router();
const { analyzeStock, getMarketSnapshot, getSuggestions } = require('../controllers/newsController');

router.get('/health',      (req, res) => res.status(200).json({ status: 'OK', message: 'API is running' }));
router.post('/analyze',    analyzeStock);
router.get('/markets',     getMarketSnapshot);
router.get('/suggestions', getSuggestions);   // GET /api/suggestions?q=tesla

module.exports = router;
