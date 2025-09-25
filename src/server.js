import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoute from "./routes/userRoute.js";
import roleRoute from "./routes/roleRoute.js";
import authRoute from "./routes/authRoute.js";

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

app.use("/api/users", userRoute);
app.use("/api/roles", roleRoute);
app.use("/api/auth", authRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
