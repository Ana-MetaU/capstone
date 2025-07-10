//
// imports
//
const express = require("express");
var session = require("express-session");
const app = express();
const cors = require("cors");
const {connectDB} = require("./database/neo4j");
const PORT = process.env.PORT || 3000;

// Configure CORS to allow requests from your frontend's origin and include credentials
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
connectDB();

// NOTE: setting the httpOnly: true means I won't be able to access from the clieint side.
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false, httpOnly: true, maxAge: 365 * 24 * 60 * 60 * 1000},
  })
);

const auth = require("./Routes/auth.js");
app.use("/auth", auth);
const movies = require("./Routes/movies.js");
app.use("/movies", movies);
const profile = require("./Routes/profile.js");
app.use("/profile", profile);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.json({
    message: "Cine Plus API",
    database: "Neo4j",
    status: "running",
  });
});
