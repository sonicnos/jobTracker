const mongoose = require("mongoose");
const User = require("../models/user");
const Offer = require("../models/offer");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary");

const fs = require("fs");

//handle errors

const handleErrors = (err) => {
  console.log("in handle errors");
  console.log(err.message, err.code);
  let errors = {
    firstName: "",
    lastName: "",
    email: "",
    github: "",
    profilePicture: "",
    CV: "",
    password: "",
  };

  //incorrect email
  if (err.message === "Incorrect email") {
    errors.email = "that email is not registered";
  }
  //incorrect password
  if (err.message === "Incorrect password") {
    errors.password = "that password is incorrect";
  }

  // duplicate error code
  if (err.code === 11000) {
    errors.email = "This email is already registered";
    return errors;
  }

  //
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message.replace("Path", "");
    });
  }

  return errors;
};

// create tokens

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
  return jwt.sign({ id }, "crazy secret secret", {
    expiresIn: maxAge,
  });
};

module.exports.register_get = (req, res) => {
  //RENDER LA PAGE REGISTER
  res.render("register.ejs");
};
module.exports.register_post = async (req, res) => {
  //AJOUTER UN USER DANS LA DB

  const {
    firstName,
    lastName,
    email,
    github,
    password,
    offers,
  } = req.body;
  const uploader = async (path) => await cloudinary.uploads(path, "Images");

  const profilePictureurls = [];
  const CVurls = [];
  const files = req.files;
  console.log('files : ', files);
  if (files.profilePicture) {
  for (const file of files.profilePicture) {
    const { path } = file;
    console.log('path :',path);
    const newPath = await uploader(path);
    profilePictureurls.push(newPath);
    fs.unlinkSync(path);
  }
  }
  if (files.cv) {
    for (const file of files.cv) {
        const { path } = file;
        const newPath = await uploader(path);
        CVurls.push(newPath);
        console.log("path :", path);
        fs.unlinkSync(path);
    }
  }
    console.log('cvurls :',CVurls);
    console.log('profilePictureurls :',profilePictureurls);

  
  try {
    const user = await User.create({
      firstName,
      lastName,
      email,
      github,
      profilePicture: profilePictureurls.length > 0 ? {
        public_id: profilePictureurls[0].id,
        url: profilePictureurls[0].url,
       } : "",
       CV : CVurls.length > 0 ? {
        public_id: CVurls[0].id,
        url: CVurls[0].url,
       } : "",
      password,
      offers,
    });
    console.log("user created");
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge,
    });
    res.status(201).json({ user: user._id });
  } catch (err) {
    console.log("error when attempteing to create the user in the database");
    const errors = handleErrors(err);
    console.log("errors: ", errors);
    res.status(400).json({ errors });
  }
};

