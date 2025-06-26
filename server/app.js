//
// imports
//
const express = require("express");
const app = express();
const cors = require("cors");
const {connectDB} = require("./database/neo4j");
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
connectDB();

const auth = require("./Routes/auth.js");
app.use("/auth", auth);

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
