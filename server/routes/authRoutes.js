const express = require("express");
const router = express.Router();
const passport = require("passport");
const { generateRefreshToken } = require("../middlewares/generateTokens");
const checkAuth = require("../middlewares/checkAuth");
const authController = require("../controllers/authController");
const e = require("express");

router.get("/auth/google", checkAuth, (req, res) => {
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  })(req, res);
});
router.get(
  "/auth/google/callback",
  (req, res, next) => {
    passport.authenticate(
      "google",
      {
        session: false,
      },
      (err, user, info) => {
        if (err) {
          res.cookie("info", err.toString(), {
            maxAge: 1000 * 5,
          });
          return res.redirect("http://localhost:3000/auth/login");
        }
        if (info.message) {
          res.cookie("info", info.message.toString(), {
            maxAge: 1000 * 5,
          });
          return res.redirect("http://localhost:3000/auth/login");
        }
        if (user) {
          req.user = user;
          next();
        }
      }
    )(req, res, next);
  },
  (req, res) => {
    const refreshToken = generateRefreshToken(req.user, "1d", "google");
    res.cookie("isLoggedIn", "true", {
      maxAge: 1000 * 60 * 60 * 24,
    });
    res.cookie("cartId", "PizzaDelivery", {
      maxAge: -1,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: "Strict",
    });
    res.redirect(`http://localhost:3000`);
  }
);

router.get("/auth/facebook", checkAuth, (req, res) => {
  passport.authenticate("facebook", {
    session: false,
    scope: ["email"],
  })(req, res);
});
router.get(
  "/auth/facebook/callback",
  (req, res, next) => {
    passport.authenticate(
      "facebook",
      {
        session: false,
      },
      (err, user, info) => {
        if (err) {
          res.cookie("info", err.toString(), {
            maxAge: 1000 * 5,
          });
          return res.redirect("http://localhost:3000/auth/login");
        }
        if (info.message) {
          res.cookie("info", info.message.toString(), {
            maxAge: 1000 * 5,
          });
          return res.redirect("http://localhost:3000/auth/login");
        }
        if (user) {
          req.user = user;
          next();
        }
      }
    )(req, res, next);
  },
  (req, res) => {
    const refreshToken = generateRefreshToken(req.user, "1d", "facebook");
    res.cookie("isLoggedIn", "true", {
      maxAge: 1000 * 60 * 60 * 24,
    });
    res.cookie("cartId", "PizzaDelivery", {
      maxAge: -1,
    });
    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
      sameSite: "Strict",
    });
    res.redirect(`http://localhost:3000`);
  }
);

router.post("/auth/register", authController.localRegister);

router.post("/auth/login", authController.localLogin);

router.post("/auth/refreshToken", authController.refreshToken);

router.post("/user/:id/update", authController.updateUser);

router.get("/user/:id/orders", authController.getUserOrders);

router.get("/user/:id/addresses", authController.getUserAddresses);

router.post("/auth/logout", authController.logout);

module.exports = router;
