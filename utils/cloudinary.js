const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const multer= require('multer');
const {CloudinaryStorage} =require('multer-storage-cloudinary');

dotenv.config()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET})

    const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder:"TechGen",
            format:async()=>"png",
            public_id:(req,file)=> file.filename
        },
    })
    const imageParser= multer({storage:storage})
    module.exports =imageParser