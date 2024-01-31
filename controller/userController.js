import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";


// Register a new user
const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ userId: user._id }, "abcdef", {
      expiresIn: "1h",
    });
    res
      .status(201)
      .json({ message: "User registered successfully", user, token });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
};

// Login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Authentication failed" });
    }
    // Generate a JWT token and send it in the response
    const token = jwt.sign({ userId: user._id }, "abcdef", {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Authentication successful", token, user });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

// Update user profile
const userProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    // Check if the user is the same as the one being updated
    if (userId !== req.user._id.toString()) {
      return res.status(403).json({ error: "Access denied" });
    }
    const { name, email } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();

    res.status(200).json({ message: "User profile updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Profile update failed" });
  }
};

// Implement other user-related routes (e.g., update user profile)
// ...

export { userRegister, userLogin, userProfile };
