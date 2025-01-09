import { Request, Response, NextFunction } from "express";
import userModel from "../models/users_model";
import postModel from "../models/posts_model";


export const validateUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.params.userId || req.body.sender; 
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return; 
    }
    next(); 
  } catch (error) {
    res.status(500).json({ message: "Error validating user", error });
  }
};


export const validatePostId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const postId = req.params.id || req.body.postId; 
  try {
    const post = await postModel.findById(postId);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return; 
    }
    next(); 
  } catch (error) {
    res.status(500).json({ message: "Error validating post", error });
  }
};
