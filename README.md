# URL Shortener ✂

## Description

URL Shortener is a powerful URL shortening service that provides an intuitive interface to shorten and customize your URLs. With URL Scissors, you can easily generate shortened aliases for your long and complex URLs, making them more manageable and shareable.

Key Features:

- Shorten any valid and accessible URL.
- Customize the shortened alias to make it more memorable and descriptive.
- Generate **downloadable** QR codes for your shortened URLs, allowing easy access through mobile devices.
- All users, whether authenticated or not, can utilize the URL shortening, customization, and QR code generation features.

Authenticated User Features:

- Authenticated users gain access to additional features:
- View their shortened URL history for easy management.
- Access detailed statistics for each shortened URL, including click counts and sources.
- Track and analyze the performance of their shortened URLs.

URL Scissors simplifies URL management and provides a seamless experience for users, allowing them to optimize their URL sharing process. Experience the convenience of concise and trackable URLs by using URL Scissors today.

Built as a capstone project at [Altschool Africa School of Engineering - Node.js track](https://www.altschoolafrica.com/schools/engineering)

## Tech Stack

### 1. Main Dependencies

- **Node.js** and **Express** as the JavaScript runtime environment and server framework
- **Typescript** as programming language of choice
- **MongoDB** as our database of choice
- **Redis** as our in-memory data store for caching
- **Mongoose** as an ODM library of choice
- **Passport** for authentication. This API uses the JWT strategy
- **jsonwebtoken** for signing and verifying JWTs
- **bcrypt** to hash + salt passwords and compare.
- Utilize the built-in **crypto** module to generate MD5 hashes for the URL alias logic.

## Main Files: Project Structure

```sh
  ├── README.md      *** Instructions on how to set up the project locally, documentation, and the API reference
  ├── package.json   *** The dependencies to be installed with "npm install"
  ├── dist           *** Contains compiled TS code
  └── src
      ├── server.js
      ├── app.js
      ├── config
      │   └── db.js
      # │   └── redis.ts
      ├── routes
      │   ├── authRoutes.js
      │   ├── url.js
      # │   └── viewRoutes.ts
      ├── controllers
      │   ├── authController.js
      # │   ├── historyController.ts
      │   └── urlController.js
      # │   └── errorControllers.ts
      ├── models
      │   ├── userUrl.js
      │   └── authModel.js
      # ├── interfaces
      # │   ├── UserDocument.ts
      # │   └── UserObject.ts
      ├── middlewares
      │   └── passport.js
      ├── tests
      │   ├── auth.route.test.ts  *** Contains code for testing the `/auth` endpoints.
      │   └── url.route.test.ts *** Contains code for testing the `/url` endpoints.
      └── utils
          ├── validateURL.js
          └── genToken.ts

```

## Getting Started Locally

### Prerequisites & Installation

To be able to get this application up and running, ensure to have [node](https://nodejs.org/en/download/) installed on your device.

### Development Setup

1. **Download the project locally by forking this repo and then clone or just clone directly via:**

```bash
git clone https://github.com/omobolajisonde/url-scissors.git
```

2. **Set up the Database**
   - Create 2 MongoDB databases (main and test) on your local MongoDB server or in the cloud (Atlas)
   - Copy the connection strings and assign it to the `DATABASE_URI` and `TEST_DATABASE_URL` environment variables each.
   - On connection to these databases, two collections - `users` and `urls` will be created.

## Models

---

### User

| field           | data_type | constraints                    |
| --------------- | --------- | ------------------------------ |
| \_id            | ObjectId  | auto_generated                 |
| firstName       | String    | required                       |
| lastName        | String    | required                       |
| email           | String    | required & unique              |
| password        | String    | required                       |
| confirmPassword | String    | required (must match password) |
| createdAt       | Date      | Defaults to current timestamp  |

### URL

| field         | data_type            | constraints                            |
| ------------- | -------------------- | -------------------------------------- |
| \_id          | ObjectId             | auto_generated                         |
| origUrl       | String               | required & unique                      |
| shortUrl      | String               | unique & dynamically_assigned          |
| urlAlias      | String               | unique & required/dynamically_assigned |
| userId        | ObjectId (ref: User) | dynamically_assigned if logged in      |
| clicks        | Number               | Defaults to 0                          |
| createdAt     | Date                 | Defaults to current timestamp          |
| lastUpdatedAt | Date                 | Defaults to current timestamp          |
| clicksSource  | Array <str>          | Stores clicks source                   |

1. **Install the dependencies** from the root directory, in terminal run:

```
npm install
```

1. **Create a .env file**.

   - Copy and paste the content of `example.env` into this new `.env` file.
   - Set the `EMAIL_USER` variable to your email address.
   - Set the `EMAIL_PASSWORD` variable to your email account [app password](https://support.google.com/mail/answer/185833?hl=en).
   - Visit [Redis Cloud](http://redis.com/try-free/?_ga=2.163442559.292603700.1688108157-2071201179.1687682344&_gl=1*zb82gs*_ga*MjA3MTIwMTE3OS4xNjg3NjgyMzQ0*_ga_8BKGRQKRPV*MTY4ODEwODE1Ny40LjAuMTY4ODEwODE2My41NC4wLjA.) to create a Redis data store and get the values for these variables: `REDIS_HOST`, `REDIS_PORT`, `REDIS_USERNAME`, `REDIS_PASSWORD`

2. **Run the development server:**

```bash
npm run start:dev
```

1. **At this point, your server should be up and running** at [http://127.0.0.1:4000/](http://127.0.0.1:4000/) or [http://localhost:8080](http://localhost:4000)

---

## Testing

In order to run tests, navigate to the root directory and run the following commands:

```bash
npm test
```

> **Note** - All tests are in the `src/tests` folder.

# API REFERENCE

### Getting Started

- Base URL: https://shtnr.onrender.com/

- Authentication: Protected routes, requires a valid JWT to be sent along with the request as a Cookie header.
  Valid tokens can be gotten on `signup`, `signin` and `resetPassword`.

---

### Endpoints

## `/auth`

`POST '/auth/signup'`

Sends a `POST` request to register a user

- Request Body (url-encoded):

| KEY             | VALUE               |
| --------------- | ------------------- |
| firstName       | olawole             |
| lastName        | jethro              |
| email           | kunlekzi2@gmail.com |
| password        | qwerty              |
| confirmPassword | qwerty              |

- Request Body (JSON):

```json
{
  "firstName": "olawole",
  "lastName": "jethro",
  "email": "kunlekzi2@gmail.com",
  "password": "qwerty",
  "confirmPassword": "qwerty"
}
```

- Response (JSON)

Success

```json
{
  "status": "success",
  "token": "<token>",
  "data": {
    "user": {
      "firstName": "olawole",
      "lastName": "jethro",
      "email": "kunlekzi2@gmail.com",
      "createdAt": "2022-11-06T10:39:47.077Z",
      "active": true,
      "_id": "6367a84845e5893038a55bf1"
    }
  }
}
```

`POST '/auth/signin'`

Sends a `POST` request to login a user.

- Request Body (url-encoded):

| KEY      | VALUE               |
| -------- | ------------------- |
| email    | kunlekzi2@gmail.com |
| password | qwerty              |

- Request Body (JSON):

```json
{
  "email": "kunlekzi2@gmail.com",
  "password": "qwerty"
}
```

- Response (JSON)

Success

```json
{
  "status": "success",
  "token": "<token>",
  "data": {
    "user": {
      "_id": "6367a84845e5893038a55bf1",
      "firstName": "olawole",
      "lastName": "jethro",
      "email": "kunlekzi2@gmail.com",
      "createdAt": "2022-11-06T10:39:47.077Z"
    }
  }
}
```

`POST '/auth/forgotPassword'`

Sends a password reset link to the email the user provided.

- Request Body (url-encoded):

| KEY   | VALUE               |
| ----- | ------------------- |
| email | kunlekzi2@gmail.com |

- Request Body (JSON):

```json
{
  "email": "kunlekzi2@gmail.com"
}
```

- Response (JSON)

Success

```json
{
  "status": "success",
  "message": "Check your email inbox, a link to reset your password has been sent."
}
```

`PATCH '/auth/resetPassword/<reset-token>'`

Password reset link sent to user provided email inbox. Updates user password to newly provided password.

> **Note** - `<reset-token>` expires 10 minutes after issuing.

- Request Body (url-encoded):

| KEY             | VALUE  |
| --------------- | ------ |
| password        | 123456 |
| confirmPassword | 123456 |

- Request Body (JSON):

```json
{
  "password": "123456",
  "confirmPassword": "123456"
}
```

- Response (JSON)

Success

```json
{
  "status": "success",
  "token": "<token>",
  "data": {
    "user": {
      "_id": "6367a84845e5893038a55bf1",
      "firstName": "olawole",
      "lastName": "jethro",
      "email": "kunlezi@gmail.com",
      "createdAt": "2022-11-06T10:39:47.077Z",
      "__v": 0
    }
  }
}
```

---

`GET /s/:urlAlias`

Redirects to original URL

---

## `/url`

`POST '/url/shortenURL'`

Sends a `POST` request to shorten provided URL.

- Header (optional):

  - Cookie: JWT

- Request Body (JSON):

```json
{
    "longUrl": "https://www.youtube.com/"
    "customUrl": "short"
}
```

- Response (JSON)

Success

```json
{
  "status": "success",
  "data": {
    "url": {
      "_id": "649439906f57f9cadc64721e",
      "longUrl": "https://www.youtube.com/",
      "shortUrl": "http://127.0.0.1:8000/s/shortn",
      "urlId": "shortn",
      "clicks": 0,
      "clicksSource": [],
      "createdAt": "2023-06-22T12:07:44.720Z",
      "updatedAt": "2023-06-22T12:07:44.720Z",
      "__v": 0
    }
  }
}
```

`POST '/url/qrcode'`

Sends a `POST` request to generate QR code for provided URL.

- Request Body (JSON):

```json
{
  "Url": "https://www.youtube.com/"
}
```

- Response (JSON)

Success

```json
{
  "status": "success",
  "data": {
    "url": "<QRCode dataURI>"
  }
}
```

---

## Deployment

https://shtnr.onrender.com/

## Authors

[olawole jethro](https://github.com/olawolejethro)

## Acknowledgements

The awesome team at Altschool.
