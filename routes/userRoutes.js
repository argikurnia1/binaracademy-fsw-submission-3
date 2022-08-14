const express = require("express");
const { signup, login } = require("../controllers/authController");
const { check } = require("express-validator");
const {
  getAllUser,
  getUserById,
  deleteUserById,
  updateUserById,
} = require("../controllers/userController");
const { validatorUpdate } = require("../utils/user");

const userRouter = express.Router();

userRouter.get("/", getAllUser);
userRouter.get("/:id", getUserById);
userRouter.delete("/:id", deleteUserById);
userRouter.put(
  "/:id",
  validatorUpdate,
  [
    check("username").isLength({ min: "3" }),
    check("email").normalizeEmail().isEmail(),
  ],
  updateUserById
);

userRouter.post(
  "/signup",
  [
    check("username").isLength({ min: "3" }),
    check("email").normalizeEmail().isEmail(),
    check("password").trim().isLength({ min: 6 }),
  ],
  signup
);

userRouter.post("/login", login);

module.exports = userRouter;
