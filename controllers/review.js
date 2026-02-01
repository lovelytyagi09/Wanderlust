const Review = require("../models/review.js");
const Listing = require("../models/listing");

module.exports.postReview = async (req, res) => {
    let listings = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listings.reviews.push(newReview);
    console.log(newReview);
    await newReview.save();
    let result = await listings.save();
    console.log(result);
     req.flash("success" , "Review saved successfully!");
    res.redirect(`/listings/${listings._id}`);

};
module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    let result = await Review.findByIdAndDelete(reviewId);
    console.log(result);
     req.flash("success" , "Review deleted successfully!");
    res.redirect(`/listings/${id}`);
};