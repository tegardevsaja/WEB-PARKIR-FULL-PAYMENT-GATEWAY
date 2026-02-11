const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken, checkRole } = require('../middleware/auth');

// QRIS Payment routes
router.post('/qris/generate', verifyToken, checkRole('petugas'), paymentController.generateQRIS);
router.get('/qris/status', verifyToken, checkRole('petugas'), paymentController.checkQRISStatus);
router.post('/qris/mock-callback', verifyToken, checkRole('petugas'), paymentController.mockQRISCallback);

// All authenticated users can view payments
router.get('/', verifyToken, paymentController.getAllPayments);
router.get('/stats', verifyToken, paymentController.getPaymentStats);
router.get('/daily-revenue', verifyToken, paymentController.getDailyRevenue);
router.get('/:id', verifyToken, paymentController.getPaymentById);

// Petugas can update payment status (for QRIS confirmation)
router.put('/:id/status', verifyToken, checkRole('petugas', 'admin'), paymentController.updatePaymentStatus);

module.exports = router;
