const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    try {
        const { id } = req.params;
        const listings = await Listing.findById(id)
            .populate({
                path: "reviews",
                populate: { path: "author" },
            })
            .populate("owner");

        if (!listings) {
            req.flash("error", "Listing you requested does not exist.");
            return res.redirect("/listings");
        }

        res.render("listings/show.ejs", { listings });
    } catch (error) {
        console.error(error);
        req.flash("error", "An error occurred. Please try again.");
        res.redirect("/listings");
    }
};

module.exports.createListing = async (req, res, next) => {
    try {
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;

        if (req.file) {
            const url = req.file.path;
            const filename = req.file.filename;
            newListing.image = { url, filename };
        }

        await newListing.save();
        req.flash("success", "New Listing Created");
        res.redirect("/listings");
    } catch (error) {
        console.error(error);
        req.flash("error", "Failed to create a new listing.");
        res.redirect("/listings");
    }
};

module.exports.renderEditForm = async (req, res) => {
    try {
        const { id } = req.params;
        const listings = await Listing.findById(id);

        if (!listings) {
            req.flash("error", "Listing you requested does not exist.");
            return res.redirect("/listings");
        }

        const originalImageUrl = listings.image?.url || "";
        res.render("listings/edit.ejs", { listings, originalImageUrl });
    } catch (error) {
        console.error(error);
        req.flash("error", "Failed to load the edit form.");
        res.redirect("/listings");
    }
};

module.exports.updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

        if (req.file) {
            const url = req.file.path;
            const filename = req.file.filename;
            updatedListing.image = { url, filename };
            await updatedListing.save();
        }

        req.flash("success", "Listing Updated");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error(error);
        req.flash("error", "Failed to update the listing.");
        res.redirect("/listings");
    }
};

module.exports.destroyListing = async (req, res) => {
    try {
        const { id } = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success", "Listing Deleted");
        res.redirect("/listings");
    } catch (error) {
        console.error(error);
        req.flash("error", "Failed to delete the listing.");
        res.redirect("/listings");
    }
};
