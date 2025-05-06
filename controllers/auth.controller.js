import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  if ([fullName, email, username, password].some(field => !field?.trim())) {
    return res.status(400).send("All fields are required");
  }

  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) return res.status(409).send("User already exists");

  await User.create({ fullName, email, username, password });
  res.status(201).send("User registered successfully");
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).send("Email and password are required");

  const user = await User.findOne({ email });
  if (!user || !(await user.isPasswordCorrect(password))) {
    return res.status(401).send("Invalid credentials");
  }

  res.status(200).send(`Welcome, ${user.fullName}! You are logged in.`);
});
