import User from "../models/User.js";
import bcrypt from "bcrypt";

const SECRET_TOKEN = process.env.SECRET_TOKEN;

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, SECRET_TOKEN, {
    expiresIn: "1h",
  });
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await User.findById(id);
    res.json(data);
  } catch (error) {
    req.status(500).send(error.message);
  }
};

export const getUsers = async (req, res) => {
  try {
    const data = await User.find();
    res.status(200).json(data);
  } catch (error) {
    req.status(500).send(error.message);
  }
};

export const createUser = async (req, res) => {
  const { name, email, password, picture } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { name, email, password, picture };
    const data = await User.create(newUser);
    res.status(201).json(data);
  } catch (error) {
    req.status(500).send(error.message);
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, password, email, picture, constacts, lastLogin } = req.body;

  const update = {};
  if (name !== undefined) update.name = name;
  if (password !== undefined) update.password = password;
  if (email !== undefined) update.email = email;
  if (picture !== undefined) update.picture = picture;
  if (contacts !== undefined) update.contacts = contacts;
  try {
    const data = await User.findByIdAndUpdate(id, update, { new: true });
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found");
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(403).json({ message: "Invalid credentials." });
    }

    const token = generateToken(user);
    res.json({ token, user: { username: user.name, email: user.email } });
    console.log("loginUser", user, token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
