import jwt from "jsonwebtoken";

const SECRET_TOKEN = process.env.SECRET_TOKEN;

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("auth try", authHeader);
  if (!authHeader)
    return res.status(401).json({ message: "Authorization header required." });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token required." });

  jwt.verify(token, SECRET_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403);
    console.log(user, "token decoded");
    req.user = user;
    next();
  });
};
