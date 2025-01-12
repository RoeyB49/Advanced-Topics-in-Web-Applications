import express from "express";
const router = express.Router();
import commentsController from "../controllers/comments_controller";
import { authMiddleware } from "../controllers/auth_controller";
// router.get("/posts/:postId", (req, res) => {
//   commentsController.getCommentsByPostId(req, res);
// });
router.delete("/:id", authMiddleware, async (req, res) => {
  commentsController.deleteById.bind(commentsController)(req, res);
});
router.get("/", (req, res) => {
  commentsController.getAll(req, res);
});
router.post(
  "/",
  authMiddleware,
  commentsController.create.bind(commentsController)
);
router.put("/:id", (req, res) => {
  commentsController.update(req, res);
});
router.get("/:id", (req, res) => {
  commentsController.getById(req, res);
});
// router.get("/posts/:postId", commentsController.getCommentsByPostId);

export default router;

//---------------------Backup---------------------
// router.delete("/:id", (req, res) => {
//   commentsController.deleteComment(req, res);
// });
// router.get("/", (req, res) => {
//   commentsController.getAllComments(req, res);
// });
// router.post("/", commentsController.createComment);
// router.put("/:id", (req, res) => {
//   commentsController.updateComment(req, res);
// });
// router.get("/:id", (req, res) => {
//   commentsController.getCommentById(req, res);
// });
// router.get("/posts/:postId", commentsController.getCommentsByPostId);