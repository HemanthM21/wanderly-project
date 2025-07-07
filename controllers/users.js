const User = require("../models/user.js");

module.exports.renderSignupForm = (req ,res) =>  {
    res.render("users/signup.ejs");
}

module.exports.signUp = async(req, res) => {
    try {
        let {email, username, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderly!");
            res.redirect("/listings");            
        })
    } catch(err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.logIn = async(req, res) => {
    req.flash("success", "Welcome back to Wanderly!");
    const theSavedUrl = res.locals.redirectUrl || "/listings";
    res.redirect(theSavedUrl);
}

module.exports.logOut = (req, res, next) => {
    req.logOut((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "you are logged out successfully!");
        res.redirect("/listings");
    })
}