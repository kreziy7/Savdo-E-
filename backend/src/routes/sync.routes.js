const express = require('express');
const router = express.Router();

const syncController = require('../controllers/sync.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.post('/push', syncController.push);   // Mobile → Server
router.get('/pull', syncController.pull);    // Server → Mobile

module.exports = router;
