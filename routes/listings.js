const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/wrapAsync.js");
const { isLoggedIn, validateListing, isOwner, attachImageData } = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//Index Route and create route
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, upload.single('listing[imageFile]'), attachImageData, validateListing, wrapAsync(listingController.createNewForm))

// search location
router.get("/search", wrapAsync(listingController.searchListings));

// NEW: route to handle category filter
router.get("/category/:categoryName", wrapAsync(listingController.categoryName));

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm)

//show route and update route and delete route
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isOwner, upload.single('listing[imageFile]'), attachImageData, validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing))

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing))

module.exports = router;