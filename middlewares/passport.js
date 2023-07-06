const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const auth = require("../model/authModel.js");

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

module.exports = passport;
