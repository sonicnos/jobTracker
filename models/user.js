const mongoose = require("mongoose");
const Offer = require("../models/offer");
const { isEmail } = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [isEmail, "Invalid email format"],
  },
  github: { type: String },
  profilePicture: {
    public_id: { type: String },
    url: { type: String },
  },
  CV: {
    public_id: { type: String },
    url: { type: String },
  },
  password: { type: String, required: true, minlength: 6 },
  offers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offer",
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified('password')) {
    // If the password field is not modified, move to the next middleware
    return next();
}
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  console.log(this.password);
  next();
});




//Static method to login user

userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    console.log("user ok");
    const auth = await bcrypt.compare(password, user.password);
    console.log("auth : ",auth);
    if (auth) {
      return user;
    }
    throw Error("Incorrect password");
  }
  throw Error("Incorrect email");
};

const User = mongoose.model("User", userSchema);

module.exports = User;
