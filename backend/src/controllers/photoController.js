const Photo = require('../models/Photo');
const { cloud } = require("../multer/multer")
const fs = require('fs');

/**
 * 
 * @description upload a photo to the gallery
 * @route POST /photogallery/upload
 * @access Private
 * @param {import("express").Request} req 
 * @param {import("express").Response} res  
 */
const uploadPhoto = async (req, res) => {
    try {
        imageUrl=req.body.imageUrl
        // Save image URL to MongoDB
        const newPhoto = new Photo({
            imageUrl: imageUrl,
            tags: req.body.tags ? req.body.tags.split(",") : []
        });

        await newPhoto.save();

        res.status(201).json({ message: "Photo uploaded successfully", photo: newPhoto });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * 
 * @description get all photos from the gallery
 * @route GET /photogallery/all
 * @access Private
 * @param {import("express").Request} req 
 * @param {import("express").Response} res  
 */
const getAllPhotos = async (req, res) => {
    try {
        const photos = await Photo.find().sort({ createdAt: -1 }); // Get all photos, newest first
        res.status(200).json(photos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


/**
 * 
 * @description delete a photo from the gallery
 * @route DELETE /photogallery/delete/:id
 * @access Private
 * @param {import("express").Request} req 
 * @param {import("express").Response} res  
 */
const deletePhoto = async (req, res) => {
    try {
        const photoId = req.params.id;

        await Photo.findByIdAndDelete(photoId);

        res.status(200).json({ message: "Photo deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports = { uploadPhoto, getAllPhotos ,deletePhoto};