import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  checkUserAccess,
  updateManyUsersSameData,
  updateManyUsersDifferentData,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createUserSchema,
  updateManyDiffDataSchema,
  updateManySameDataSchema,
  updateUserSchema,
} from "../validation/userValidation.js";
import validate from "../middleware/validationMiddleware.js";

const userRoute = express.Router();

userRoute.post(
  "/create",
  authMiddleware("users"),
  validate(createUserSchema),
  createUser
);
userRoute.post("/list", authMiddleware("users"), getUsers);
userRoute.get("/details/:id", authMiddleware("users"), getUserById);
userRoute.put(
  "/update/:id",
  authMiddleware("users"),
  validate(updateUserSchema),
  updateUser
);
userRoute.delete("/delete/:id", authMiddleware("users"), deleteUser);
userRoute.get(
  "/check-access-module/:id",
  authMiddleware("users"),
  checkUserAccess
);
userRoute.post(
  "/update-many",
  authMiddleware("users"),
  validate(updateManySameDataSchema),
  updateManyUsersSameData
);
userRoute.post(
  "/update-many-diff",
  authMiddleware("users"),
  validate(updateManyDiffDataSchema),
  updateManyUsersDifferentData
);

export default userRoute;
