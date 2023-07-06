import mongoose from "mongoose";
import supertest from "supertest";
import dotenv from "dotenv";
dotenv.config(); // loads enviroment variables into process.env

import app from "../app";

import User from "../model/authModel.js";
// for testing purposes, we use the test DB (stub)
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;

//  Runs before all the tests
beforeAll((done) => {
  mongoose.connect(TEST_DATABASE_URL);
  mongoose.connection.on("connected", async () => {
    console.log("Connected to MongoDB Successfully");
    done();
  });
  mongoose.connection.on("error", (err) => {
    console.log(err, "An error occurred while connecting to MongoDB");
    done();
  });
});

//  Runs after all the tests
afterAll(async () => {
  await User.findOneAndDelete({ email: "olawolejethro249@gmail.com" });
  mongoose.connection.close();
});

describe("Test Auth", () => {
  test("POST /api/v1/auth/signup", async () => {
    const newUser = {
      firstName: "olawole",
      lastName: "jethro",
      email: "olawolejethro249@gmail.com",
      password: "qwerty",
      confirmPassword: "qwerty",
    };
    const response = await supertest(app)
      .post(`/signup`)
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send(newUser);
    expect(response.headers["content-type"]).toBe(
      "application/json; charset=utf-8"
    );
    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body).toHaveProperty("token");
    expect(response.body.data).toHaveProperty("user");
    expect(response.body.data.user.email).toBe("olawolejethro249@gmail.com");
  });

  test("POST /api/v1/auth/login", async () => {
    const loginDetails = {
      email: "wisdomomobolaji@gmail.com",
      password: "qwerty",
    };
    const response = await supertest(app)
      .post(`/api/v1/auth/signin`)
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send(loginDetails);
    expect(response.headers["content-type"]).toBe(
      "application/json; charset=utf-8"
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("success");
    expect(response.body).toHaveProperty("token");
    expect(response.body.data).toHaveProperty("user");
    expect(response.body.data.user.email).toBe("wisdomomobolaji@gmail.com");
  });
});
