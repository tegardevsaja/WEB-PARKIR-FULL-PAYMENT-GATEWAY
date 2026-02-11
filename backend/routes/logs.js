const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Admin only
router.get('/', verifyToken, checkRole('admin'), logController.getAllLogs);
router.get('/:id', verifyToken, checkRole('admin'), logController.getLogById);

module.exports = router;
