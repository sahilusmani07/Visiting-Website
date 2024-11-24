const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review=require("./reviews");
const { type } = require("os");

// Define the listing schema
const listingSchema = new Schema({
    title: {
        type: String,
        required: true,  // Title is required
        trim: true,  // Automatically trims whitespace from the title
    },
    description: {
        type: String,
        trim: true,  // Automatically trims whitespace from the description
    },
    image: {
        url:String,
        filename:String
      },
    price: {
        type: Number,
        min: 0,  // Ensures price cannot be negative
    },
    location: {
        type: String,
        trim: true,  // Automatically trims whitespace from the location
    },
    country: {
        type: String,
        trim: true,  // Automatically trims whitespace from the country
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review" 
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
        required: true,
      },
    });

 

listingSchema.post("findOneAndDelete",async(listing)=>{
if (listing) {
    await review.deleteMany({id:{$in:listing.reviews}});

}
})


// Define the model
const Listing = mongoose.model("Listing", listingSchema);  

// Export the model
module.exports = Listing;
