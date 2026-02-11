const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken, checkRole } = require('../middleware/auth');

// All authenticated users can view dashboard stats
router.get('/stats', verifyToken, dashboardController.getDashboardStats);

// Admin only - branch comparison
router.get('/branch-comparison', verifyToken, checkRole('admin'), dashboardController.getBranchComparison);

module.exports = router;
