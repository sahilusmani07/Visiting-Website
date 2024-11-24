const express=require("express");
const router = express.Router();
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware");
const wrapasync = require("../utils/WrapAsnync.js");

const{signup, logout,randerSignupForm,login,randerLoginForm }=require("../controllers/user")


router
.route("/signup")
.get(randerSignupForm)
.post(wrapasync(signup) );


router
.route("/login")
.get(  saveRedirectUrl, randerLoginForm )
.post( saveRedirectUrl,
    passport.authenticate('local', { 
        failureRedirect: '/login', 
        failureFlash: true 
    }),
    login
);

//Get Logout
router.get("/logout", logout);



module.exports=router;