const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Petugas routes
router.post('/entry', verifyToken, checkRole('petugas'), ticketController.createTicket);
router.get('/search', verifyToken, checkRole('petugas'), ticketController.searchTicket);
router.post('/exit', verifyToken, checkRole('petugas'), ticketController.processExit);
router.get('/active', verifyToken, ticketController.getActiveTickets);

module.exports = router;
