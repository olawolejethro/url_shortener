const supertest = require("supertest");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// const { jest } = require("@jest/globals");

dotenv.config(); // loads enviroment variables into process.env

const app = require("../app");
// jest.useFakeTimers();

const User = require("../model/authModel.js");
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
}, 100000);

//  Runs after all the tests
afterAll(async () => {
  await User.findOneAndDelete({ email: "olawolejethro249@gmail.com" });
  mongoose.connection.close();
});

describe("Test Auth", () => {
  test("GET/welcome", async () => {
    const resp = await supertest(app).get(`/welcome`);
    expect(resp.text).toBe("welcome");
  });
  test("POST /signup", async () => {
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
    expect(response.headers["content-type"]).toBe("text/plain; charset=utf-8");
    expect(response.statusCode).toBe(302);
    expect(response.redirect).toBeTruthy();
    expect(response.header.location).toBe("/");
  }, 100000);

  test("POST /login", async () => {
    const loginDetails = {
      email: "olawolejethro249@gmail.com",
      password: "qwerty",
    };
    const response = await supertest(app)
      .post(`/login`)
      .set("Content-Type", "application/x-www-form-urlencoded")
      .send(loginDetails);

    expect(response.headers["content-type"]).toBe("text/plain; charset=utf-8");
    expect(response.statusCode).toBe(302);
    expect(response.redirect).toBeTruthy();
    expect(response.header.location).toBe("/short");
  }, 100000);
});
