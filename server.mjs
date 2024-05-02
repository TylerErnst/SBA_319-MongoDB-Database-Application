// const express = require("express");
import express from 'express';
const app = express();
// import db from "./db/conn.mjs";
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT;

// const users = require("./routes/users.mjs");
// const posts = require("./routes/posts");
// const postData = require("./data/posts");
// const comments = require("./routes/comments.mjs");
// const error = require("./utilities/error");
import users from "./routes/users.mjs";
import posts from "./routes/posts.mjs";
import postData from "./data/posts.mjs";
import comments from "./routes/comments.mjs";
import error from "./utilities/error.mjs";

app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/comments", comments);

app.set("view engine", "ejs");

// serve static files from the styles directory
app.use(express.static("./styles"));


// Parsing Middleware
app.use(express.json());

// Logging Middleware
app.use((req, res, next) => {
  const time = new Date();

  console.log(
    `-----
${time.toLocaleTimeString()}: Received a ${req.method} request to ${req.url}.`
  );
  if (Object.keys(req.body).length > 0) {
    console.log("Containing the data:");
    console.log(`${JSON.stringify(req.body)}`);
  }
  next();
});

//index.ejs template
app.get("/", (req, res) => {
  const menu = [
    { title: "Home", href: "http://localhost:3000/" },
    { title: "Posts", href: "http://localhost:3000/posts" },
    //{ title: "Comments", href: "http://localhost:3000/comments" },
    //{ title: "About", href: "http://localhost:3000/about" },
    //{ title: "Login", href: "http://localhost:3000/login" },
  ];
  res.render("pages/index", { links: menu });
});
//about.ejs template
app.get("/about", (req, res) => {
  const user = { firstName: "Tyler", age: 29 };
  res.render("pages/about", { user: user });
  console.log(user);
});
//posts.ejs template
app.get("/posts", (req, res) => {
  // console.log("posts", postData)
  res.render("pages/posts", { posts: postData });
});



app.get("/login", (req, res) => {
  res.render("pages/login");
});

app.post("/login", (req, res) => {
  console.log('success');
});

app.get("/image", (req, res) => {
  res.render("./image", "dog.jpg");
});


// Error-handling middleware.
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err.message });
});

// 404 Middleware
app.use((req, res) => {
  res.status(404);
  res.json({ error: "Resource Not Found" });
});

// Start Server
app.listen(port, () => {
  console.log(`Server listening on port: ${port}.`);
});
