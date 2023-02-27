const express = require("express");
const cartController = require("../controllers/cartController");
const checkAuth = require("../middlewares/checkAuth");
const router = express.Router();

router.post("/addToCart", checkAuth, cartController.addToCart);
router.get("/getCartItems", checkAuth, cartController.getCartItems);
router.get("/getCartItemsNumber", checkAuth, cartController.getCartItemsNumber);
router.patch("/updateCart", cartController.updateCart);
router.post("/removeFromCart", cartController.removeFromCart);
router.post("/applyCoupon", checkAuth, cartController.applyCoupon);

module.exports = router;
