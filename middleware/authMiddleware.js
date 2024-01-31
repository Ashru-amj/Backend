import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authenticateUser = async (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ error: "Unauthorized - Missing token" });
  }

  try {
    const decoded = jwt.verify(token, "abcdef");
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: "Authentication failed" });
  }
};

export default authenticateUser;
