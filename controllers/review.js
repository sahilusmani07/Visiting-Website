const Review = require("../models/reviews.js");
const listing = require("../models/listing.js");

module.exports.createReview=async (req, res) => {
    const foundListing = await listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
      newReview.author=req.user._id; 
      console.log(newReview);
      
    foundListing.reviews.push(newReview); 
    await newReview.save();
    await foundListing.save();
    req.flash("success", "New Review Created");

    res.redirect(`/listings/${req.params.id}`);
}

module.exports.destroyReview=async (req, res) => {
    const { id, reviewId } = req.params;

    // Remove the review from the listing
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the review itself
    await Review.findByIdAndDelete(reviewId); // Pass reviewId directly
    req.flash("success", "Review Deleted");

    // Redirect back to the listing page
    res.redirect(`/listings/${id}`);
}