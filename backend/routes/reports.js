const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken, checkRole } = require('../middleware/auth');

// All authenticated users can view reports (admin and owner)
router.get('/daily-revenue', verifyToken, reportController.getDailyRevenue);
router.get('/transactions', verifyToken, reportController.getTransactionDetails);
router.get('/stats', verifyToken, reportController.getRevenueStats);
router.get('/today-summary', verifyToken, reportController.getTodaySummary);

module.exports = router;
