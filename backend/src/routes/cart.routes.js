const express = require('express');
const router = express.Router();

const cartController = require('../controllers/cart.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.delete('/clear', cartController.clearCart);
router.patch('/item/:productId', cartController.updateCartItem);
router.delete('/item/:productId', cartController.removeFromCart);

module.exports = router;
