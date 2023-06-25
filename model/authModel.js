import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
const authSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please provide your firstname."],
  },
  lastName: {
    type: String,
    required: [true, "Please provide your lastname."],
  },
  email: {
    type: String,
    required: [true, "Please provide your email address."],
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email address."],
  },
  password: {
    type: String,
    required: [
      true,
      "It's a dangerous world online! Please provide a password.",
    ],
    minLength: 6,
    select: false, // doesn't add this field on Read query
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password."],
    minLength: 6,
    select: false,
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Passwords must match.",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  passwordModifiedAt: { type: Date },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  passwordResetToken: { type: String },
  passwordResetTokenExpiryTime: Date,
});

// Pre document hook for hashing password before save
authSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // prevents hashing of unmodified password
  // Hashes the password of the currently processed document
  const hashedPassword = await bcrypt.hash(this.password, 12);
  // Overwrite plain text password with hash
  this.password = hashedPassword;
  // Clear the confirm password field
  this.confirmPassword = undefined;
  next();
});

// document method for checking correct password
authSchema.methods.isCorrectPassword = async function (providedPassword) {
  return await bcrypt.compare(providedPassword, this.password);
};

const auth = mongoose.model("userAuth", authSchema);

export default auth;
