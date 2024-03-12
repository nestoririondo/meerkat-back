import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Invitation from "../models/Invitation.js";
import Event from "../models/Event.js";

const {
  SECRET_TOKEN,
  GMAIL_USER,
  GMAIL_CLIENTID,
  GMAIL_CLIENTSECRET,
  GMAIL_REFRESHTOKEN,
  CLIENT,
} = process.env;

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, SECRET_TOKEN, {
    expiresIn: "8h",
  });
};

export const getUser = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id).populate("picture", "url");
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
    }).populate("picture", "url");
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
    console.log(error.code, error.keyValue, "error");
    if (error.code === 11000 && error.keyValue.email)
      return res.status(400).json({ message: "Email already in use." });
    if (error.code === 11000 && error.keyValue.name)
      return res.status(400).json({ message: "User name already in use." });

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
    const data = await User.findByIdAndUpdate(id, update, {
      new: true,
    }).populate("picture", "url");
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
    const user = await User.findById(id).populate("picture", "url");
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
    const user = await User.findById(id).populate("picture", "url");
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
    const data = await User.find({ _id: { $in: arrayOfIds } })
      .populate("picture", "url")
      .select("name picture");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const inviteUser = async (req, res) => {
  console.log("EMAIL SEND REQUEST", req.body, req.params, req.user.id);
  const { email } = req.body;
  const { id } = req.params;
  const userId = req.user.id;
  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }
  try {
    // Create a new user with the provided email
    const tempUsername = email.split("@")[0]; // Use the part before the @ in the email as the temporary username
    const tempPassword = await bcrypt.hash("tempPassword123!", 10); // Use a temporary password
    const newUser = {
      name: tempUsername,
      email,
      password: tempPassword,
    };
    const user = await User.create(newUser);

    // Get event information
    const event = await Event.findById(id).populate("owner", "name");

    // Generate a unique token for the user
    const token = generateToken(user);

    // Send an invitation email with a link to complete the profile

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: GMAIL_USER,
        clientId: GMAIL_CLIENTID,
        clientSecret: GMAIL_CLIENTSECRET,
        refreshToken: GMAIL_REFRESHTOKEN,
      },
    });

    const mailOptions = {
      from: '"The Meerkats" <jointhemeerkats@gmail.com>',
      to: email,
      subject: "Complete your registration",
      text: `${event.owner.name} just invited your to ${event.title}. Please sign up using the following link and join the Meerkats: ${CLIENT}/complete-registration/${token}`,
      html: `<p>${event.owner.name} just invited your to ${event.title}.</p><p>Please sign up using the following link and join the Meerkats: <a href="${CLIENT}/complete-registration/${token}">Complete Registration</a></p>`,
    };

    //  create an invitation
    const invitation = await Invitation.create({
      type: "event",
      inviting: userId,
      invited: user._id,
      event: id,
    });

    await transporter.sendMail(mailOptions);

    res.status(201).json(invitation);
  } catch (error) {
    console.log(error.code, error.keyValue);
    if (error.code === 11000 && error.keyValue.email)
      return res.status(400).json({ message: "Email already in use." });

    res.status(500).send({ message: error.message });
  }
};

export const decryptToken = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: "Token required." });
  try {
    const user = jwt.verify(token, SECRET_TOKEN);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const completeRegistration = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, picture } = req.body;
  console.log("completeRegistration", id, name, email, password, picture);
  if (!name || !email || !password || !picture) {
    return res
      .status(400)
      .json({ message: "Name, email, and password required." });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { name, email, password: hashedPassword, picture };
    const data = await User.findByIdAndUpdate(id, newUser, { new: true });
    res.status(201).json(data);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
