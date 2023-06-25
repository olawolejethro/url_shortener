import auth from "../model/authModel.js";
import dotenv from "dotenv";
dotenv.config();
import genToken from "../utils/genToken.js";

export async function signUpUser(req, res, next) {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    console.log(firstName, lastName, email, password, confirmPassword);
    const user = await auth.create({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    });
    user.password = undefined; // so the password won't show in the output and as payload in the token
    user.confirmPassword = undefined; // so the password won't show in the output and as payload in the token
    user.__v = undefined;
    const token = genToken(user);
    res.redirect("/");
    return res.status(301).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function signInUser(req, res, next) {
  try {
    const { email, password } = req.body;
    console.log(email, password, "hi");
    if (!email || !password)
      return next(new Error("Bad request! Email and Password is required."));
    const user = await auth.findOne({ email }).select("+password");
    if (!user || !(await user.isCorrectPassword(password)))
      return next(new Error("Unauthenticated! Email or Password incorrect."));
    user.password = undefined;
    user.__v = undefined;
    const token = genToken(user);
    return res.redirect("/short");

    // .status(200).json({
    //   status: "success",
    //   token,
    //   data: {
    //     user,
    //   },
    // });
  } catch (error) {
    next(error);
  }
}
