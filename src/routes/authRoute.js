import express from "express";
import { login, signup } from "../controllers/authController.js";
import validate from "../middleware/validationMiddleware.js";
import { loginSchema, signupSchema } from "../validation/authValidation.js";
const authRoute = express.Router();

authRoute.post("/signup", validate(signupSchema), signup);
authRoute.post("/login", validate(loginSchema), login);

export default authRoute;
