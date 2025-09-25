import Joi from "@hapi/joi";
import mongoose from "mongoose";

const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message('"{{#label}}" must be a valid ObjectId');
  }
  return value;
};

export const createUserSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  roleId: Joi.custom(objectId).required(),
});

export const updateUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(30).optional(),
  lastName: Joi.string().min(2).max(30).optional(),
  email: Joi.string().email().optional(),
  roleId: Joi.custom(objectId).optional(),
  isActive: Joi.boolean().optional(),
}).min(1);

export const updateManySameDataSchema = Joi.object({
  userIds: Joi.array().items(Joi.custom(objectId).required()).unique().required(),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  email: Joi.string().email().optional(),
  roleId: Joi.custom(objectId).optional(),
}).min(1);

export const updateManyDiffDataSchema = Joi.array()
  .items(
    Joi.object({
      _id: Joi.custom(objectId).required(),
      firstName: Joi.string().optional(),
      lastName: Joi.string().optional(),
      email: Joi.string().email().optional(),
      roleId: Joi.custom(objectId).optional(),
    }).min(2)
  )
  .min(1);
