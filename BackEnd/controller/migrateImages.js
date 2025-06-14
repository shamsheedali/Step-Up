// restoreImages.js
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import Product from "../modal/productModal.js";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: "dqspy6wxk",
  api_key: "434783837865482",
  api_secret: "E34jaeaSDilVi4s7WLL98bAwvqU",
});

mongoose.connect("mongodb+srv://shamsheedali:1UDYZs8Fx3wNwPFq@cluster0.oq0o4.mongodb.net/StepUp?retryWrites=true&w=majority&appName=Cluster0", {});

const restoreImages = async () => {
  try {
    // Fetch images from Cloudinary
    const { resources } = await cloudinary.api.resources({
      resource_type: "image",
      type: "upload", // Required parameter
      prefix: "step-up/",
      max_results: 500,
    });

    const images = resources.map((res) => ({
      url: res.secure_url,
      public_id: res.public_id.split("/").pop(), // e.g., profile-1744386655254-image
    }));

    console.log(`Found ${images.length} images in Cloudinary`);

    // Update products
    const products = await Product.find();
    if (images.length < products.length * 3) {
      console.warn("Not enough images for all products. Manual mapping may be needed.");
    }

    // Assign 3-4 images per product (adjust as needed)
    for (let i = 0; i < products.length; i++) {
      const productImages = images.slice(i * 4, i * 4 + 4); // Adjust to 3 or 4
      if (productImages.length === 0) {
        console.warn(`No images available for product ${products[i]._id}`);
        continue;
      }
      await Product.updateOne(
        { _id: products[i]._id },
        { $set: { images: productImages } }
      );
      console.log(`Restored ${productImages.length} images for product ${products[i]._id}`);
    }

    console.log("Image restoration completed");
    mongoose.disconnect();
  } catch (error) {
    console.error("Restoration failed:", error);
    mongoose.disconnect();
  }
};

restoreImages();