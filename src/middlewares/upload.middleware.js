const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const path = require("path");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const name = path.parse(file.originalname).name;
    const safeName = name.replace(/\s+/g, "_").replace(/[^\w\-]/g, "");

    return {
      folder: "ecommerce_items",
      public_id: `${Date.now()}-${safeName}`,
      format: file.mimetype.split("/")[1],
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;