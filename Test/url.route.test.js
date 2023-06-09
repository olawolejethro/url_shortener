const supertest = require("supertest");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); // loads enviroment variables into process.env

const app = require("../app");
const userUrl = require("../model/userUrl.js");

// for testing purposes, we use the test DB
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;

// A JWT which encodes the one user details which was created before in our database to authenticate protected routes during testing.
const TEST_JWT = process.env.TEST_JWT;

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
  mongoose.connection.close();
});

describe("Shorten URL", () => {
  it("should shorten the URL and return the rendered template", async () => {
    // Assuming you have a valid user token stored in the 'token' variable
    const token = TEST_JWT || "valid-user-token";
    const originalUrl = "https://example.com";

    const response = await supertest(app)
      .post("/short")
      .set("Cookie", `token=${token}`)
      .send({ originalUrl });

    // Verify the response
    expect(response.status).toBe(200);
    expect(response.text).toContain("urlData"); // Assuming 'urlData' is a unique identifier in the rendered template
    // Additional assertions can be added based on your specific requirements
  });

  it("should return an error message if the user is not logged in", async () => {
    const originalUrl = "https://example.com";

    const response = await supertest(app).post("/short").send({ originalUrl });

    // Verify the response
    expect(response.status).toBe(200);
    expect(response.text).toContain("Please log in to shorten the URL");
    // Additional assertions can be added based on your specific requirements
  });

  it("should return an error message if the URL already exists", async () => {
    const token = "valid-user-token";
    const originalUrl = "https://example.com";

    // Assuming you have a URL that already exists in the userUrl collection
    const existingUrl = {
      origUrl: originalUrl,
    };

    // Mocking the userUrl.findOne() method to return the existingUrl
    jest.spyOn(userUrl, "findOne").mockResolvedValue(existingUrl);

    const response = await supertest(app)
      .post("/short")
      .set("Cookie", `token=${token}`)
      .send({ originalUrl });

    // Verify the response
    // expect(response.status).toBe(200);
    expect(response.text).toContain("url already exist");
    // Additional assertions can be added based on your specific requirements
  });

  // Add more test cases to cover different scenarios, such as invalid URLs, server errors, etc.
});

// describe("URL shortening", () => {
// let url = origUrl;
// test("POST /short", async () => {
//   const newURL = {
//     origUrl:
//       "https://docs.google.com/spreadsheets/d/1A2PaQKcdwO_lwxz9bAnxXnIQayCouZP6d-ENrBz_NXc/edit#gid=0",
//   };
//   const response = await supertest(app)
//     .post(`/short`)
//     .set("Cookie", `jwt=${TEST_JWT}`)
//     .send(newURL);
//   expect(response.headers["content-type"]).toBe(
//     "application/json; charset=utf-8"
//   );
//   url = response.body.data.url;
//   expect(response.statusCode).toBe(201);
//   expect(response.body.status).toBe("success");
//   expect(response.body.data).toHaveProperty("url");
//   expect(response.body.data.url.clicks).toBe(0);
// }, 900000);
// test("/qrCode", async () => {
//   const URL = {
//     Url: "https://docs.google.com/spreadsheets/d/1A2PaQKcdwO_lwxz9bAnxXnIQayCouZP6d-ENrBz_NXc/edit#gid=0",
//   };
//   const response = await supertest(app).post(`/qrCode`).send(URL);
//   expect(response.headers["content-type"]).toBe(
//     "application/json; charset=utf-8"
//   );
//   expect(response.statusCode).toBe(201);
//   expect(response.body.status).toBe("success");
//   expect(response.body.data).toHaveProperty("url");
// });
// test("GET /s/:urlAlias", async () => {
//   const response = await supertest(app).get(`/s/${url.urlAlias}`);
//   expect(response.headers["content-type"]).toBe("text/html; charset=utf-8");
//   // Test if the short URL really links back to the Original URL
//   expect(response.headers["Location"]).toBe(url.longUrl);
// }, 900000);
// });
