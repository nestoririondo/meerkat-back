import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_TOKEN = process.env.SECRET_TOKEN;

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, SECRET_TOKEN, {
    expiresIn: "1h",
  });
};

export const getUser = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    req.user = user;
    next();
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const getUsers = async (req, res) => {
  try {
    const data = await User.find();
    const users = data.map((user) => {
      const { _id, name, email, picture, contacts, events, lastLogin } = user;
      return { _id, name, email, picture, contacts, events, lastLogin };
    });

    res.status(200).json(users);
  } catch (error) {
    req.status(500).send(error.message);
  }
};

export const createUser = async (req, res) => {
  const { name, email, password, picture } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email, and password required." });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { name, email, password: hashedPassword, picture };
    const data = await User.create(newUser);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, password, email, picture } = req.body;

  let hashedPassword;
  if (password !== undefined) hashedPassword = await bcrypt.hash(password, 10);

  const update = {};
  if (name !== undefined) update.name = name;
  if (password !== undefined) update.password = hashedPassword;
  if (email !== undefined) update.email = email;
  if (picture !== undefined) update.picture = picture;
  try {
    const data = await User.findByIdAndUpdate(id, update, { new: true });
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const addContact = async (req, res) => {
  const { id } = req.params;
  const newContactId = req.body.contact;
  if (!newContactId) return res.status(400).send("Contact id required.");
  try {
    const data = await User.findByIdAndUpdate(
      id,
      { $addToSet: { contacts: newContactId } },
      { new: true }
    );
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const removeContact = async (req, res) => {
  const { id } = req.params;
  const oldContactId = req.body.contact;
  if (!oldContactId) return res.status(400).send("Contact id required.");
  try {
    const data = await User.findByIdAndUpdate(
      id,
      { $pull: { contacts: oldContactId } },
      { new: true }
    );
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
