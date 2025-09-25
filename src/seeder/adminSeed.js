import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import Role from "../models/role.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    let role = await Role.findOne({ roleName: "Admin", isActive: true });
    if (!role) {
      role = await Role.create({
        roleName: "Admin",
        accessModules: ["users", "roles"],
        isActive: true,
      });
      console.log("Admin role created");
    }

    const adminUser = await User.findOne({ email: "admin@mailinator.com" });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        firstName: "Admin",
        lastName: "User",
        email: "admin@mailinator.com",
        password: hashedPassword,
        roleId: role?._id,
        isActive: true,
      });
    }

    console.log("Admin user created");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedAdmin();
