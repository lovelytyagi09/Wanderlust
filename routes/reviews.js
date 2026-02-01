const express = require("express");
const router = express.Router({mergeParams : true});
const asyncWrap = require("../utils/asyncWrap.js");
const Review = require("../models/review.js");
const { validateReview , isLoggedIn  , isReviewAuthor } = require("../middleware.js");

const ReviewController = require("../controllers/review.js");

//Review route 
router.post("/", validateReview, isLoggedIn,  asyncWrap(ReviewController.postReview));
//Delete Review 
router.delete("/:reviewId", isLoggedIn , isReviewAuthor, (ReviewController.destroyReview));

module.exports = router;