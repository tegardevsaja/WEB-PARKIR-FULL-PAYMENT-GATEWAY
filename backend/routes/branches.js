const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');
const { verifyToken, checkRole } = require('../middleware/auth');

// All authenticated users can view branches
router.get('/', verifyToken, branchController.getAllBranches);
router.get('/:id', verifyToken, branchController.getBranchById);

// Admin only
router.post('/', verifyToken, checkRole('admin'), branchController.createBranch);
router.put('/:id', verifyToken, checkRole('admin'), branchController.updateBranch);
router.delete('/:id', verifyToken, checkRole('admin'), branchController.deleteBranch);

module.exports = router;
