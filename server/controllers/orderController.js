const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Address = require("../models/addressModel");

module.exports = {
  addOrder: async (req, res) => {
    try {
      const {
        user,
        firstName,
        lastName,
        streetAddress,
        city,
        state,
        zipCode,
        country,
        email,
        phoneNumber,
        cardName,
        cardNumber,
        ccv,
        expiry,
      } = req.body;
      let existingUser = await User.findById(user);
      if (!existingUser) {
        return res.status(400).json({ error: "User does not exist!" });
      }
      let cart = await Cart.findOne({ user: user, status: "not purchased" });
      if (!cart) {
        return res.status(400).json({ error: "Cart does not exist!" });
      }
      const addresses = await Address.find({
        user: user,
      });
      if (addresses && addresses?.length > 0) {
        const existingAddress = addresses.find((address) => {
          return (
            address.firstName === firstName &&
            address.lastName === lastName &&
            address.streetAddress === streetAddress &&
            address.city === city &&
            address.state === state &&
            address.zipCode === zipCode &&
            address.country === country &&
            address.email === email &&
            address.phoneNumber === phoneNumber
          );
        });
        if (existingAddress) {
          existingUser.primaryAddress = existingAddress._id;
          await existingUser.save();
          const order = await Order.create({
            user,
            cart,
            address: existingAddress._id,
          });
          if (!order) {
            return res
              .status(400)
              .json({ error: "Order could not be created!" });
          }
          cart.status = "purchased";
          await cart.save();
          return res.status(201).json({
            order,
            message: "Order created successfully!",
          });
        } else {
          addresses.forEach((address) => {
            address.isPrimary = false;
            address.save();
          });
          const address = await Address.create({
            user: existingUser._id,
            firstName,
            lastName,
            streetAddress,
            city,
            state,
            zipCode,
            country,
            email,
            phoneNumber,
            isPrimary: true,
          });
          existingUser.primaryAddress = address._id;
          await existingUser.save();
          const order = await Order.create({
            user,
            cart,
            address,
          });
          if (!order) {
            return res
              .status(400)
              .json({ error: "Order could not be created!" });
          }
          cart.status = "purchased";
          await cart.save();
          res.status(201).json({
            order,
            message: "Order created successfully!",
          });
        }
      } else {
        const address = await Address.create({
          user: existingUser._id,
          firstName,
          lastName,
          streetAddress,
          city,
          state,
          zipCode,
          country,
          email,
          phoneNumber,
          isPrimary: true,
        });
        existingUser.primaryAddress = address._id;
        await existingUser.save();
        const order = await Order.create({
          user,
          cart,
          address,
        });
        if (!order) {
          return res.status(400).json({ error: "Order could not be created!" });
        }
        cart.status = "purchased";
        await cart.save();
        res.status(201).json({
          order,
          message: "Order created successfully!",
        });
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: error.message });
    }
  },
};
