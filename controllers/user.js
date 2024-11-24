const User=require("../models/user");

module.exports.randerSignupForm=(req,res)=>{
    res.render("users/sighnup.ejs");
}

module.exports.signup=async (req, res) => {
    try {
        const { username, password, email } = req.body;
        
        // Check if the user already exists (optional)
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash("error", "User already exists with this email.");
            return res.redirect("/signup");
        }
        
        // Create a new user instance
        let newUser = new User({ username, email });
        
        const registerUser = await User.register(newUser, password);
        console.log("User registered:", registerUser);
        console.log(registerUser);
        req.login(registerUser,(err)=>{
            if(err){
                return next(err);
            }
             
        req.flash("success", "Welcome to WanderLust!");
        res.redirect("/listings");
        })
       
    } catch (err) {
        console.error("Error during registration:", err);
        req.flash("error", "Something went wrong. Please try again.");
        res.redirect("/signup");
    }
}

module.exports.randerLoginForm=async (req, res) => {
    res.render("users/login.ejs") }

module.exports.login=async (req, res) => {
        try {
            req.flash("success", "Welcome back to Wanderlust!");
            let redirectUrl=res.locals.redirectUrl || "/listings";
            res.redirect(redirectUrl);
         } catch (error) {
            console.error("Error during login:", error);
            req.flash("error", "Invalid login details");
            res.redirect("/login");
        }
    }

module.exports.logout=(req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err); 
        }
        req.flash("success", "You are successfully logged out");
        res.redirect("/listings");
    });
}