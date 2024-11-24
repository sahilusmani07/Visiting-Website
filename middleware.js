const listing=require("./models/listing.js");
const Review=require("./models/reviews.js");

const{listingSchema,reviewSchema}=require("./schema.js");                   
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn=((req,res,next)=>{
         
    if (!req.isAuthenticated()) {
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create account");
        return res.redirect("/login")
    }
next()
})


module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let { id } = req.params;
    let Listing=await listing.findById(id);
    if(!Listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","you don't have permission to edit");
      return  res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let { reviewId ,id} = req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not author of this rewiew");
      return  res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    // Validate the request body using the listingSchema
    const { error } = listingSchema.validate(req.body);

    // Check if there's an error from validation
    if (error) {
        // Create a detailed error message from all the validation errors
        const erMsg = error.details.map((el) => el.message).join(", ");

        // Throw a custom error with status code 400 (Bad Request) and the detailed error message
        return next(new ExpressError(400, erMsg));
    }

    // Proceed to the next middleware or route handler if validation is successful
    next();
};



//Validation for Review (Middleware) -------------for sever validation
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body); // Destructure error from validation result
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", "); // Create a detailed error message
        throw new ExpressError(400, errMsg); // Use the detailed error message
    }
    next(); // Proceed to the next middleware if no error
};
