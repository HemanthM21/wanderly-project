const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.postReview = async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    newReview.save();
    listing.save();

    console.log("review was saved");
    res.redirect(`/listings/${listing._id}`);
}