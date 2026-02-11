const express = require('express');
const router = express.Router();
const rateController = require('../controllers/rateController');
const { verifyToken, checkRole } = require('../middleware/auth');

// All authenticated users can view rates
router.get('/', verifyToken, rateController.getAllRates);
router.get('/active', verifyToken, rateController.getActiveRate);
router.get('/vehicle-types', verifyToken, rateController.getVehicleTypes);

// Admin only
router.post('/', verifyToken, checkRole('admin'), rateController.createRate);
router.put('/:id', verifyToken, checkRole('admin'), rateController.updateRate);
router.delete('/:id', verifyToken, checkRole('admin'), rateController.deleteRate);

module.exports = router;
