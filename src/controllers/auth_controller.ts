import { NextFunction, Request, Response } from "express";
import userModel from "../models/users_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (req: Request, res: Response) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await userModel.create({
      //we dont pass the body.req directly because we dont want to pass the password in plain text so we passed the arguments as an object
      email: req.body.email,
      password: hashedPassword,
    });
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err);
    return;
  }
  res.status(400).send();
};

const login = async (req: Request, res: Response) => {
  try {
    //verify user
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      res.status(404).send("wrong username of password");
      return;
    }
    //verify password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password as string
    );

    if (!validPassword) {
      res.status(400).send("wrong username or password");
      return;
    }
    //generate token
    if (!process.env.TOKEN_SECRET) {
      res.status(500).send("Server Error");
      return;
    }
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRES,
    });
    res.status(200).send({ token: token, _id: user._id });
  } catch (err) {
    res.status(400).send();
  }
};

type Payload = {
  _id: string;
};
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const authorization = req.header("authorization");
  const token = authorization && authorization.split(" ")[1]; // here we will get the { authorization: "JWT " + testUser.token } from the auth.test.ts and we want to get only the token
  if (!token) {
    return res.status(401).send("Access Denied");
  }

  if (!process.env.TOKEN_SECRET) {
    res.status(500).send("Server Error");
    return;
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).send("Access Denied");
    }
    req.params.userId = (payload as Payload)._id; //takes the id from the token and attaches it to the request
    next();
  });
};

export default { register, login };
