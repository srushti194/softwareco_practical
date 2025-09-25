import bcrypt from "bcryptjs";
import { Types } from "mongoose";
import User from "../models/user.js";
import Role from "../models/role.js";

export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, roleId } = req.body;
    const userExists = await User.findOne({
      email: email?.toLowerCase(),
      isActive: true,
    });
    if (userExists)
      return res
        .status(400)
        .json({ statusCode: 400, message: "User already exists" });

    const role = await Role.findOne({ _id: roleId, isActive: true });
    if (!role)
      return res
        .status(400)
        .json({ statusCode: 400, message: "Role not found" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      email: email?.toLowerCase(),
      password: hashedPassword,
      roleId,
    });

    res.status(201).json({
      statusCode: 200,
      message: "User created successfully",
      data: {
        _id: newUser?._id,
        firstName: newUser.firstName,
        lastName: newUser?.lastName,
        email: newUser?.email,
        roleId: newUser?.roleId,
      },
    });
  } catch (err) {
    console.log("err", err);

    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong",
      error: err.message,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.body;
    page = parseInt(page);
    limit = parseInt(limit);

    const adminRole = await Role.findOne({ roleName: "Admin", isActive: true });

    let searchQuery = {
      _id: { $ne: req?.user?._id },
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
      isActive: true,
    };

    if (adminRole) searchQuery.roleId = { $ne: adminRole?._id };

    const totalCount = await User.countDocuments(searchQuery);

    const usersList = await User.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .select("firstName lastName email roleId isActive")
      .populate("roleId", "roleName accessModules")
      .sort({ createdAt: -1 });

    res.status(200).json({
      statusCode: 200,
      message: "Users fetched successfully",
      data: usersList,
      meta: {
        totalCount,
        page,
        limit,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong",
      error: err.message,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userFound = await User.findById(req.params.id)
      .select("firstName lastName email roleId isActive")
      .populate("roleId", "roleName accessModules");
    if (!userFound)
      return res
        .status(404)
        .json({ statusCode: 400, message: "User not found" });

    res
      .status(200)
      .json({ statusCode: 200, message: "User found", data: userFound });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong",
      error: err.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, roleId, isActive } = req.body;
    const userFound = await User.findOneAndUpdate(
      { _id: new Types.ObjectId(req.params.id), isActive: true },
      { firstName, lastName, email, roleId, isActive },
      { new: true }
    );
    if (!userFound)
      return res
        .status(404)
        .json({ statusCode: 404, message: "User not found" });

    res.status(200).json({
      statusCode: 200,
      message: "User updated successfully",
      data: {
        _id: userFound?._id,
        firstName: userFound.firstName,
        lastName: userFound?.lastName,
        email: userFound?.email,
        roleId: userFound?.roleId,
      },
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong",
      error: err.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userFound = await User.findOne({
      _id: new Types.ObjectId(req.params.id),
      isActive: true,
    });
    if (!userFound)
      return res
        .status(404)
        .json({ statusCode: 404, message: "User not found" });

    userFound.isActive = false;

    await userFound.save();
    res.status(200).json({
      statusCode: 200,
      message: "User deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong",
      error: err.message,
    });
  }
};

export const checkUserAccess = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId)
      return res
        .status(400)
        .json({ statusCode: 400, message: "userId and module are required" });

    const userFound = await User.findOne({
      _id: userId,
      isActive: true,
    }).populate("roleId", "accessModules roleName");

    if (!userFound) {
      return res
        .status(404)
        .json({ statusCode: 404, message: "User not found" });
    }

    res.status(200).json({
      statusCode: 200,
      message: "User's access module data found successfully",
      data: {
        _id: userId,
        accessModules: userFound.roleId?.accessModules,
      },
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong",
      error: err.message,
    });
  }
};

export const updateManyUsersSameData = async (req, res) => {
  try {
    const updateData = req.body;
    if (!updateData || Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ statusCode: 400, message: "No data provided to update" });
    }

    const userFound = await User.find({
      _id: { $in: updateData?.userIds },
      isActive: true,
    });
    if (userFound?.length < updateData?.userIds?.length)
      return res
        .status(400)
        .json({ statusCode: 400, message: "User not found" });

    await User.updateMany(
      { _id: { $in: updateData?.userIds }, isActive: true },
      { $set: updateData }
    );

    res.status(200).json({
      statusCode: 200,
      message: "Users updated successfully",
    });
  } catch (error) {
    console.log("error", error);

    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const updateManyUsersDifferentData = async (req, res) => {
  try {
    const updates = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid input, expected non-empty array",
      });
    }

    const bulkOps = updates.map((item) => {
      const { _id, ...updateFields } = item;
      if (!_id) throw new Error("Each update item must contain _id");

      return {
        updateOne: {
          filter: { _id: new Types.ObjectId(_id) },
          update: { $set: updateFields },
        },
      };
    });

    await User.bulkWrite(bulkOps);

    res.status(200).json({
      statusCode: 200,
      message: "User data updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
