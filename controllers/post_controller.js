// const mongoose = require("mongoose");

// const PostSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     content: { type: String, required: true },
//     sender: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Post", PostSchema);
const postModel = require("../models/posts_model");
const getAllPosts = async (req, res) => {
  const senderFilter = req.query.sender;
  try {
    if (senderFilter) {
      const posts = await postModel.find({ sender: senderFilter });
      res.status(200).json(posts);
    } else {
      const posts = await postModel.find();
      res.status(200).send(posts);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};
const createPost = async (req, res) => {
  const post = req.body; //this is an object and not a string, we can stringfy it
  try {
    const newPost = await postModel.create(post); //this create func is a-sync which means we will reach the res.send line before that the post was even create which is not good, thats why we'll use async await which returns a promeise.
    res.status(201).send(newPost);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const deletePost = (req, res) => {
  const postId = req.params.id;
  res.send("Delete Post by id:" + postId);
};

const getPostById = async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await postModel.findById(postId); //this create func is a-sync which means we will reach the res.send line before that the post was even create which is not good, thats why we'll use async await which returns a promeise.
    res.status(201).send(post);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
const updatePost = async (req, res) => {
  const postId = req.params.id;
  const postData = req.body;

  try {
    const post = await postModel.findByIdAndUpdate(postId, postData, {
      new: true,
    });
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }
    res.status(200).send(post);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
module.exports = {
  updatePost,
  getPostById,
  getAllPosts,
  createPost,
  deletePost,
}; //to use those functions we'll need to use the "require" to receive this object.