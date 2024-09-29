const admin = require('firebase-admin');
const path = require('path');

// Load Firebase credentials from the config file
const serviceAccount = require('../config/backend-image-storage-firebase-adminsdk-cfget-387b362a6a.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "backend-image-storage.appspot.com"
});

const bucket = admin.storage().bucket();

// Function to upload image to Firebase Storage
const uploadImage = async (filePath) => {
  const fileName = path.basename(filePath);
  const destination = `images/${fileName}`;
  
  await bucket.upload(filePath, {
    destination,
    public: true,
    metadata: {
      cacheControl: 'public, max-age=31536000',
    },
  });

  // Construct and return the public URL of the uploaded file
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
  return publicUrl;
};

module.exports = {
  uploadImage
};
