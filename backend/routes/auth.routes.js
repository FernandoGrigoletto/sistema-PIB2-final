const { Router } = require("express");
const { getMe, Login } = require("../controllers/auth.controller.js");
const { authenticate } = require("../middlewares/auth.js");
const router = Router();

router.post('/', Login);
router.get('/me', authenticate, getMe);

module.exports = router;