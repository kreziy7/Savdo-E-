const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');
const { validate } = require('../middlewares/validate.middleware');
const {
  createProductSchema,
  updateProductSchema,
  reviewSchema,
} = require('../validators/product.validator');

// Public routes
router.get('/', productController.getProducts);
router.get('/categories', productController.getCategories);
router.get('/slug/:slug', productController.getProductBySlug);
router.get('/:id', productController.getProductById);

// Protected routes
router.post('/:id/reviews', protect, validate(reviewSchema), productController.addReview);

// Admin only routes
router.post(
  '/',
  protect,
  authorize('ADMIN', 'SUPER_ADMIN'),
  validate(createProductSchema),
  productController.createProduct
);
router.patch(
  '/:id',
  protect,
  authorize('ADMIN', 'SUPER_ADMIN'),
  validate(updateProductSchema),
  productController.updateProduct
);
router.delete(
  '/:id',
  protect,
  authorize('ADMIN', 'SUPER_ADMIN'),
  productController.deleteProduct
);

module.exports = router;
