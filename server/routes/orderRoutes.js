const express = require("express");
const orderController = require("../controllers/orderController");
const router = express.Router();

router.post("/add", orderController.addOrder);

module.exports = router;
