import request from "supertest";
import initApp from "../server"; //importing the app so we can use it on our tests
import mongoose from "mongoose";
import postModel from "../models/posts_model";
import { Express } from "express";
import userModel, { IUser } from "../models/users_model";
let app: Express;
beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
  await userModel.deleteMany();
  await postModel.deleteMany();
}); //jest is looking and running this function at first, inside this function we will implement the logic to setup the test environment,
//because node is async we need a callback function to tell jest that we are done with the setup work

afterAll(async () => {
  console.log("afterAll");
  await mongoose.connection.close();
});
type User = IUser & { token?: string };

const testUser: User = {
  email: "test@user.com",
  password: "testPassword",
};
const baseUrl = "/auth";
describe("Auth test suite", () => {
  //because jest is async and were getting a promise from request(app).get("/posts").expect(200); we need to use async/await

  test("Auth test register", async () => {
    const response = await request(app)
      .post(baseUrl + "/register")
      .send(testUser);
    expect(response.statusCode).toBe(200);
  });

  test("Auth test register fail1", async () => {
    const response = await request(app)
      .post(baseUrl + "/register")
      .send(testUser);
    expect(response.statusCode).not.toBe(200);
  });

  test("Auth test register fail2", async () => {
    const response = await request(app)
      .post(baseUrl + "/register")
      .send({
        email: "fasfasf",
      });
    expect(response.statusCode).not.toBe(200);

    const response2 = await request(app)
      .post(baseUrl + "/register")
      .send({
        email: "",
        password: "fasfasf",
      });
  });

  test("Auth test login", async () => {
    const response = await request(app)
      .post(baseUrl + "/login")
      .send(testUser);
    expect(response.statusCode).toBe(200);
    const token = response.body.token;
    expect(token).toBeDefined();
    expect(response.body._id).toBeDefined();
    testUser.token = response.body.token;
    testUser._id = response.body._id;
  });

  test("Auth test login fail", async () => {
    const response = await request(app)
      .post(baseUrl + "/login")
      .send({ email: testUser.email, password: "wrongPassword" });
    expect(response.statusCode).not.toBe(200);

    const response2 = await request(app)
      .post(baseUrl + "/login")
      .send({ email: "flknsdnf", password: "wrongPassword" });
    expect(response2.statusCode).not.toBe(200);
  });

  // test("Auth test me", async () => {
  //   const response = await request(app).post("/posts").send({
  //     title: "Test post",
  //     content: "Test post content",
  //     sender: "safas",
  //   });
  //   expect(response.statusCode).not.toBe(201);

  //   const response2 = await request(app)
  //     .post("/posts")
  //     .set({ authorization: "JWT" + testUser.token }) //passing the token to the header
  //     .send({
  //       title: "Test post",
  //       content: "Test post content",
  //       sender: "safas",
  //     });

  //   expect(response2.statusCode).toBe(201);
  // });

  test("Auth test me", async () => {
    // Assuming this request does not require authorization
    const response = await request(app).post("/posts").send({
      title: "Test post",
      content: "Test post content",
      sender: "safas",
    });

    // Check if this first request actually fails as expected
    expect(response.statusCode).not.toBe(201);

    const response2 = await request(app)
      .post("/posts")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        title: "Test post",
        content: "Test post content@@@@@@@@",
        sender: "safas",
      });

    expect(response2.statusCode).toBe(201);
  });
});
