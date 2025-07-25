//
// imports
//
const express = require("express");
var session = require("express-session");
const app = express();
const cors = require("cors");
const {PrismaSessionStore} = require("@quixo3/prisma-session-store");
const {connectDB} = require("./database/neo4j");
prisma = require("./prisma/client.js");
const path = require("path");
app.use(express.json());
connectDB();
app.set("trust proxy", 1);

app.use(
  cors({
    origin: "https://cine-plus.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

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
      secure: process.env.NODE_ENV === "production",
    },
  })
);

const upload = require("./Routes/upload.js");
app.use("/upload", upload);

const auth = require("./Routes/auth.js");
app.use("/auth", auth);

const movies = require("./Routes/movies.js");
app.use("/movies", movies);

const tvshows = require("./Routes/tvshows.js");
app.use("/tvshows", tvshows);

const profile = require("./Routes/profile.js");
app.use("/profiles", profile);

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

// CITE: google gemini
// Serve static files from the 'build' directory (or wherever your SPA is built)
app.use(express.static(path.join(__dirname, "../client/build")));

// Handle client-side routing by serving the index.html file for all requests
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
