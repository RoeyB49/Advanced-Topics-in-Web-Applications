const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connectDB = require("./database/db");
const dotenv = require("dotenv").config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const postsRoutes = require("./routes/posts_routes");
app.use("/posts", postsRoutes); //brings all the routes we declared on ./routes/post_routes, and connects it to our app (makes it work like we wrote it on app.js).
app.get("/about", (req, res) => {
  res.send("about response");
});
connectDB();

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
