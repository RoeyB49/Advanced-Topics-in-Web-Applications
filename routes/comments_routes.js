const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comments_controller");

router.delete("/:id", commentsController.deleteComment);
router.post("/", commentsController.createComment);
router.put("/:id", commentsController.updateComment);
router.get("/:id", commentsController.getCommentById);
router.get("/posts/:postId", commentsController.getCommentsByPostId);

module.exports = router;
