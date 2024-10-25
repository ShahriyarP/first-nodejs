const User = require("../models/user");
const jwt = require("jsonwebtoken");

// create token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Create User
const createUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const newUser = new User({ name, email, password });
    const token = generateToken(newUser._id);
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      sameSite: "none",
      secure: true,
    });
    await newUser.save();
    res.status(201).json({
      user: newUser,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Update User
const updateUser = async (req, res, next) => {
  const { id } = req.query;
  const { name, email, password } = req.body;

  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, password },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// Get Users
const getUsers = async (req, res, next) => {
  const { name, email } = req.query;
  const query = {};

  if (name) query.name = name;
  if (email) query.email = email;

  try {
    const users = await User.find(query);
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.json(users);
  } catch (error) {
    next(error);
  }
};

// Delete User
const deleteUser = async (req, res, next) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted", user: deletedUser });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  updateUser,
  getUsers,
  deleteUser,
};
