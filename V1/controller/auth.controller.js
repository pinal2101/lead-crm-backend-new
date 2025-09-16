const db = require("../model/index");
const users = db.users;
const bcrypt = require('bcrypt')
const User = require('../model/users')
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const loginToken = require("../model/loginToken");
require("dotenv").config();


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await users.findOne({ email: email });

    if (!userData || userData.isDeleted) {
      return res
        .status(404)
        .json({ message: "Invalid email or password" });
    }
    const passwordMatch = await bcrypt.compare(password, userData.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!userData.isActive) {
      return res.status(403).json({ success: false, message: "Account is not active" });
    }

    const token = jwt.sign({ userId: userData._id }, process.env.SECRET_KEY, { expiresIn: 172800 });
    await loginToken.create({ userId: userData._id, token })
    return res.status(200).json({
      success: true,
      message: "Login successfully!!",
      token,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Login Failed, please try again later',
      error: error.message
    })
  }
};
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password, role } = req.body;

    if (!firstName || !lastName || !email || !phoneNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (await User.findOne({ email })) {
      return res.status(409).json({ message: "Email already exists" });
    }

    if (await User.findOne({ phoneNumber })) {
      return res.status(409).json({ message: "Phone number already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser._id, role: newUser.role },
    });
  } catch (err) {
    console.error("Register error:", err);

    if (err?.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0];
      if (field === "email") {
        return res.status(409).json({ message: "Email already exists" });
      }
      if (field === "phoneNumber") {
        return res.status(409).json({ message: "Phone number already exists" });
      }
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const { firstName, lastName, email, phoneNumber,isActive, role } = req.body;

    const updatedFields = { firstName, lastName, email, phoneNumber,isActive, role };

    if (typeof isActive === "boolean") {
      updatedFields.isActive = isActive;
    }

    if (role && typeof role === "string") {
      updatedFields.role = role;
    }

    Object.keys(updatedFields).forEach(
      (key) => updatedFields[key] == null && delete updatedFields[key]
    );

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      updatedFields,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};
exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (userData.isDeleted) {
      return res.status(400).json({
        success: false,
        message: "User already deleted",
      });
    }

    const deleteProfile = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "User soft deleted successfully",
      data: deleteProfile,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};
exports.listUsers = async (req, res) => {

  try {
    const { search, page = 1, limit = 3, role } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const perPage = Math.max(1, Math.min(100, parseInt(limit, 10) || 3));

    const query = { isDeleted: false };

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
      ];
    }
    if (role && role !== "all") {
      query.role = new RegExp(`^${role}$`, 'i');
    }


    const usersList = await User.find(query)
      .select('firstName lastName email role phoneNumber')
      .skip((pageNum - 1) * perPage)
      .sort({ createdDate: -1 })
      .limit(perPage);

    const activeTokens = await loginToken.find({}, '_id');
    const activeUserIds = activeTokens.map((t) => t._id.toString());

    const usersWithStatus = usersList.map(user => ({
      ...user.toObject(),
      status: activeUserIds.includes(user._id.toString()) ? "Online" : "Offline"
    }))

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    return res.status(200).json({
      success: true,
      message: "User list fetched successfully",
      perPage,
      currentPage: pageNum,
      totalPages,
      totalUsers,
      users: usersWithStatus,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user list",
      error: error.message,
    });
  }
};
exports.logoutUser = async (req, res) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is required for logout",
      });
    }
    const deletedToken = await loginToken.findOneAndDelete({ token });

    if (!deletedToken) {
      return res.status(400).json({
        success: false,
        message: "Invalid token or already logged out",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to logout user",
      error: error.message,
    });
  }
};
