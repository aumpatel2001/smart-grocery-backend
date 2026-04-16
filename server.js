// server.js
// Entry point for backend Express application, using environment vars, CORS, JSON parsing, and route setup
require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");

// Router module imports
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/authMiddleware");
const groceryRoutes = require("./routes/grocery");
const shoppingListRoutes = require("./routes/shoppingList");
const dashboardRoutes = require("./routes/dashboard");

const app = express();

// middleware MUST be before routes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  health check
app.get("/api/health", (req, res) => res.send("Backend is running ✅"));

//  auth routes
app.use("/api/auth", authRoutes);

//  grocery routes
app.use("/api/groceries", groceryRoutes);

//  shopping list routes
app.use("/api/shopping-list", shoppingListRoutes);

//  dashboard routes (stats)
app.use("/api/dashboard", dashboardRoutes); 

//  protected route (JWT required)
app.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed ✅",
    user: req.user,
  });
});

//  optional debug
app.post("/echo", (req, res) => {
  res.json({ received: req.body, contentType: req.headers["content-type"] });
});

// Serve frontend build assets from client/dist when deployed as a single Render service.
app.use(express.static(path.join(__dirname, "client", "dist")));
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

const PORT = Number(process.env.PORT) || 5001;
app.listen(PORT, () => console.log("Server running on", PORT));