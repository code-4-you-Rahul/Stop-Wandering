const express = require("express");
const router = express.Router();
const user = require("../models/user.js");
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userControllers = require("../controllers/user.js");

router.get("/signup",userControllers.renderSignup);

router.post("/signup",WrapAsync(userControllers.signup));

router.get("/login",userControllers.renderLogin);

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",
        {
            failureRedirect:"/login",
            failureFlash:true
        }),
        WrapAsync(userControllers.login));

router.get("/logout",userControllers.logout);
module.exports = router;