// Imports
import "dotenv/config";
import cors from "cors";
import express from "express";
import connectToDb from "./config/database";
import vehicleRoutes from "./routes/vehicleRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import { notFound } from "./controllers/notFoundController";
import { NODE_ENV, PORT } from "./config/env";
import cookieParser from "cookie-parser";
import { Vehicle } from "./models/vehicleModel";
import localAuthMiddleware from "./middleware/localAuthMiddleware";
import arcjetMiddleware from "./middleware/arcjetMiddleware";

// Variables
const app = express();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", "src/views");
app.use(express.static("src/public"));
app.use(arcjetMiddleware);

app.get("/", localAuthMiddleware, async (req, res) => {
  const vehicles = await Vehicle.find();
  res.render("index", {
    title: "my garage",
    vehicles,
    locals: req.locals,
  });
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.all("*", notFound);

// Server Listening
app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}! 🚀 (${NODE_ENV})`);
  await connectToDb();
});
