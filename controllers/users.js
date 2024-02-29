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
  const { query } = req;
  const { id } = req.user;
  if (!query.q) return res.status(400).json({ message: "Query required." });
  try {
    const data = await User.find({
      $or: [
        { name: { $regex: query.q, $options: "i" } },
        { email: { $regex: query.q, $options: "i" } },
      ],
    });
    const filteredData = data.filter((user) => user._id.toString() !== id);
    if (filteredData.length === 0)
      return res.status(404).json({ message: "No users found." });
    res.status(200).json(filteredData);
  } catch (error) {
    res.status(500).send(error.message);
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
    res.status(500).send({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, password, email, picture, ...other } = req.body;
  if (Object.keys(other).length > 0)
    return res.status(400).send("Invalid updates.");

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
  if (id === newContactId)
    return res.status(400).send("Can't add self as contact.");

  try {
    // add user to new contact's contacts
    const updatedContact = await User.findById(newContactId);
    if (!updatedContact) return res.status(404).send("Contact not found.");
    updatedContact.contacts.push(id);
    await updatedContact.save();

    // add new contact to user's contacts
    const user = await User.findById(id);
    if (!user) return res.status(404).send("User not found.");
    if (
      user.contacts.map((contact) => contact.toString()).includes(newContactId)
    )
      return res.status(400).send("Contact already added.");
    user.contacts.push(newContactId);
    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const removeContact = async (req, res) => {
  const oldContactId = req.body.contact;
  const { id } = req.params;
  if (!oldContactId) return res.status(400).send("Contact id required.");
  try {
    // remove user from old contact's contacts
    const updatedContact = await User.findById(oldContactId);
    if (!updatedContact) return res.status(404).send("Contact not found.");
    updatedContact.contacts.pull(id);
    await updatedContact.save();

    // remove old contact from user's contacts
    const user = await User.findById(id);
    if (!user) return res.status(404).send("User not found.");
    user.contacts.pull(oldContactId);
    const updatedUser = await user.save();

    res.json(updatedUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(403).json({ message: "Wrong password." });
    }

    const token = generateToken(user);
    res.json({ token, user: { username: user.name, email: user.email } });
    console.log("loginUser", user, token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserNames = async (req, res) => {
  const { arrayOfIds } = req.query;
  try {
    const data = await User.find({ _id: { $in: arrayOfIds } }).select(
      "name picture"
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
