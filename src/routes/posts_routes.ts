import express from "express";
const router = express.Router();
import postController from "../controllers/post_controller"; //importing the functions from post.js
import { authMiddleware } from "../controllers/auth_controller";

router.get("/", postController.getAll.bind(postController)); //bind attaches the object to the pointers function
router.get("/:id", (req, res) => {
  postController.getById(req, res);
});
router.put("/:id", (req, res) => {
  postController.update(req, res);
});
router.post("/", authMiddleware, postController.create.bind(postController));
router.delete("/:id", authMiddleware, (req, res) => {
  postController.deleteById(req, res);
});

export default router;

//---------------------Backup---------------------
// router.get("/", postController.getAll.bind(postController)); //bind attaches the object to the pointers function
// router.get("/:id", (req, res) => {
//   postController.getById(req, res);
// });
// router.put("/:id", (req, res) => {
//   postController.update(req, res);
// });
// router.post("/", authMiddleware, postController.create.bind(postController));
// router.delete("/:id", authMiddleware, (req, res) => {
//   postController.deleteById(req, res);
// });
