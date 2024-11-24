const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET // Corrected
});

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust_DEV', // The folder where files will be uploaded in Cloudinary
        allowedFormats: ['png', 'jpg', 'jpeg'], 
    },
}); 

// Export the Cloudinary and storage objects for use in other files
module.exports = { cloudinary, storage };
