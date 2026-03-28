const express = require('express');
const router = express.Router();

const reportController = require('../controllers/report.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.get('/summary', reportController.getSummary);
router.get('/daily', reportController.getDailyReport);
router.get('/monthly', reportController.getMonthlyReport);

module.exports = router;
