import { Types } from "mongoose";
import Role from "../models/role.js";

export const createRole = async (req, res) => {
  const { roleName, accessModules } = req.body;

  try {
    const roleNameExists = await Role.findOne({
      roleName: roleName?.trim(),
      isActive: true,
    });

    if (roleNameExists) {
      return res.status(400).json({
        statusCode: 400,
        message: "Role name already exists",
      });
    }

    const role = new Role({ roleName: roleName.trim(), accessModules });
    await role.save();

    res.status(201).json({
      statusCode: 201,
      message: "Role created successfully",
      data: role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const updateRole = async (req, res) => {
  try {
    const roleId = req?.params?.id;
    const { roleName, accessModules } = req.body;

    const roleNameExists = await Role.findOne({
      _id: { $ne: roleId },
      roleName: roleName?.trim(),
      isActive: true,
    });
    if (roleNameExists) {
      return res.status(400).json({
        statusCode: 400,
        message: "Role name already exists",
      });
    }

    const role = await Role.findOneAndUpdate(
      { _id: roleId, isActive: true },
      { roleName, accessModules },
      { new: true }
    );
    if (!role)
      return res
        .status(404)
        .json({ statusCode: 400, message: "Role not found" });

    res.status(200).json({
      statusCode: 200,
      message: "Role updated successfully",
      data: role,
    });
  } catch (err) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const getRoles = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.body;
    page = parseInt(page);
    limit = parseInt(limit);

    const query = {
      roleName: { $regex: search, $options: "i" },
      isActive: true,
    };

    const totalCount = await Role.countDocuments(query);
    const roles = await Role.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      statusCode: 200,
      message: "Roles fetched successfully",
      data: roles,
      meta: {
        totalCount,
        page,
        limit,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const role = await Role.findOne({
      _id: new Types.ObjectId(req.params.id),
      isActive: true,
    });
    if (!role)
      return res
        .status(404)
        .json({ statusCode: 404, message: "Role not found" });

    role.isActive = false;

    await role.save();

    res
      .status(200)
      .json({ statusCode: 200, message: "Role deleted successfully" });
  } catch (err) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const addAccessModule = async (req, res) => {
  const roleId = req.params.id;
  const { accessModules } = req.body;

  try {
    const role = await Role.findOne({ _id: roleId, isActive: true });
    if (!role)
      return res.status(404).json({
        statusCode: 404,
        message: "Role not found",
      });

    const roleExists = role?.accessModules.find((a) => a === accessModules);
    if (roleExists)
      return res
        .status(400)
        .json({ statusCode: 400, message: "Module already added" });

    role.accessModules.push(accessModules);
    await role.save();

    res.status(200).json({
      statusCode: 200,
      message: "Access module inserted successfully",
      data: role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const deleteAccessModule = async (req, res) => {
  const roleId = req.params.id;
  const { accessModules } = req.body;

  try {
    const role = await Role.findOne({ _id: roleId, isActive: true });
    if (!role)
      return res.status(404).json({
        statusCode: 404,
        message: "Role not found",
      });

    role.accessModules = role.accessModules.filter(
      (mod) => mod !== accessModules
    );
    await role.save();

    res.status(200).json({
      statusCode: 200,
      message: "Access module removed successfully",
      data: role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const getRoleById = async (req, res) => {
  try {
    const role = await Role.findOne({
      _id: new Types.ObjectId(req.params.id),
      isActive: true,
    });
    if (!role)
      return res
        .status(404)
        .json({ statusCode: 404, message: "Role not found" });

    res.status(200).json({
      statusCode: 200,
      message: "Role found successfully",
      data: role,
    });
  } catch (err) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
