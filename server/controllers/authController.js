const passport = require("passport");
const bcrypt = require("bcrypt");
const fs = require("fs-extra");
const { cloudinary } = require("../utils/cloudinary");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Address = require("../models/addressModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/generateTokens");

module.exports = {
  localRegister: async (req, res) => {
    passport.authenticate("local-register", (err, user, info) => {
      if (err) {
        return res.status(500).json({ message: err });
      }
      if (!user) {
        if (info.missingCredentials) {
          return res.status(404).json({ message: info.message });
        }
        if (info.emailAlreadyExists) {
          return res.status(303).json({ message: info.message });
        }
        if (info.usernameAlreadyExists) {
          return res.status(303).json({ message: info.message });
        }
        if (info.alreadyRegistered) {
          return res.status(303).json({ message: info.message });
        }
      }
      if (user) {
        return res
          .status(200)
          .json({ user, message: "User created successfully!" });
      }
    })(req, res);
  },
  localLogin: async (req, res) => {
    passport.authenticate("local-login", (err, user, info) => {
      if (err) {
        return res.status(500).json({ message: err });
      }
      if (!user) {
        if (info.missingCredentials) {
          return res.status(404).json({ message: info.message });
        }
        if (info.alreadyLoggedIn) {
          return res.status(400).json({ message: info.message });
        }
        if (info.accountNotExists) {
          return res.status(404).json({ message: info.message });
        }
        if (info.passwordInvalid) {
          return res.status(401).json({ message: info.message });
        }
      }
      if (user) {
        const accessToken = generateAccessToken(user, "local");
        const refreshToken = generateRefreshToken(user, "1d", "local");
        res.cookie("cartId", "PizzaDelivery", {
          maxAge: -1,
        });
        res.cookie("refreshToken", refreshToken, {
          maxAge: 1000 * 60 * 60 * 24,
          httpOnly: true,
          sameSite: "Strict",
        });
        return res.status(200).json({
          token: accessToken,
          user,
          message: "User Logged-In successfully!",
        });
      }
    })(req, res);
  },
  refreshToken: async (req, res) => {
    try {
      let { refreshToken } = req.cookies;
      if (!refreshToken) {
        return res.status(403).json({
          message: "Unauthorized, You must login!",
        });
      }
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET_KEY
      );
      if (payload?.loginProvider === "local") {
        const user = await User.findOne(
          {
            email: payload.email,
          },
          { __v: 0, password: 0 }
        ).populate("primaryAddress");
        if (!user) {
          return res.status(403).json({
            message: "User doesn't exists, Unauthorized, You must login!",
          });
        }
        const expiration = payload.exp - Math.floor(Date.now() / 1000);
        const newAccessToken = generateAccessToken(
          user,
          payload?.loginProvider
        );
        const newRefreshToken = generateRefreshToken(
          user,
          expiration,
          payload?.loginProvider
        );

        res.cookie("refreshToken", newRefreshToken, {
          maxAge: expiration * 1000,
          httpOnly: true,
          sameSite: "Strict",
        });

        return res.json({
          user: user,
          token: newAccessToken,
        });
      }
      if (payload?.loginProvider === "google") {
        const user = await User.findOne(
          {
            "google.email": payload.email,
          },
          { __v: 0, password: 0 }
        ).populate("primaryAddress");
        if (!user) {
          return res.status(403).json({
            message: "User doesn't exists, Unauthorized, You must login!",
          });
        }
        const expiration = payload.exp - Math.floor(Date.now() / 1000);
        const newAccessToken = generateAccessToken(
          user,
          payload?.loginProvider
        );
        const newRefreshToken = generateRefreshToken(
          user,
          expiration,
          payload?.loginProvider
        );

        res.cookie("refreshToken", newRefreshToken, {
          maxAge: expiration * 1000,
          httpOnly: true,
          sameSite: "Strict",
        });

        return res.json({
          user: user,
          token: newAccessToken,
        });
      }
      if (payload?.loginProvider === "facebook") {
        const user = await User.findOne(
          {
            "facebook.email": payload.email,
          },
          { __v: 0, password: 0 }
        ).populate("primaryAddress");
        if (!user) {
          return res.status(403).json({
            message: "User doesn't exists, Unauthorized, You must login!",
          });
        }
        const expiration = payload.exp - Math.floor(Date.now() / 1000);
        const newAccessToken = generateAccessToken(
          user,
          payload?.loginProvider
        );
        const newRefreshToken = generateRefreshToken(
          user,
          expiration,
          payload?.loginProvider
        );

        res.cookie("refreshToken", newRefreshToken, {
          maxAge: expiration * 1000,
          httpOnly: true,
          sameSite: "Strict",
        });

        return res.json({
          user: user,
          token: newAccessToken,
        });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const {
        id,
        firstName,
        lastName,
        email,
        username,
        currentPassword,
        newPassword,
        confirmPassword,
      } = req.body;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }
      if (firstName?.length > 0 && firstName !== user?.firstName) {
        user.firstName = firstName;
      }
      if (lastName?.length > 0 && lastName !== user?.lastName) {
        user.lastName = lastName;
      }
      user.lastName = lastName;
      if (email?.length > 0 && email !== user?.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({
            message:
              "The email that you entered is already in use. Please try another email.",
          });
        }
        user.email = email;
      }
      if (username?.length > 0 && username !== user?.username) {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return res.status(400).json({
            message:
              "The username that you entered is already in use. Please try another username.",
          });
        }
        user.username = username;
      }
      if (newPassword?.length > 0 && confirmPassword?.length > 0) {
        if (newPassword !== confirmPassword) {
          return res.status(400).json({ message: "Passwords don't match!" });
        }
        if (user?.email || email) {
          if (user?.password && user?.password?.length > 0) {
            if (currentPassword?.length === 0) {
              return res
                .status(400)
                .json({ message: "Please enter your current password!" });
            }
            const isMatch = await bcrypt.compare(
              currentPassword,
              user?.password
            );
            if (!isMatch) {
              return res
                .status(400)
                .json({ message: "Invalid Current Password!" });
            }
          }
          user.password = await bcrypt.hash(newPassword, 10);
        } else {
          return res.status(400).json({
            message:
              "Please set a email to your account to be able to update your password!",
          });
        }
      }
      if (user?.email && !user?.password) {
        return res.status(400).json({
          message:
            "Please set a password to your account to be able to update your profile!",
        });
      }
      if (user?.email && user?.password) {
        if (!user.providers.includes("local")) {
          user.providers.push("local");
        }
      }
      if (req?.files && Object.keys(req?.files).length > 0) {
        if (req?.files?.userAvatar) {
          if (req?.files?.userAvatar?.size > 4 * 1024 * 1024) {
            await fs.unlink(req?.files?.userAvatar?.tempFilePath);
            return res?.status(400).json({
              message:
                "Avatar image size is too big, Avatar images can't be larger than 4MB in file size",
            });
          }
          if (
            req?.files?.userAvatar?.mimetype !== "image/jpeg" &&
            req?.files?.userAvatar?.mimetype !== "image/png"
          ) {
            await fs.unlink(req?.files?.userAvatar?.tempFilePath);
            return res.status(400).json({
              message:
                "Invalid avatar image format, only JPEG, JPG, PNG are accepted",
            });
          }
          const d = new Date();
          let fileName =
            user._id +
            "_" +
            "avatar" +
            "_" +
            d.toISOString().split("T")[0].replace(/-/g, "") +
            "_" +
            d.toTimeString().split(" ")[0].replace(/:/g, "");
          if (user?.userAvatar?.public_id) {
            await cloudinary.uploader.destroy(user?.userAvatar?.public_id);
            user.avatar = null;
          }
          const result = await cloudinary.uploader.upload(
            req?.files?.userAvatar?.tempFilePath,
            {
              resource_type: "auto",
              public_id: fileName,
              folder: "PizzaDelivery/avatars",
              width: 400,
              height: 400,
              crop: "fill",
            }
          );
          if (result) {
            await fs.unlink(req?.files?.userAvatar?.tempFilePath);
            user.avatar = {};
            user.avatar.public_id = result?.public_id;
            user.avatar.url = result?.secure_url;
          } else {
            await fs.unlink(req?.files?.userAvatar?.tempFilePath);
            return res.status(400).json({
              message: "Error uploading avatar image, please try again!",
            });
          }
        }
      }
      await user.save();
      return res
        .status(200)
        .json({ user, message: "User updated successfully!" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getUserOrders: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "User ID is required!" });
      const orders = await Order.find({ user: id })
        .populate({
          path: "cart",
          populate: {
            path: "cartItems.pizza",
          },
        })
        .populate({
          path: "address",
        });
      if (!orders) {
        return res.status(404).json({ message: "User has no orders!" });
      }
      return res.status(200).json({
        orders,
        message: "User orders fetched successfully!",
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getUserAddresses: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ message: "User ID is required!" });
      const addresses = await Address.find({ user: id });
      if (!addresses) {
        return res.status(404).json({ message: "User has no addresses!" });
      }
      return res.status(200).json({
        addresses,
        message: "User addresses fetched successfully!",
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.cookie("refreshToken", "PizzaDelivery", {
        maxAge: -1,
        httpOnly: true,
        sameSite: "Strict",
      });
      return res.json({ message: "Logged out successfully!" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
