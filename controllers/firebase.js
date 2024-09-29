const admin = require('firebase-admin');
const serviceAccount = require('../config/backend-image-storage-firebase-adminsdk-cfget-387b362a6a.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'backend-image-storage.appspot.com',
});

const bucket = admin.storage().bucket();

// Function to upload an image
const uploadImage = (filePath, destination) => {
    return bucket.upload(filePath, {
        destination,
    });
};

module.exports = { uploadImage };
