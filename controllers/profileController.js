const mongoose = require("mongoose");
const User = require("../models/user");
const Offer = require("../models/offer");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");

module.exports.profile_get = (req, res) => {
  //AFFICHE LA PAGE PROFIL DU USER, REDIRECT VERS LOGIN SI PAS DE TOKEN
  res.render("profile.ejs");
};

module.exports.profile_get_update = (req, res) => {
  //AFFICHE LA PAGE UPDATE DU USER, REDIRECT VERS LOGIN SI PAS DE TOKEN
  res.render("update_user.ejs");
};
module.exports.profile_update = async (req, res) => {
  // UPDATE LES INFORMATION DU USER DANS LA DB
  const { firstName, lastName, email, github,  password } =
    req.body;

  const token = req.cookies.jwt;
  if (token) {
    console.log("got token");
    jwt.verify(token, "crazy secret secret", async (err, decodedToken) => {
      if (err) {    
          
        res.redirect("/");
      } else {
        const uploader = async (path) =>
        await cloudinary.uploads(path, "Images");
        const profilePictureurls = [];
        const CVurls = [];
        const files = req.files;
        console.log("files : ", files);
        if (files.profilePicture) {
            for (const file of files.profilePicture) {
                const { path } = file;
                console.log("path :", path);
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
       
        console.log("cvurls :", CVurls);
        console.log("profilePictureurls :", profilePictureurls);
        try {
          const user = await User.findById(decodedToken.id);
          if (user) {
            if (firstName) {
              user.firstName = firstName;
            }
            if (lastName) {
              user.lastName = lastName;
            }
            if (email) {
              user.email = email;
            }
            if (github) {
              user.github = github;
            }

            if (profilePictureurls.length > 0) {
              user.profilePicture = {
                public_id: profilePictureurls[0].id,
                url: profilePictureurls[0].url,
              };
              
            }
            if (CVurls.length > 0) {
              user.CV = {
                public_id: CVurls[0].id,
                url: CVurls[0].url,
              };
            }
            if (password) {
              user.password = password;
            }
            await user.save();
          }

          res.status(200).json({ user: decodedToken.id });
        } catch (error) {
          console.log(error);
        }
      }
    });
  } else {
    console.log("no token");
    
    res.redirect("/login");
  }
};

module.exports.profile_delete = async (req, res) => {
  //AJOUTER UN MESSAGE DE WARNING
  //SUPPRIME LE USER DE LA DB

  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "crazy secret secret", async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/");
      } else {
        await User.findOneAndDelete({ _id: decodedToken.id });
        res.send(`User ${decodedToken.id} correctly deleted`);
      }
    });
  } else {
    res.redirect("/login");
  }
};
