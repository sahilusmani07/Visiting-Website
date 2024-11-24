const mongoose = require("mongoose");
const initdata = require("./data.js");
const listing = require("../models/listing.js");

// MongoDB connection string
const url = 'mongodb://127.0.0.1:27017/wonderlust';

// Function to connect to the database
main()
    .then(() => { 
        console.log("Connected to DB"); 
        initDB();  // Call initDB after successful DB connection
    })
    .catch((err) => { 
        console.log(err); 
    });

// Connect to MongoDB
async function main() {
    await mongoose.connect(url);
}

// Initialize database with listings
const initDB = async () => {
    try {
        // Delete all existing documents in the collection
        await listing.deleteMany({});

        // Add the owner field to each object in initdata.data
        const updatedData = initdata.data.map(obj => ({
            ...obj,
            owner: new mongoose.Types.ObjectId('67324045bea45328beb882c9')  
        }));

        // Insert new data into the collection
        await listing.insertMany(updatedData);

        console.log("Data was initialized successfully");
    } catch (err) {
        console.log("Error initializing data:", err);
    }
};
