const express = require("express");
const router = express.Router();
const Post = require("../controllers/post_controller"); //importing the functions from post.js

router.get("/", Post.getAllPosts);
router.get("/:id", Post.getPostById);

router.post("/", Post.createPost);
router.put("/:id", Post.updatePost);
router.delete("/:id", Post.deletePost);

module.exports = router;