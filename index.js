import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import messagesRoutes from "./routes/MessagesRoute.js";
import setupSocket from "./socket.js";
import channelRoutes from "./routes/ChannelRoutes.js";

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 5000;
const databaseURL = process.env.MONGO_URI; // Use MONGO_URI instead of DATABASE_URL

// Debugging logs
console.log(" PORT:", port);
console.log(
  " Database URL:",
  databaseURL ? "Loaded Successfully" : "MISSING! Check .env file"
);

// Middleware
app.use(
  cors({
    origin: process.env.ORIGIN || "http://localhost:3000", // Make sure this matches frontend URL
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests explicitly
app.options("*", cors());

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/channel", channelRoutes);

// Start Server
const server = app.listen(port, () => {
  console.log(` Server is running at http://localhost:${port}`);
});

// WebSocket setup
setupSocket(server);

// Database Connection
mongoose
  .connect(databaseURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(" Database Connection Successful");
  })
  .catch((err) => {
    console.error(" Database Connection Error:", err.message);
  });
