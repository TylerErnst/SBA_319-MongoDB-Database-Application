// const express = require("express");
import express from 'express';
const router = express.Router();

// const users = require("../data/users.mjs");
// const posts = require("../data/posts.mjs");
import users from "../data/users.mjs";
import posts from "../data/posts.mjs";


// This is the same code as the previous example!
// We've simply changed "app" to "router" and
// included an export at the end of the file.
// We also change the route paths to be relative to
// the base paths defined in index.js.

router
  .route("/")
  .get((req, res) => {
    res.json(users);
  })
  .post((req, res) => {
    if (req.body.name && req.body.username && req.body.email) {
      if (users.find((u) => u.username == req.body.username)) {
        res.json({ error: "Username Already Taken" });
        return;
      }

      const user = {
        id: users[users.length - 1].id + 1,
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
      };

      users.push(user);
      res.json(users[users.length - 1]);
    } else res.json({ error: "Insufficient Data" });
  });

router
  .route("/:id")
  .get((req, res, next) => {
    const user = users.find((u) => u.id == req.params.id);
    if (user) res.json(user);
    else next();
  })
  .patch((req, res, next) => {
    const user = users.find((u, i) => {
      if (u.id == req.params.id) {
        for (const key in req.body) {
          users[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (user) res.json(user);
    else next();
  })
  .delete((req, res, next) => {
    const user = users.find((u, i) => {
      if (u.id == req.params.id) {
        users.splice(i, 1);
        return true;
      }
    });

    if (user) res.json(user);
    else next();
  });

// GET /api/users/:id/posts
router.get("/:id/posts", (req, res) => {
  const userId = req.params.id;
  const userPosts = posts.filter((post) => post.userId === userId);
  res.json(userPosts);
});

// GET /users/:id/comments   ||   GET /users/:id/comments?postId=<VALUE>
router.get("/:id/comments", (req, res) => {
  const userId = req.params.id;
  const postId = req.query.postId;

  if (postId) {
    // If postId is provided, filter comments by both userId and postId
    const userPostComments = comments.filter(
      (comment) => comment.userId === userId && comment.postId === postId
    );
    res.json(userPostComments);
  } else {
    // If postId is not provided, filter comments by userId only
    const userComments = comments.filter(
      (comment) => comment.userId === userId
    );
    res.json(userComments);
  }
});

export default router;
