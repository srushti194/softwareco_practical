import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authMiddleware = (moduleName) => {
  return async (req, res, next) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token)
        return res
          .status(401)
          .json({ statusCode: 401, message: "Unauthorized" });

      if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded)
        return res
          .status(401)
          .json({ statusCode: 401, message: "Token expired" });

      const userFound = await User.findOne({
        _id: decoded?.userId,
        isActive: true,
      }).populate("roleId");
      if (!userFound || !userFound?.isActive)
        return res
          .status(401)
          .json({ statusCode: 401, message: "Unauthorized" });

      req.user = userFound;

      const role = userFound?.roleId;
      if (!role || !role.accessModules.includes(moduleName)) {
        return res.status(403).json({
          statusCode: 401,
          message: "Unauthorized",
        });
      }

      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ statusCode: 401, message: "Token expired" });
      }

      console.error("Error in authMiddleware: " + err.message);
      return res
        .status(500)
        .json({ statusCode: 500, message: "Something went wrong" });
    }
  };
};

export default authMiddleware;
