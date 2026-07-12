import jwt from "jsonwebtoken";
import User from "./models/User.js";

const middleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, "secretkeyofnoteapp@123###");

    if (!decoded) {
      return res.status(401).json({ success: false, message: "Wrong token" });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: "No User Found" });
    }
    const newUser = { name: user.name, id: user._id };
    req.user = newUser;
    next();
  } catch (error) {
console.error(error);

  return res.status(401).json({
    success: false,
    message: "Please Login",
  });  }
};

export default middleware;
