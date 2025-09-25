import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    roleName: { type: String },
    accessModules: { type: [String] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema);
export default Role;
