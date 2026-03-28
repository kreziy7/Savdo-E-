const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { updateOrderStatusSchema } = require('../validators/order.validator');

// All admin routes require authentication + admin role
router.use(protect, authorize('ADMIN', 'SUPER_ADMIN'));

// Dashboard
router.get('/stats', adminController.getDashboardStats);

// User management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.patch('/users/:id/block', adminController.blockUser);
router.patch('/users/:id/unblock', adminController.unblockUser);
router.delete(
  '/users/:id',
  authorize('SUPER_ADMIN'),
  adminController.deleteUser
);

// Order management
router.get('/orders', adminController.getAllOrders);
router.patch(
  '/orders/:id/status',
  validate(updateOrderStatusSchema),
  adminController.updateOrderStatus
);

module.exports = router;
