const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });



const asyncWrap = require("../utils/asyncWrap.js");
const { isLoggedIn, isOwner, validateListings } = require("../middleware.js");



router.route("/")
    .get(asyncWrap(listingController.index))
    .post(isLoggedIn,
        upload.single('listings[image][url]'),
        asyncWrap(listingController.createPage));

//New listings
router.get("/new", isLoggedIn, validateListings, asyncWrap(listingController.rendernewPage));


router.route("/:id")
    .get(asyncWrap(listingController.showPage))
    .put(
        isLoggedIn,
        isOwner,   upload.single('listings[image][url]'),asyncWrap(listingController.updatePage))
    .delete(
        isLoggedIn, isOwner, asyncWrap(listingController.destroyPage))

//Edit route
router.get("/:id/edit",
    isLoggedIn, isOwner, asyncWrap(listingController.editPage));

module.exports = router; 