import express from "express";
import {
  addAccessModule,
  createRole,
  deleteAccessModule,
  deleteRole,
  getRoleById,
  getRoles,
  updateRole,
} from "../controllers/roleController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addAccessModuleSchema,
  createRoleSchema,
  updateRoleSchema,
} from "../validation/roleValidation.js";
import validate from "../middleware/validationMiddleware.js";

const roleRoute = express.Router();

roleRoute.post(
  "/create",
  authMiddleware("roles"),
  validate(createRoleSchema),
  createRole
);
roleRoute.put(
  "/update/:id",
  authMiddleware("roles"),
  validate(updateRoleSchema),
  updateRole
);
roleRoute.post("/list", authMiddleware("roles"), getRoles);
roleRoute.delete("/delete/:id", authMiddleware("roles"), deleteRole);
roleRoute.get("/details/:id", authMiddleware("roles"), getRoleById);
roleRoute.post(
  "/add-access-module/:id",
  authMiddleware("roles"),
  validate(addAccessModuleSchema),
  addAccessModule
);
roleRoute.post(
  "/delete-access-module/:id",
  authMiddleware("roles"),
  validate(addAccessModuleSchema),
  deleteAccessModule
);

export default roleRoute;
