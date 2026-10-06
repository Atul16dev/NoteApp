import jwt from "jsonwebtoken";
import User from "./models/User.js";

const middleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const [scheme, token] = authHeader?.split(" ") || [];

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      success: false,
      message: "Please sign in to continue.",
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (!(error instanceof jwt.JsonWebTokenError)) {
      console.error("Unable to verify authentication token:", error);
    }

    return res.status(401).json({
      success: false,
      message:
        error instanceof jwt.TokenExpiredError
          ? "Your session has expired. Please sign in again."
          : "Your session is invalid. Please sign in again.",
    });
  }

  try {
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Your account could not be found. Please sign in again.",
      });
    }

    req.user = { name: user.name, id: user._id };
    next();
  } catch (error) {
    console.error("Unable to verify authenticated user:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to verify your account right now.",
    });
  }
};

export default middleware;
