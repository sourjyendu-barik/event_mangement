//importing rquired packages
require("dotenv").config();
const User = require("./models/model.users");
const express = require("express");
const auth = require("./middlewire/auth");
const connectDB = require("./db/db.connectDb");
const cookieParser = require("cookie-parser");
//express instance
const app = express();
//registering global midllewires

const cors = require("cors");

const allowedOrigins = [
  "https://event-mangement-app-woad.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
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
