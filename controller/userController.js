const fs = require("fs");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const HttpError = require("../models/http-error");
const { getAllUserData } = require("../utils/user");

// Get All User
const getAllUser = (req, res) => {
  const allUser = getAllUserData("user.json", "utf-8");
  return res.status(200).json(allUser);
};

// Get User By Id
const getUserById = (req, res, next) => {
  const userId = req.params.id;
  const allUser = getAllUserData("user.json", "utf-8");
  const userById = allUser.find((user) => {
    return user.id === userId;
  });

  if (!userById) {
    return next(new HttpError("User doesn't exists", 400));
  }

  return res.status(200).json(userById);
};

// Update User By Id
// This route is not for password updates.
const updateUserById = async (req, res, next) => {
  const userId = req.params.id;
  const { username, email } = req.body;

  const userData = getAllUserData("user.json", "utf-8");

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid input passed", 400));
  }

  const findUpdateUserById = userData.find((user) => {
    return user.id === userId;
  });

  const filterUser = userData.filter((user) => {
    return user.id !== userId;
  });

  if (!findUpdateUserById) {
    return next(new HttpError("User doesn't exists", 400));
  }

  const usernameIsNotAvailable = filterUser.find((userData) => {
    return userData.username.toLowerCase() === username.toLowerCase();
  });

  const emailIsNotAvailable = filterUser.find((userData) => {
    return userData.email.toLowerCase() === email.toLowerCase();
  });

  if (usernameIsNotAvailable || emailIsNotAvailable) {
    return next(new HttpError("Username or email already exists", 400));
  }

  findUpdateUserById.username =
    username.length >= 3 ? username : findUpdateUserById.username;

  findUpdateUserById.email = email ? email : findUpdateUserById.email;

  fs.writeFileSync("user.json", JSON.stringify(userData));

  return res.status(200).json(findUpdateUserById);
};

// Delete User By Id
const deleteUserById = (req, res, next) => {
  const userId = req.params.id;
  const allUser = getAllUserData("user.json", "utf-8");
  const findDeleteUserById = allUser.find((user) => {
    return user.id === userId;
  });

  if (!findDeleteUserById) {
    return next(new HttpError("User doesn't exists", 400));
  }

  const deleteUser = allUser.filter((user) => {
    return user.id !== userId;
  });

  fs.writeFileSync("user.json", JSON.stringify(deleteUser));

  return res.status(200).json(deleteUser);
};

module.exports = {
  getAllUser,
  getUserById,
  deleteUserById,
  updateUserById,
};
