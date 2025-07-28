//
// imports
//
const express = require("express");
var session = require("express-session");
const app = express();
const cors = require("cors");
const {PrismaSessionStore} = require("@quixo3/prisma-session-store");
const {connectDB} = require("./database/neo4j");
const PORT = process.env.PORT || 3000;

prisma = require("./prisma/client.js");
const path = require("path");
app.use(express.json());
connectDB();
app.set("trust proxy", 1);

// Configure CORS to allow requests from your frontend's origin and include credentials
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://cine-plus.onrender.com"
        : "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// NOTE: setting the httpOnly: true means I won't be able to access from the clieint side.
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      dbRecordIdIsSessionId: true,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production" ? true : false,
    },
  })
);

const profilePictureRouter = require("./Routes/upload.js");
app.use("/upload", profilePictureRouter);

const auth = require("./Routes/auth.js");
app.use("/auth", auth);
const movies = require("./Routes/movies.js");
app.use("/movies", movies);

const tvshows = require("./Routes/tvshows.js");
app.use("/tvshows", tvshows);

const profile = require("./Routes/profile.js");
app.use("/profile", profile);

const users = require("./Routes/users.js");
app.use("/users", users);

const follow = require("./Routes/follow.js");
app.use("/follow-requests", follow);

const feed = require("./Routes/feed.js");
app.use("/feed", feed);

const likes = require("./Routes/like.js");
app.use("/like", likes);

const comment = require("./Routes/comment.js");
app.use("/comment", comment);

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
