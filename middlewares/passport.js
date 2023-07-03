import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import auth from "../model/authModel.js";

passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email", // Assuming the email field is used for authentication
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = new auth();
        // Find the user by email
        const users = await auth.find({ email }).select("+password");
        // console.log(users);
        const validateUser = await user.isCorrectPassword(password);
        // If user doesn't exist or password is incorrect, return error
        if (!users || !validateUser) {
          return done(null, false, { message: "Invalid credentials" });
        }

        // User authentication successful, pass user object to callback
        done(null, users);
      } catch (error) {
        done(error);
      }
    }
  )
);

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    // Find user by ID
    const user = await auth.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;

// import passport from "passport";
// import passportJwt from "passport-jwt";
// // import ExtractJWT from  ("passport-jwt").ExtractJwt;
// import auth from "../model/authModel.js";

// const JWTStrategy = passportJwt.Strategy;
// const ExtractJWT = passportJwt.ExtractJwt;

// export default passport.use(
//   "jwt",
//   new JWTStrategy(
//     {
//       jwtFromRequest: ExtractJWT.fromBodyField(),
//       secretOrKey: process.env.JWT_SECRET,
//     },
//     async (payload, done) => {
//       try {
//         // Check if the user associated with token still exists
//         const claimUser = await auth.findById(payload.user._id);
//         if (!claimUser)
//           return done(
//             new Error("User associated with token no longer exists.")
//           );
//         // Check if the password has been changed after token was issued
//         const passwordModified = claimUser.passwordModified(payload.iat);
//         if (passwordModified)
//           return done(
//             new Error(
//               "Invalid token! User changed password after this token was issued. Signin again to get a new token."
//             )
//           );
//         // Grant access!
//         done(null, payload.user);
//       } catch (error) {
//         done(error);
//       }
//     }
//   )
// );

// // export default passport;
