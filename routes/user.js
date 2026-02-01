const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const asyncWrap = require("../utils/asyncWrap.js");
const passport = require('passport');
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");


router.route("/signup")
  .get((req, res) => {
    res.render("listings/signup.ejs");
  })
  .post(asyncWrap(userController.signUp));

router.route("/login")
  .get(userController.renderlogIn)
  .post(
    saveRedirectUrl,
    passport.authenticate(
      "local", {
      failureRedirect: "/login",
      failureFlash: true,
    }
    ), userController.logIn);

router.get("/logout", userController.logOut);


module.exports = router;