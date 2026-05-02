const express = require("express");
const router = express.Router();
const aiController = require("../controllers/ai.controller");
const auth = require("../middlewares/auth.middleware");

router.post("/ask", auth.protect, aiController.askAI);

module.exports = router;
