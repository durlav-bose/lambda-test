const express = require("express");
const router = express.Router();
const { uploadImages } = require("../middleware/imageUpload");
const ImageController = require("../controllers/image.controller");
const checkAuthorization = require('../middleware/auth.check.middleware');

router.post("/images", checkAuthorization, uploadImages, ImageController.upload);



module.exports = router;