const express = require("express");
const pizzaController = require("../controllers/pizzaController");
const router = express.Router();

router.post("/getAll", pizzaController.getPizzas);

module.exports = router;
