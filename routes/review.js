const express=require("express");
const router = express.Router({ mergeParams: true }); 
// { mergeParams: true } allows this router to access 
// parameters from parent routes. This is useful for 
// nested routes where the child router needs to use 
// parameters (like IDs) defined in the parent route. 
// For example, if the parent route has an ID parameter, 
// it can be accessed in the child routes as req.params.id.

const wrapasync = require("../utils/WrapAsnync.js");
 
const {validateReview, isLoggedIn,isReviewAuthor}=require("../middleware.js")
const {createReview,destroyReview}=require("../controllers/review.js")




// Review Route - POST Route
router.post("/",isLoggedIn,validateReview, wrapasync(createReview));

//Delete route- 
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapasync(destroyReview));


module.exports=router;