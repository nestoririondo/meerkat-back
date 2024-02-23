import mongoose from "mongoose";

export const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log("Connected to DB");
    return mongoose.connection;
  } catch (error) {
    console.log("Error connecting to DB");
    return process.exit(1);
  }
};
