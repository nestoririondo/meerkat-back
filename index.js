import express from "express";
import "dotenv/config";
import cors from "cors";
import { connectDatabase } from "./db/client.js";
import userRouter from "./routes/users.js";
import eventRouter from "./routes/events.js";
import messageRouter from "./routes/messages.js";
import imageRouter from './routes/images.js';
import invitationRouter from './routes/invitations.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
app.use("/events", eventRouter);
app.use("/messages", messageRouter);
app.use('/images', imageRouter);
app.use('/invitations', invitationRouter);

const startServer = async () => {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.log(error, "Failed to start server");
});
