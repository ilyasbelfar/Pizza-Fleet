const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/userModel");
const Cart = require("../models/cartModel");

require("dotenv").config();

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  "local-register",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        let { firstName, lastName, username } = req.body;
        if (!username || !email || !password || !firstName || !lastName) {
          return done(null, false, {
            missingCredentials: true,
            message: "All fields are required!",
          });
        }
        username = username.trim().toLowerCase();
        email = email.trim().toLowerCase();
        let { tempUser } = req;
        if (!tempUser) {
          let existingUser = await User.findOne({ email });
          if (existingUser) {
            return done(null, false, {
              emailAlreadyExists: true,
              message:
                "An account already exists with this email, if you have already registered with this email, please sign in using it!",
            });
          }
          existingUser = null;
          existingUser = await User.findOne({ username });
          if (existingUser) {
            return done(null, false, {
              usernameAlreadyExists: true,
              message: "An account already exists with this username!",
            });
          }
          delete existingUser;
          const hashedPassword = await bcrypt.hash(password, 10);
          const user = new User();
          user.firstName = firstName;
          user.lastName = lastName;
          user.username = username;
          user.email = email;
          user.password = hashedPassword;
          user.providers.push("local");
          await user.save();
          req.tempUser = null;
          return done(null, user);
        } else if (!tempUser.providers.includes("local")) {
          let existingUser = await User.findOne({ email });
          if (existingUser) {
            return done(null, false, {
              emailAlreadyExists: true,
              message:
                "An account already exists with this email, if you have already registered with this email, please sign in using it!",
            });
          }
          existingUser = null;
          existingUser = await User.findOne({ username });
          if (existingUser) {
            return done(null, false, {
              usernameAlreadyExists: true,
              message: "An account already exists with this username!",
            });
          }
          delete existingUser;
          let user = await User.findById(tempUser._id);
          user.firstName = firstName;
          user.lastName = lastName;
          user.username = username;
          user.email = email;
          user.password = await bcrypt.hash(password, 10);
          user.providers.push("local");
          await user.save();
          req.tempUser = null;
          return done(null, user);
        } else {
          req.tempUser = null;
          return done(null, false, {
            alreadyRegistered: true,
            message: "You have already registered!",
          });
        }
      } catch (err) {
        return done(err.message, false);
      }
    }
  )
);

passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        email = email.trim().toLowerCase();
        if (!email || !password) {
          return done(null, false, {
            missingCredentials: true,
            message: "All fields are required!",
          });
        }
        let { tempUser } = req;
        if (!tempUser) {
          let existingUser = await User.findOne({ email });
          if (!existingUser) {
            return done(null, false, {
              accountNotExists: true,
              message: "No account exists with this email!",
            });
          }
          const isPasswordValid = bcrypt.compare(
            password,
            existingUser.password
          );
          if (!isPasswordValid) {
            return done(null, false, {
              passwordInvalid: true,
              message: "Incorrect password!",
            });
          }
          let { cartId } = req?.cookies;
          let userCart = await Cart.findOne({
            user: existingUser?._id,
            status: "not purchased",
          });
          if (cartId) {
            if (!userCart) {
              const cart = await Cart.findById(cartId);
              if (cart) {
                cart.user = existingUser?._id;
                cart.isGuestCart = false;
                await cart.save();
              }
            } else {
              const cart = await Cart.findById(cartId);
              if (cart) {
                let result = userCart;
                cart?.cartItems?.forEach((secondObj) => {
                  const matchingIndex = result?.cartItems?.findIndex(
                    (firstObj) =>
                      firstObj.pizza.toString() === secondObj.pizza.toString()
                  );
                  if (matchingIndex !== -1) {
                    result.cartItems[matchingIndex].quantity +=
                      secondObj.quantity;
                  } else {
                    result.cartItems = [...result?.cartItems, secondObj];
                  }
                });
                userCart = result;
                await userCart.save();
                await cart.delete();
              }
            }
          }
          req.tempUser = null;
          existingUser.loginType = "local";
          await existingUser.save();
          return done(null, existingUser);
        } else {
          req.tempUser = null;
          return done(null, false, {
            alreadyLoggedIn: true,
            message: "You are already logged in!",
          });
        }
      } catch (err) {
        return done(err.message, false);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let { tempUser } = req;
        if (tempUser) {
          const existingUser = await User.findOne({
            "google.id": profile.id,
          });
          if (existingUser) {
            if (existingUser._id.toString() === tempUser._id.toString()) {
              let { cartId } = req?.cookies;
              let userCart = await Cart.findOne({
                user: existingUser?._id,
                status: "not purchased",
              });
              if (cartId) {
                if (!userCart) {
                  const cart = await Cart.findById(cartId);
                  if (cart) {
                    cart.user = existingUser?._id;
                    cart.isGuestCart = false;
                    await cart.save();
                  }
                } else {
                  const cart = await Cart.findById(cartId);
                  if (cart) {
                    let result = userCart;
                    cart?.cartItems?.forEach((secondObj) => {
                      const matchingIndex = result?.cartItems?.findIndex(
                        (firstObj) =>
                          firstObj.pizza.toString() ===
                          secondObj.pizza.toString()
                      );
                      if (matchingIndex !== -1) {
                        result.cartItems[matchingIndex].quantity +=
                          secondObj.quantity;
                      } else {
                        result.cartItems = [...result?.cartItems, secondObj];
                      }
                    });
                    userCart = result;
                    await userCart.save();
                    await cart.delete();
                  }
                }
              }
              existingUser.loginType = "google";
              await existingUser.save();
              return done(null, existingUser);
            }
          } else {
            let user = await User.findById(tempUser?._id);
            user.google = {};
            user.google.id = profile.id;
            user.google.name = profile.displayName;
            user.google.email = profile.email;
            user.google.picture = profile.picture;
            user.loginType = "google";
            if (!user.providers.includes("google"))
              user.providers.push("google");
            await user.save();
            req.tempUser = null;
            let { cartId } = req?.cookies;
            let userCart = await Cart.findOne({
              user: existingUser?._id,
              status: "not purchased",
            });
            if (cartId) {
              if (!userCart) {
                const cart = await Cart.findById(cartId);
                if (cart) {
                  cart.user = existingUser?._id;
                  cart.isGuestCart = false;
                  await cart.save();
                }
              } else {
                const cart = await Cart.findById(cartId);
                if (cart) {
                  let result = userCart;
                  cart?.cartItems?.forEach((secondObj) => {
                    const matchingIndex = result?.cartItems?.findIndex(
                      (firstObj) =>
                        firstObj.pizza.toString() === secondObj.pizza.toString()
                    );
                    if (matchingIndex !== -1) {
                      result.cartItems[matchingIndex].quantity +=
                        secondObj.quantity;
                    } else {
                      result.cartItems = [...result?.cartItems, secondObj];
                    }
                  });
                  userCart = result;
                  await userCart.save();
                  await cart.delete();
                }
              }
            }
            await user.save();
            return done(null, user);
          }
        } else {
          const existingUser = await User.findOne({
            "google.id": profile.id,
          });
          if (existingUser) {
            let { cartId } = req?.cookies;
            let userCart = await Cart.findOne({
              user: existingUser?._id,
              status: "not purchased",
            });
            if (cartId) {
              if (!userCart) {
                const cart = await Cart.findById(cartId);
                if (cart) {
                  cart.user = existingUser?._id;
                  cart.isGuestCart = false;
                  await cart.save();
                }
              } else {
                const cart = await Cart.findById(cartId);
                if (cart) {
                  let result = userCart;
                  cart?.cartItems?.forEach((secondObj) => {
                    const matchingIndex = result?.cartItems?.findIndex(
                      (firstObj) =>
                        firstObj.pizza.toString() === secondObj.pizza.toString()
                    );
                    if (matchingIndex !== -1) {
                      result.cartItems[matchingIndex].quantity +=
                        secondObj.quantity;
                    } else {
                      result.cartItems = [...result?.cartItems, secondObj];
                    }
                  });
                  userCart = result;
                  await userCart.save();
                  await cart.delete();
                }
              }
            }
            existingUser.google.name = profile.displayName;
            existingUser.google.picture = profile.picture;
            existingUser.loginType = "google";
            await existingUser.save();
            return done(null, existingUser);
          }
          const existingEmailUser = await User.findOne({
            email: profile.email,
          });
          if (existingEmailUser) {
            return done(null, false, {
              message:
                "The email address of your Google account is already associated with an account.",
            });
          }
          let user = new User();
          user.google = {};
          user.google.id = profile.id;
          user.google.name = profile.displayName;
          user.google.email = profile.email;
          user.google.picture = profile.picture;
          user.loginType = "google";
          if (!user.providers.includes("google")) user.providers.push("google");
          await user.save();
          req.tempUser = null;
          let { cartId } = req?.cookies;
          let userCart = await Cart.findOne({
            user: existingUser?._id,
            status: "not purchased",
          });
          if (cartId) {
            if (!userCart) {
              const cart = await Cart.findById(cartId);
              if (cart) {
                cart.user = user?._id;
                cart.isGuestCart = false;
                await cart.save();
              }
            } else {
              const cart = await Cart.findById(cartId);
              if (cart) {
                let result = userCart;
                cart?.cartItems?.forEach((secondObj) => {
                  const matchingIndex = result?.cartItems?.findIndex(
                    (firstObj) =>
                      firstObj.pizza.toString() === secondObj.pizza.toString()
                  );
                  if (matchingIndex !== -1) {
                    result.cartItems[matchingIndex].quantity +=
                      secondObj.quantity;
                  } else {
                    result.cartItems = [...result?.cartItems, secondObj];
                  }
                });
                userCart = result;
                await userCart.save();
                await cart.delete();
              }
            }
          }
          await user.save();
          return done(null, user);
        }
      } catch (err) {
        return done(err.message, false);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      passReqToCallback: true,
      profileFields: ["id", "displayName", "name", "email"],
    },
    async (req, accessToken, refreshToken, profile, done) => {
      let { tempUser } = req;
      try {
        if (tempUser) {
          const existingUser = await User.findOne({
            "facebook.id": profile?.id,
          });
          if (existingUser) {
            if (existingUser._id.toString() === tempUser._id.toString()) {
              let { cartId } = req?.cookies;
              let userCart = await Cart.findOne({
                user: existingUser?._id,
                status: "not purchased",
              });
              if (cartId) {
                if (!userCart) {
                  const cart = await Cart.findById(cartId);
                  if (cart) {
                    cart.user = existingUser?._id;
                    cart.isGuestCart = false;
                    await cart.save();
                  }
                } else {
                  const cart = await Cart.findById(cartId);
                  if (cart) {
                    let result = userCart;
                    cart?.cartItems?.forEach((secondObj) => {
                      const matchingIndex = result?.cartItems?.findIndex(
                        (firstObj) =>
                          firstObj.pizza.toString() ===
                          secondObj.pizza.toString()
                      );
                      if (matchingIndex !== -1) {
                        result.cartItems[matchingIndex].quantity +=
                          secondObj.quantity;
                      } else {
                        result.cartItems = [...result?.cartItems, secondObj];
                      }
                    });
                    userCart = result;
                    await userCart.save();
                    await cart.delete();
                  }
                }
              }
              existingUser.loginType = "facebook";
              await existingUser.save();
              return done(null, existingUser);
            }
          } else {
            let user = await User.findById(tempUser._id);
            user.facebook = {};
            user.facebook.id = profile.id;
            user.facebook.name = profile.displayName;
            user.facebook.email = profile._json.email;
            user.loginType = "facebook";
            user.facebook.picture = `https://graph.facebook.com/${profile.id}/picture?width=500&height=500&access_token=${accessToken}`;
            if (!user.providers.includes("facebook"))
              user.providers.push("facebook");
            await user.save();
            req.tempUser = null;
            let { cartId } = req?.cookies;
            let userCart = await Cart.findOne({
              user: existingUser?._id,
              status: "not purchased",
            });
            if (cartId) {
              if (!userCart) {
                const cart = await Cart.findById(cartId);
                if (cart) {
                  cart.user = existingUser?._id;
                  cart.isGuestCart = false;
                  await cart.save();
                }
              } else {
                const cart = await Cart.findById(cartId);
                if (cart) {
                  let result = userCart;
                  cart?.cartItems?.forEach((secondObj) => {
                    const matchingIndex = result?.cartItems?.findIndex(
                      (firstObj) =>
                        firstObj.pizza.toString() === secondObj.pizza.toString()
                    );
                    if (matchingIndex !== -1) {
                      result.cartItems[matchingIndex].quantity +=
                        secondObj.quantity;
                    } else {
                      result.cartItems = [...result?.cartItems, secondObj];
                    }
                  });
                  userCart = result;
                  await userCart.save();
                  await cart.delete();
                }
              }
            }
            await user.save();
            return done(null, user);
          }
        } else {
          const existingUser = await User.findOne({
            "facebook.id": profile.id,
          });
          if (existingUser) {
            let { cartId } = req?.cookies;
            let userCart = await Cart.findOne({
              user: existingUser?._id,
              status: "not purchased",
            });
            if (cartId) {
              if (!userCart) {
                const cart = await Cart.findById(cartId);
                if (cart) {
                  cart.user = existingUser?._id;
                  cart.isGuestCart = false;
                  await cart.save();
                }
              } else {
                const cart = await Cart.findById(cartId);
                if (cart) {
                  let result = userCart;
                  cart?.cartItems?.forEach((secondObj) => {
                    const matchingIndex = result?.cartItems?.findIndex(
                      (firstObj) =>
                        firstObj.pizza.toString() === secondObj.pizza.toString()
                    );
                    if (matchingIndex !== -1) {
                      result.cartItems[matchingIndex].quantity +=
                        secondObj.quantity;
                    } else {
                      result.cartItems = [...result?.cartItems, secondObj];
                    }
                  });
                  userCart = result;
                  await userCart.save();
                  await cart.delete();
                }
              }
            }
            existingUser.facebook.name = profile.displayName;
            existingUser.facebook.email = profile._json.email;
            usexistingUserer.facebook.picture = `https://graph.facebook.com/${profile.id}/picture?width=500&height=500&access_token=${accessToken}`;
            existingUser.loginType = "facebook";
            await existingUser.save();
            return done(null, existingUser);
          }
          const existingEmailUser = await User.findOne({
            email: profile?.emails[0]?.value,
          });
          if (existingEmailUser) {
            return done(null, false, {
              message:
                "The email address of this facebook account is already associated with another account.",
            });
          }
          let user = new User();
          user.facebook = {};
          user.facebook.id = profile.id;
          user.facebook.name = profile.displayName;
          user.facebook.email = profile._json.email;
          user.loginType = "facebook";
          user.facebook.picture = `https://graph.facebook.com/${profile.id}/picture?width=500&height=500&access_token=${accessToken}`;
          if (!user.providers.includes("facebook"))
            user.providers.push("facebook");
          await user.save();
          req.tempUser = null;
          let { cartId } = req?.cookies;
          let userCart = await Cart.findOne({
            user: user?._id,
            status: "not purchased",
          });
          if (cartId) {
            if (!userCart) {
              const cart = await Cart.findById(cartId);
              if (cart) {
                cart.user = user?._id;
                cart.isGuestCart = false;
                await cart.save();
              }
            } else {
              const cart = await Cart.findById(cartId);
              if (cart) {
                let result = userCart;
                cart?.cartItems?.forEach((secondObj) => {
                  const matchingIndex = result?.cartItems?.findIndex(
                    (firstObj) =>
                      firstObj.pizza.toString() === secondObj.pizza.toString()
                  );
                  if (matchingIndex !== -1) {
                    result.cartItems[matchingIndex].quantity +=
                      secondObj.quantity;
                  } else {
                    result.cartItems = [...result?.cartItems, secondObj];
                  }
                });
                userCart = result;
                await userCart.save();
                await cart.delete();
              }
            }
          }
          await user.save();
          return done(null, user);
        }
      } catch (err) {
        return done(err.message, false);
      }
    }
  )
);
