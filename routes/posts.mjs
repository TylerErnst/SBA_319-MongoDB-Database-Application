// const express = require("express");
import express from "express";
const router = express.Router();

import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

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
  .post(async (req, res) => {
    console.log(req.body);
    if (req.body.author && req.body.title && req.body.body) {
      const post = {
        // id: posts[posts.length - 1].id + 1,
        author: req.body.author,
        title: req.body.title,
        body: req.body.body,
        date: new Date(),
        comments: [],
      };

      // posts.push(post);
      // res.json(posts[posts.length - 1]);

      await collection.insertOne(post);
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
    console.log("post");
    if (post) {
      // res.json(post);

      let result = await collection.find().limit(10).toArray();
      // console.log("posts", result)
      res.render("pages/comments", { post: post });
    } else {
      console.log("Document not found");
    }
  })
  .patch(async (req, res) => {
    const postId = req.params.id;
    const newTitle = req.body.title;

    try {
      const result = await collection.updateOne(
        { _id: new ObjectId(postId) },
        { $set: { title: newTitle } }
      );

      if (result.modifiedCount === 1) {
        res.json({ success: true, message: "Post title updated successfully" });
      } else {
        res.status(404).json({ success: false, message: "Post not found" });
      }
    } catch (error) {
      console.error("Error updating post title:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  })
  .delete(async (req, res) => {
    console.log(req.body);
    const postId = req.params.id;
    console.log(postId);

    try {
      const result = await collection.deleteOne({ _id: new ObjectId(postId) });
      if (result.deletedCount === 1) {
        res.json({ success: true, message: "Post deleted successfully" });
      } else {
        res.status(404).json({ success: false, message: "Post not found" });
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
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
