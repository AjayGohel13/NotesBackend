require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportSetup = require("./passport");
const authRoutes = require("./route/auth")
const app = express();
const session = require("express-session");
// require("./entities/notes")
const createUserTable = require("./entities/user");
const createNotesTable = require("./entities/notes");
const noteRouter = require("./route/notes");
createUserTable();
createNotesTable();
app.use(express.json());

app.use(session({
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://notes-app-frontend-rho-one.vercel.app"
    ],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
)

app.use("/auth", authRoutes)
app.use("/notes", noteRouter)
const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Listen on port ${port}`))
