const express = require('express');
const router = express.Router();
const areaController = require('../controllers/areaController');
const { verifyToken, checkRole } = require('../middleware/auth');

// All authenticated users can view areas
router.get('/', verifyToken, areaController.getAllAreas);

// Admin only
router.post('/', verifyToken, checkRole('admin'), areaController.createArea);
router.put('/:id', verifyToken, checkRole('admin'), areaController.updateArea);
router.delete('/:id', verifyToken, checkRole('admin'), areaController.deleteArea);

module.exports = router;
