const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { ROLES } = require("../config/constants");

const signToken = (userId, role) =>
  jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  address: user.address,
  role: user.role
});

const signup = async (req, res) => {
  try {
    const { name, email, address, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const user = await User.create({
      name,
      email,
      address,
      password,
      role: ROLES.USER
    });

    const token = signToken(user._id, user.role);
    return res.status(201).json({
      message: "Signup successful",
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to signup", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user._id, user.role);
    return res.json({
      message: "Login successful",
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to login", error: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update password", error: error.message });
  }
};

const me = async (req, res) => {
  return res.json({ user: sanitizeUser(req.user) });
};

module.exports = {
  signup,
  login,
  updatePassword,
  me
};
