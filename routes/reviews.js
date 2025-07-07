const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utilities/wrapAsync.js");
const { isLoggedIn, validateReview } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");


//review 
//post route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.postReview))

//delete route
// router.delete("/:reviewId", wrapAsync(async (req, res) => {
//     const { id, reviewId } = req.params;

//     await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//     await Review.findByIdAndDelete(reviewId);

//     console.log("Review was deleted");
//     res.redirect(`/listings/${id}`);
// }));


module.exports = router;