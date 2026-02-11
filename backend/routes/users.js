const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, checkRole } = require('../middleware/auth');

// Admin routes
router.get('/', verifyToken, checkRole('admin'), userController.getAllUsers);
router.post('/', verifyToken, checkRole('admin', 'owner'), userController.createUser);
router.put('/:id', verifyToken, checkRole('admin', 'owner'), userController.updateUser);
router.delete('/:id', verifyToken, checkRole('admin', 'owner'), userController.deleteUser);

// Owner routes - get users in their branch
router.get('/branch', verifyToken, checkRole('owner'), userController.getUsersByBranch);

module.exports = router;
