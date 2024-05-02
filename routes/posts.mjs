// const express = require("express");
import express from 'express';
const router = express.Router();

import db from "../db/conn.mjs";
import { ObjectId } from 'mongodb';


// const posts = require("../data/posts.mjs");
import posts from "../data/posts.mjs";

const collection = await db.collection("posts");




router.use(express.json());

// This is the same code as the previous example!
// We've simply changed "app" to "router" and
// included an export at the end of the file.
// We also change the route paths to be relative to
// the base paths defined in index.js.

router
  .route("/")
  .get((req, res) => {
    // Happens in server.mjs
  })
  .post((req, res) => {
    console.log(req.body)
    if (req.body.userId && req.body.title && req.body.content) {
      const post = {
        id: posts[posts.length - 1].id + 1,
        userId: req.body.userId,
        title: req.body.title,
        content: req.body.content,
      };

      posts.push(post);
      res.json(posts[posts.length - 1]);
    } else res.json({ error: "Insufficient Data" });
  });

router
  .route("/:id")
  .get(async (req, res, next) => {
    // const post = posts.find((p) => p.id == req.params.id);
    // if (post) res.json(post);
    // else next();
    let id = req.params.id;
    const post = await collection.findOne({ _id: new ObjectId(id) });
    console.log(post);
if (post) {
    res.json(post);
} else {
    console.log('Document not found');
}
  })
  .patch((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        for (const key in req.body) {
          posts[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  })
  .delete((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        posts.splice(i, 1);
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  });

router.get("/userId/:userId", (req, res) => {
  let filteredPosts = posts.filter((p) => p.userId == req.params.userId);
  res.json(filteredPosts);
});

// GET /api/posts?userId=<VALUE>
router.get("/posts", (req, res) => {
  const userId = req.query.userId;
  const userPosts = posts.filter((post) => post.userId === userId);
  res.json(userPosts);
});
// // GET /posts/:id/comments
// router.get('/:id/comments', (req, res) => {
//   const postId = req.params.id;
//   const postComments = comments.filter(comment => comment.postId === postId);
//   res.json(postComments);
// });
// // GET /posts/:id/comments?userId=<VALUE>
// router.get('/:id/comments', (req, res) => {
//   const postId = req.params.id;
//   const userId = req.query.userId;
//   const postUserComments = comments.filter(comment => comment.postId === postId && comment.userId === userId);
//   res.json(postUserComments);
// });

// GET /posts/:id/comments   ||   GET /posts/:id/comments?userId=<VALUE>
router.get("/:id/comments", (req, res) => {
  const postId = req.params.id;
  const userId = req.query.userId;

  if (userId) {
    // If userId is provided, filter comments by both postId and userId
    const postUserComments = comments.filter(
      (comment) => comment.postId === postId && comment.userId === userId
    );
    res.json(postUserComments);
  } else {
    // If userId is not provided, filter comments by postId only
    const postComments = comments.filter(
      (comment) => comment.postId === postId
    );
    res.json(postComments);
  }
});

export default router;
