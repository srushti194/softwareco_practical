import Joi from "@hapi/joi";
import mongoose from "mongoose";

const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message('"{{#label}}" must be a valid ObjectId');
  }
  return value;
};

export const createRoleSchema = Joi.object({
  roleName: Joi.string().min(2).max(50).required(),
  accessModules: Joi.array().items(Joi.string().min(1)).unique().required(),
});

export const updateRoleSchema = Joi.object({
  roleName: Joi.string().min(2).max(50).optional(),
  accessModules: Joi.array().items(Joi.string().min(1)).unique().optional(),
}).min(1);

export const addAccessModuleSchema = Joi.object({
  accessModules: Joi.string().required(),
});
