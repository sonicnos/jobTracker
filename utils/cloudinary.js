const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: "dytadijdh",
    api_key: "858194369296412",
    api_secret: "ytsUWr-m5RjX3zFZhAs7qa9cAVg"
});

exports.uploads = (file, folder) => {
    return cloudinary.uploader.upload(file, {
        resource_type: "auto",
        folder: folder
    })
    .then(result => {
        return {
            url: result.url,
            id: result.public_id
        };
    })
    .catch(error => {
        console.error('Upload error:', error);
        throw error;
    });
 }
 

// module.exports = cloudinary;