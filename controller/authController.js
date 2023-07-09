const auth = require("../model/authModel.js");
const dotenv = require("dotenv");
dotenv.config();
const genToken = require("../utils/genToken.js");

exports.signUpUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    const user = await auth.create({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    });
    user.password = undefined;
    user.confirmPassword = undefined;
    user.__v = undefined;
    const token = genToken(user);

    const redirectTo = req.query.redirect || "/"; // Get the redirect URL from the query parameters

    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      // If the request accepts JSON response, send JSON response
      return res.status(201).json({
        status: "success",
        token,
        data: {
          user,
        },
      });
    } else {
      // If the request does not accept JSON response, set the token cookie and redirect
      res.cookie("token", token, { httpOnly: true }).redirect(redirectTo);
    }
  } catch (error) {
    next(error);
  }
};

exports.signInUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return next(new Error("Bad request! Email and Password are required."));

    const user = await auth.findOne({ email }).select("+password");

    if (!user || !(await user.isCorrectPassword(password)))
      return next(
        new Error("Unauthenticated! Email or Password is incorrect.")
      );

    user.password = undefined;
    user.__v = undefined;
    const token = genToken(user);

    const redirectTo = req.query.redirect || "/short"; // Get the redirect URL from the query parameters

    if (req.headers.accept && req.headers.accept.includes("application/json")) {
      // If the request accepts JSON response, send JSON response
      return res.status(200).json({
        status: "success",
        token,
        data: {
          user,
        },
      });
    } else {
      // If the request does not accept JSON response, set the user cookie and redirect
      res.cookie("user", user, { httpOnly: true }).redirect(redirectTo);
    }
  } catch (error) {
    next(error);
  }
};
