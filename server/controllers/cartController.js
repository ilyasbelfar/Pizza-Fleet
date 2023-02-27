const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");

module.exports = {
  addToCart: async (req, res) => {
    try {
      const { pizzaId, quantity, price } = req.body;
      const { tempUser } = req;
      if (!tempUser) {
        let { cartId } = req.cookies;
        if (!cartId) {
          const newCart = await Cart.create({
            cartItems: [
              { pizza: pizzaId, quantity, subTotal: quantity * price },
            ],
            totalToPay: quantity * price,
            isGuestCart: true,
          });
          cartId = newCart._id;
          return res
            .cookie("cartId", cartId.toString(), {
              maxAge: 1000 * 60 * 60 * 24 * 7,
            })
            .json({
              message: "Pizza added to cart",
              cart: newCart,
              numberOfCartItems: newCart?.cartItems?.length,
            });
        }
        let cart = await Cart.findOne({ _id: cartId });
        if (!cart) {
          res.cookie("cartId", "PizzaDelivery", {
            maxAge: -1,
          });
          const newCart = await Cart.create({
            cartItems: [
              { pizza: pizzaId, quantity, subTotal: quantity * price },
            ],
            totalToPay: quantity * price,
            isGuestCart: true,
          });
          cartId = newCart._id;
          return res
            .cookie("cartId", cartId.toString(), {
              maxAge: 1000 * 60 * 60 * 24 * 7,
            })
            .json({
              message: "Pizza added to cart",
              cart: newCart,
              numberOfCartItems: newCart?.cartItems?.length,
            });
        }
        const isItemExist = cart.cartItems.find(
          (item) => item.pizza.toString() === pizzaId
        );
        if (isItemExist) {
          cart.cartItems = cart.cartItems.map((item) => {
            if (item.pizza.toString() === pizzaId) {
              item.quantity += quantity;
              item.subTotal += quantity * price;
            }
            return item;
          });
          cart.totalToPay += quantity * price;
          await cart.save();
          return res.json({
            message: "Pizza added to cart",
            cart,
            numberOfCartItems: cart?.cartItems?.length,
          });
        } else {
          cart.cartItems.push({
            pizza: pizzaId,
            quantity,
            subTotal: quantity * price,
          });
          cart.totalToPay += quantity * price;
          await cart.save();
          return res.json({
            message: "Pizza added to cart",
            cart,
            numberOfCartItems: cart?.cartItems?.length,
          });
        }
      } else {
        const cart = await Cart.findOne({
          user: tempUser?._id,
          status: "not purchased",
        });
        if (!cart) {
          const newCart = await Cart.create({
            user: tempUser._id,
            cartItems: [
              { pizza: pizzaId, quantity, subTotal: quantity * price },
            ],
            totalToPay: quantity * price,
            isGuestCart: false,
          });
          return res.json({
            message: "Pizza added to cart",
            cart: newCart,
            numberOfCartItems: newCart?.cartItems?.length,
          });
        }
        const isItemExist = cart.cartItems.find(
          (item) => item.pizza.toString() === pizzaId
        );
        if (isItemExist) {
          cart.cartItems = cart.cartItems.map((item) => {
            if (item.pizza.toString() === pizzaId) {
              item.quantity += quantity;
              item.subTotal += quantity * price;
            }
            return item;
          });
          cart.totalToPay += quantity * price;
          await cart.save();
          req.tempUser = null;
          return res.json({
            message: "Pizza added to cart",
            cart,
            numberOfCartItems: cart?.cartItems?.length,
          });
        } else {
          cart.cartItems.push({
            pizza: pizzaId,
            quantity,
            subTotal: quantity * price,
          });
          cart.totalToPay += quantity * price;
          await cart.save();
          req.tempUser = null;
          return res.json({
            message: "Pizza added to cart",
            cart,
            numberOfCartItems: cart?.cartItems?.length,
          });
        }
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  getCartItems: async (req, res) => {
    try {
      const { tempUser } = req;
      if (tempUser) {
        const cart = await Cart.findOne({
          user: tempUser._id,
          status: "not purchased",
        })
          .populate({
            path: "cartItems.pizza",
          })
          .populate({
            path: "coupon",
          });
        if (!cart) {
          return res.status(404).json({ message: "Cart not found" });
        }
        return res.json(cart);
      }
      let { cartId } = req.cookies;
      if (!cartId) {
        return res.status(404).json({ message: "Cart not found" });
      }
      const cart = await Cart.findOne({ _id: cartId })
        .populate({
          path: "cartItems.pizza",
        })
        .populate({
          path: "coupon",
        });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      return res.json(cart);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  getCartItemsNumber: async (req, res) => {
    try {
      const { tempUser } = req;
      if (tempUser) {
        const cart = await Cart.findOne({
          user: tempUser?._id,
          status: "not purchased",
        });
        if (!cart) {
          return res.status(404).json({ message: "Cart not found" });
        }
        return res.json({
          numberOfCartItems: cart?.cartItems?.length,
        });
      }
      let { cartId } = req.cookies;
      if (!cartId) {
        return res.status(404).json({ message: "Cart not found" });
      }
      const cart = await Cart.findOne({ _id: cartId });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      return res.json({
        numberOfCartItems: cart?.cartItems?.length,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  updateCart: async (req, res) => {
    try {
      const { cartId, pizzaId, quantity } = req.body;
      let cart = await Cart.findOne({ _id: cartId })
        .populate({
          path: "cartItems.pizza",
        })
        .populate({
          path: "coupon",
        });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      cart.totalToPay = 0;
      if (cart.isCouponApplied) {
        const coupon = await Coupon.findOne({ _id: cart.coupon });
        const isItemExist = cart.cartItems.find(
          (item) => item.pizza._id.toString() === pizzaId
        );
        if (isItemExist) {
          cart.cartItems = cart.cartItems.map((item) => {
            if (item.pizza._id.toString() === pizzaId) {
              if (item.pizza._id.toString() === coupon.pizza.toString()) {
                item.quantity = quantity;
                item.subTotal =
                  quantity *
                  ((item.pizza.price * (100 - coupon.discountPercentage)) /
                    100);
              } else {
                item.quantity = quantity;
                item.subTotal = quantity * item.pizza.price;
              }
            }
            cart.totalToPay += item.subTotal;
            return item;
          });
          await cart.save();
          return res.json({
            message: "Cart updated",
            cart,
          });
        }
      } else {
        const isItemExist = cart.cartItems.find(
          (item) => item.pizza._id.toString() === pizzaId
        );

        if (isItemExist) {
          cart.cartItems = cart.cartItems.map((item) => {
            if (item.pizza._id.toString() === pizzaId) {
              item.quantity = quantity;
              item.subTotal = quantity * item.pizza.price;
            }
            cart.totalToPay += item.quantity * item.pizza.price;
            return item;
          });
          await cart.save();
          return res.json({
            message: "Cart updated",
            cart,
          });
        }
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  removeFromCart: async (req, res) => {
    try {
      const { cartId, pizzaId } = req.body;
      let cart = await Cart.findOne({ _id: cartId }).populate({
        path: "cartItems.pizza",
      });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      cart.cartItems = cart.cartItems.filter(
        (item) => item.pizza._id.toString() !== pizzaId
      );
      if (cart.cartItems.length === 0) {
        await Cart.findByIdAndDelete(cart._id);
        return res.json({
          message: "Item removed from cart",
          cart: {},
        });
      }
      await cart.save();
      return res.json({
        message: "Item removed from cart",
        cart,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  applyCoupon: async (req, res) => {
    try {
      const { couponCode } = req.body;
      const coupon = await Coupon.findOne({ code: couponCode });
      if (!coupon) {
        return res.status(404).json({ message: "Coupon code not found!" });
      }
      const { tempUser } = req;
      if (tempUser) {
        let cart = await Cart.findOne({
          user: tempUser._id,
          status: "not purchased",
        }).populate({
          path: "cartItems.pizza",
        });
        if (!cart) {
          return res.status(404).json({ message: "Cart not found!" });
        }
        if (cart.isCouponApplied) {
          return res
            .status(400)
            .json({ message: "You have already applied a coupon!" });
        }
        const isItemExist = cart.cartItems.find(
          (item) => item.pizza._id.toString() === coupon.pizza.toString()
        );
        if (isItemExist) {
          cart.cartItems = cart.cartItems.map((item) => {
            if (item.pizza._id.toString() === coupon.pizza.toString()) {
              cart.discountedPrice =
                (item.subTotal * coupon.discountPercentage) / 100;
              cart.totalToPay =
                cart.totalToPay -
                (item.subTotal * coupon.discountPercentage) / 100;
              item.subTotal =
                item.subTotal -
                (item.subTotal * coupon.discountPercentage) / 100;
            }
            return item;
          });
          cart.coupon = coupon._id;
          cart.isCouponApplied = true;
          await cart.save();
          return res.json({
            message: "Coupon applied successfully!",
            cart,
          });
        } else {
          return res.status(404).json({
            message:
              "This coupon is not applicable for any of the pizzas that are in your cart!",
          });
        }
      } else {
        let { cartId } = req.cookies;
        if (!cartId) {
          return res.status(404).json({ message: "Cart not found" });
        }
        const cart = await Cart.findOne({ _id: cartId }).populate({
          path: "cartItems.pizza",
        });
        if (!cart) {
          return res.status(404).json({ message: "Cart not found" });
        }
        if (cart.isCouponApplied) {
          return res
            .status(400)
            .json({ message: "You have already applied a coupon!" });
        }
        const isItemExist = cart.cartItems.find(
          (item) => item.pizza._id.toString() === coupon.pizza.toString()
        );
        if (isItemExist) {
          cart.cartItems = cart.cartItems.map((item) => {
            if (item.pizza._id.toString() === coupon.pizza.toString()) {
              cart.discountedPrice =
                (item.subTotal * coupon.discountPercentage) / 100;
              cart.totalToPay =
                cart.totalToPay -
                (item.subTotal * coupon.discountPercentage) / 100;
              item.subTotal =
                item.subTotal -
                (item.subTotal * coupon.discountPercentage) / 100;
            }
            return item;
          });
          cart.coupon = coupon._id;
          cart.isCouponApplied = true;
          await cart.save();
          return res.json({
            message: "Coupon applied successfully!",
            cart,
          });
        } else {
          return res.status(404).json({
            message:
              "This coupon is not applicable for any of the pizzas that are in your cart!",
          });
        }
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};
