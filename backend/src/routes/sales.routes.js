const express = require('express');
const router = express.Router();

const saleController = require('../controllers/sale.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createSaleSchema, bulkSyncSchema } = require('../validators/sale.validator');

router.use(protect);

router.get('/', saleController.getSales);
router.post('/', validate(createSaleSchema), saleController.createSale);
router.post('/bulk-sync', validate(bulkSyncSchema), saleController.bulkSync);

module.exports = router;
