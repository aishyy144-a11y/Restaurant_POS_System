const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register user
const register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, phone, password, role });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    // 1. Check Env Admin Login
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminEmail && adminPassword && email.trim() === adminEmail.trim() && password.trim() === adminPassword.trim()) {
            const adminUser = {
                _id: "admin_env_id", // Dummy ID
                name: "Ayesha kareem",
                email: adminEmail,
                role: "admin"
            };
        const token = jwt.sign({ id: adminUser._id, role: adminUser.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
        return res.status(200).json({ user: adminUser, token });
    }

    const user = await User.findOne({ email: email.trim() });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Direct comparison (for plain text passwords)
    if (user.password === password) {
         const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
         return res.status(200).json({ user, token });
    }

    // 3. Bcrypt comparison (for old hashed passwords)
    // NOTE: This will fail if user.password is NOT a hash but just a different string
    // So we wrap it in try/catch or just ignore error
    let isMatch = false;
    try {
        isMatch = await bcrypt.compare(password, user.password);
    } catch(err) {
        // If user.password is plain text (e.g. "1234") but doesn't match input "5678"
        // bcrypt might complain "Not a valid BCrypt hash".
        // In that case, we know it's not a match.
        isMatch = false;
    }
    
    if (isMatch) {
        // OPTIONAL: Auto-convert to plain text so it shows in Admin Panel
        // This helps fulfill the user's request to "Show plain passwords"
        user.password = password; 
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
        return res.status(200).json({ user, token });
    }

    return res.status(401).json({ message: "Invalid password" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get user data (protected)
const getUserData = async (req, res) => {
  try {
    // Check for Env Admin
    if (req.user.id === "admin_env_id") {
        const adminUser = {
            _id: "admin_env_id",
            name: "Ayesha kareem",
            email: process.env.ADMIN_EMAIL,
            role: "admin"
        };
        return res.status(200).json({ data: adminUser });
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Logout (optional)
const logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

module.exports = { register, login, getUserData, logout, getAllUsers, deleteUser };
