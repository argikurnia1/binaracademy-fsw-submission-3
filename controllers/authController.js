const fs = require("fs");
const bcrypt = require("bcrypt");
const uniqid = require("uniqid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const { getAllUserData } = require("../utils/user");

// Signup
const signup = async (req, res, next) => {
  const userData = getAllUserData("user.json", "utf-8");

  const { username, email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input passed", 400));
  }

  const usernameIsNotAvailable = userData.find((userData) => {
    return userData.username.toLowerCase() === username.toLowerCase();
  });

  const emailIsNotAvailable = userData.find((userData) => {
    return userData.email.toLowerCase() === email.toLowerCase();
  });

  if (usernameIsNotAvailable || emailIsNotAvailable) {
    return next(new HttpError("Username or email already exists", 400));
  }

  // Hash Password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(new HttpError("Couldn't signup please try again.", 500));
  }

  const registerData = {
    id: uniqid(),
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password: hashedPassword,
  };

  userData.push(registerData);

  fs.writeFileSync("user.json", JSON.stringify(userData));

  return res.status(201).json(registerData);
};

// Login
const login = async (req, res, next) => {
  const userData = getAllUserData("user.json", "utf-8");

  const { email, password } = req.body;

  if (!email || !password) {
    return next(new HttpError("Missing required user property", 400));
  }

  const userIsAvailable = userData.find((userData) => {
    return userData.email.toLowerCase() === email.toLowerCase();
  });

  if (!userIsAvailable) {
    return next(new HttpError("User doesn't exists", 400));
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, userIsAvailable.password);
  } catch (err) {
    return next(
      new HttpError(
        "Couldn't log you in, please check your credentials and try again.",
        500
      )
    );
  }

  if (!isValidPassword) {
    return next(new HttpError("Invalid credentials", 403));
  }

  return res.status(200).json({
    email,
  });
};

module.exports = {
  signup,
  login,
};
