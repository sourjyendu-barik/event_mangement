//importing rquired packages
require("dotenv").config();
const User = require("./models/model.users");
const express = require("express");
const cors = require("cors");
const auth = require("./middlewire/auth");
const connectDB = require("./db/db.connectDb");
const cookieParser = require("cookie-parser");
//express instance
const app = express();
//registering global midllewires
const corsOption = {
  origin: ["http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("API Running...");
});
//public routes
app.use("/auth", require("./routes/auth.routes"));
//auth middlewire
app.use(auth);
app.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});
//protectedRoutes
app.use("/events", require("./routes/event.routes"));
app.use("/tickets", require("./routes/booking.routes"));
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
