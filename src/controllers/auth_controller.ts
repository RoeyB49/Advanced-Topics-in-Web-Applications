import { NextFunction, Request, Response } from "express";
import userModel from "../models/users_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { access } from "fs";

const register = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.status(400).send("email and password are required");
    return;
  }
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
  }
  res.status(400).send();
};

const generateTokens = (
  _id: string
): { accessToken: string; refreshToken: string } | null => {
  const random = Math.floor(Math.random() * 1000000); //generates a random number between 0 and 1000000
  if (!process.env.TOKEN_SECRET) {
    return null;
  }
  const accessToken = jwt.sign(
    { _id: _id, random: random },
    process.env.TOKEN_SECRET,
    {
      expiresIn: process.env.TOKEN_EXPIRES,
    }
  );
  const refreshToken = jwt.sign(
    { _id: _id, random: random }, //we added a random number to the payload so that we get a new token every time
    process.env.TOKEN_SECRET as string,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION, //here were using EXPIRATION as a 'salt' that keeps changing so we'd get a new random token every time
    }
  );
  return { accessToken, refreshToken };
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

    const tokens = generateTokens(user._id.toString());
    if (!tokens) {
      res.status(400).send("missing auth configuration");
      return;
    }

    if (user.refreshTokens == null) {
      user.refreshTokens = [];
    }
    user.refreshTokens.push(tokens.refreshToken);
    await user.save(); //saves the refresh token to the user

    res.status(200).send({
      email: user.email,
      accessToken: tokens.accessToken,
      _id: user._id,
      refreshTokens: tokens.refreshToken,
    });
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

const logout = async (req: Request, res: Response) => {
  const refreshToken = req.body.refreshTokens;
  if (!refreshToken) {
    res.status(400).send("refresh token is required");
    return;
  }
  //first validate the refresh token
  if (!process.env.TOKEN_SECRET) {
    res.status(400).send("missing auth configuration");
    return;
  }
  jwt.verify(
    refreshToken,
    process.env.TOKEN_SECRET,
    async (err: any, data: any) => {
      if (err) {
        res.status(400).send("invalid token"); // someone trying to use a fake token(attacker)
        return;
      }
      const payload = data as Payload;
      try {
        const user = await userModel.findOne({ _id: payload._id });
        if (!user) {
          res.status(404).send("invalid token");
          return;
        }
        if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
          res.status(400).send("invalid token");
          user.refreshTokens = []; //deleting all of the users tokens
          await user.save();
          return;
        }
        const tokens = user.refreshTokens.filter(
          (token) => token !== refreshToken
        );
        user.refreshTokens = tokens;

        await user.save();
        res.status(200).send("logged out");
      } catch (err) {
        res.status(400).send("invalid token");
      }
    }
  );
};
const refresh = async (req: Request, res: Response) => {
  //first validate the refresh token
  const refreshToken = req.body.refreshTokens;
  if (!refreshToken) {
    res.status(400).send("invalid token");
    return;
  }
  if (!process.env.TOKEN_SECRET) {
    res.status(400).send("missing auth configuration");
    return;
  }
  jwt.verify(
    refreshToken,
    process.env.TOKEN_SECRET,
    async (err: any, data: any) => {
      if (err) {
        res.status(403).send("invalid token");
        return;
      }

      //find the user
      const payload = data as Payload;
      try {
        const user = await userModel.findOne({ _id: payload._id });
        if (!user) {
          res.status(400).send("invalid token");
          return;
        }
        //check that the token exists in the user
        if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
          user.refreshTokens = [];
          await user.save();
          res.status(400).send("invalid token");
          return;
        }
        //generate a new access token
        const newTokens = generateTokens(user._id.toString());
        if (!newTokens) {
          user.refreshTokens = [];
          await user.save();
          res.status(400).send("missing auth configuration");
          return;
        }
        //delete the old refresh token
        user.refreshTokens = user.refreshTokens.filter(
          (token) => token !== refreshToken
        );
        //save the new refresh token to the user
        user.refreshTokens.push(newTokens.refreshToken);
        await user.save();
        //return the new access token and the new refresh token
        res.status(200).send({
          accessToken: newTokens.accessToken,
          refreshTokens: newTokens.refreshToken,
        });
      } catch (err) {
        res.status(400).send("invalid token");
      }
    }
  );
};

export default { register, login, logout, refresh };
