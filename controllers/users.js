const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

// GET all users
userRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("blogs", {title: 1, author: 1});
  res.json(users);
});

// User Registration
userRouter.post("/", async (req, res, next) => {
  const { body } = req;
  if (!body.username || !body.password)
    return res
      .status(400)
      .send({ error: "Username, name, and password are required" });

  if (body.username.length < 3 || body.password.length < 3)
    return res
      .status(400)
      .send({
        error: "Username and password must be at least 4 characters long"
      });

  try {
    const user = await User.find({ username: body.username });
    if (user.length > 0)
      return res.status(400).send({ error: "username must be unique" });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    let newUser = {
      username: body.username,
      name: body.name,
      password: hashedPassword
    };

    newUser = new User(newUser);
    newUser = await newUser.save();
    res.send(newUser.toJSON());
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
