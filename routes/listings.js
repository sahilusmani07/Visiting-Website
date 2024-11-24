const express=require("express");
const router=express.Router();
const wrapasync = require("../utils/WrapAsnync.js");
const {isLoggedIn,validateListing, isOwner}=require("../middleware.js");
const { index,renderNewForm,showListing,createListing,renderEditForm,updateListing,destroyListing } = require("../controllers/listings.js");
const multer  = require('multer')
const{storage}=require('../cloudConfig.js')
const upload = multer({ storage })



// Listing Routes
router
    .route("/")
    // Index route - GET all listings
    .get(wrapasync(index))
    // Create new listing - POST request
    .post(
        isLoggedIn, 
        upload.single("listing[image]"), 
        validateListing, 
        wrapasync(createListing)
    );

// Create New Listing Form Route - GET request
router.get("/new", isLoggedIn, renderNewForm);

router
    .route("/:id")
    // Show specific listing - GET request
    .get(wrapasync(showListing))
    // Update specific listing - PUT request
    .put(
        isLoggedIn, 
        isOwner, 
        upload.single("listing[image]"), 
        validateListing, 
        wrapasync(updateListing)
    )
    // Delete specific listing - DELETE request
    .delete(isLoggedIn, isOwner, wrapasync(destroyListing));

// Edit Listing Form Route - GET request
router.get("/:id/edit", isLoggedIn, isOwner, wrapasync(renderEditForm));

module.exports = router;
