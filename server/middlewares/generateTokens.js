const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const generateAccessToken = (user, loginProvider) => {
  try {
    let email;
    if (loginProvider === "google") {
      email = user.google.email;
    }
    if (loginProvider === "facebook") {
      email = user.facebook.email;
    }
    if (loginProvider === "local") {
      email = user.email;
    }
    const accessToken = jwt.sign(
      { email, loginProvider },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
      }
    );

    return accessToken;
  } catch (err) {
    console.log(`Error from generateAcccessToken.js: ${err.message}`);
  }
};

const generateRefreshToken = (user, expiration, loginProvider) => {
  try {
    let email;
    if (loginProvider === "google") {
      email = user?.google?.email;
    }
    if (loginProvider === "facebook") {
      email = user?.facebook?.email;
    }
    if (loginProvider === "local") {
      email = user?.email;
    }
    const refreshToken = jwt.sign(
      { email, loginProvider },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: expiration,
      }
    );

    return refreshToken;
  } catch (err) {
    console.log(`Error from generateRefreshToken.js: ${err.message}`);
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
