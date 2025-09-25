import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const exists = await User.findOne({
      email: email?.toLowerCase(),
      isActive: true,
    });
    if (exists)
      return res
        .status(400)
        .json({ statusCode: 400, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign({ userId: user?._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({
      statusCode: 200,
      message: "User registered successfully",
      data: {
        _id: user?._id,
        firstName: user.firstName,
        lastName: user?.lastName,
        email: user?.email,
        roleId: user?.roleId,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: "Something went wrong",
      error: err.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      email: email?.toLowerCase(),
      isActive: true,
    });
    if (!user)
      return res
        .status(400)
        .json({ statusCode: 400, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ statusCode: 400, message: "Invalid password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });
    res.status(200).json({
      statusCode: 200,
      message: "User logged in successfully",
      data: {
        _id: user?._id,
        firstName: user.firstName,
        lastName: user?.lastName,
        email: user?.email,
        roleId: user?.roleId,
      },
      token,
    });
  } catch (err) {
    res.status(
      res.status(500).json({
        statusCode: 500,
        message: "Something went wrong",
        error: err.message,
      })
    );
  }
};
