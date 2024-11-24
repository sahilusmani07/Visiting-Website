// Define a custom error class called 'ExpressError' that extends the built-in 'Error' class.
class ExpressError extends Error {
    
    // The constructor function is called when a new instance of 'ExpressError' is created.
    constructor(statusCode, message) {
        // Call the parent class 'Error' constructor. This initializes the base error properties like the 'message'.
        super();

        // Assign the 'statusCode' property to the error instance. This will represent the HTTP status code (e.g., 404, 500).
        this.statusCode = statusCode;

        // Assign the 'message' property to the error instance. This will be the error message (e.g., "Page Not Found").
        this.message = message;
    }
}

// Export the 'ExpressError' class so it can be imported and used in other files.
module.exports = ExpressError;
