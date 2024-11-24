if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user");
const Listing = require("./models/listing"); // Import the Listing model

const listingsRouter = require("./routes/listings");
const reviewsRouter = require("./routes/review");
const userRouter = require("./routes/user");

const app = express();
const PORT = 8080;

// Database Connection
const dbUrl = process.env.ATLASDB_URL;
mongoose.connect(dbUrl)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => console.error("MongoDB connection error:", err));

// MongoStore for session storage
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600, // Time period in seconds
});

store.on("error", (error) => {
    console.error("MongoStore error:", error);
});

// Session Configuration
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        httpOnly: true,
    },
};

// Middleware Setup
app.use(session(sessionOptions));
app.use(flash());
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.engine('ejs', ejsMate); // Use ejs-mate as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to pass flash messages and current user to all views
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
});

// Routes
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// Search Functionality
async function performSearch(query) {
    try {
        const listings = await Listing.find({
            title: { $regex: query, $options: 'i' } // Case-insensitive search
        });
        return listings;
    } catch (error) {
        console.error('Search error:', error);
        return [];
    }
}

// Search Route
app.get('/search', async (req, res) => {
    const searchQuery = req.query.query?.trim(); // Handle empty or missing query
    if (!searchQuery) {
        return res.render('listings/search', {
            results: [],
            query: '',
            message: 'Please enter a search term.'
        });
    }

    const results = await performSearch(searchQuery);
    res.render('listings/search', { results, query: searchQuery });
});

// 404 Error Route
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("listings/error", { message });
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
