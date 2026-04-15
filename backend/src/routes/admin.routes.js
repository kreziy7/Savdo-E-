const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { updateOrderStatusSchema } = require('../validators/order.validator');
const { registerAdminSchema, registerSuperAdminSchema } = require('../validators/auth.validator');
const { authLimiter } = require('../middlewares/rateLimiter.middleware');

// ── Public registration endpoints (before auth middleware) ─────────────────
// POST /api/v1/admin/register-super-admin  — requires ADMIN_SETUP_KEY from .env
router.post(
  '/register-super-admin',
  authLimiter,
  validate(registerSuperAdminSchema),
  adminController.registerSuperAdmin
);

// All routes below require authentication + admin role
router.use(protect, authorize('ADMIN', 'SUPER_ADMIN'));

// POST /api/v1/admin/register-admin  — SUPER_ADMIN only
router.post(
  '/register-admin',
  authorize('SUPER_ADMIN'),
  validate(registerAdminSchema),
  adminController.registerAdmin
);

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
