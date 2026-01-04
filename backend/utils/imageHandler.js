const cloudinary = require('cloudinary').v2;
const axios = require('axios');

const FALLBACK_IMAGE =
  "https://upload.wikimedia.org/wikipedia/commons/a/a9/Example.jpg";

const uploadToCloudinary = async (imageUrl, folder) => {
  try {
    const finalUrl = imageUrl || FALLBACK_IMAGE;

    const response = await axios.get(finalUrl, {
      responseType: 'arraybuffer',
      timeout: 20000,
      validateStatus: status => status >= 200 && status < 300,
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "image/*"
      }
    });

    const base64Image = Buffer.from(response.data).toString('base64');
    const dataUri = `data:image/jpeg;base64,${base64Image}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      resource_type: "image"
    });

    return result.secure_url;

  } catch (error) {
    console.warn("⚠️ Image failed, using fallback");

    // 🔁 FINAL GUARANTEED UPLOAD
    const fallbackUpload = await cloudinary.uploader.upload(FALLBACK_IMAGE, {
      folder,
      resource_type: "image"
    });

    return fallbackUpload.secure_url;
  }
};

module.exports = uploadToCloudinary;


