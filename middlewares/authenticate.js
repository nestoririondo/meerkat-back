import jwt from "jsonwebtoken";

const SECRET_TOKEN = process.env.SECRET_TOKEN;

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Authorization header required." });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token required." });

  jwt.verify(token, SECRET_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

export const updateLastLogin = async (req, res, next) => {
  try {
    req.user.lastLogin = Date.now();
    await req.user.save();
    res.json(req.user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
