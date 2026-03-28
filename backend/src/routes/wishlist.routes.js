const express = require('express');
const router = express.Router();

const wishlistController = require('../controllers/wishlist.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.get('/', wishlistController.getWishlist);
router.post('/toggle/:productId', wishlistController.toggleWishlist);
router.delete('/:productId', wishlistController.removeFromWishlist);

module.exports = router;
