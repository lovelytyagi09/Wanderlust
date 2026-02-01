const Listing = require("../models/listing");
const { listingSchema } = require("../schema");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.API_KEY_MAP_TILER;

module.exports.index = async (req, res) => {
    const AllList = await Listing.find({});
    res.render("listings/index.ejs", { AllList });

};

module.exports.rendernewPage = async (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showPage = async (req, res) => {
    let { id } = req.params;
    const listingAll = await Listing.findById(id).populate({
        path: "reviews", populate: {
            path: "author",
        }
    }).populate("owner")
    if (!listingAll) {
        req.flash("error", "Listing you requested does not Exists!");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listingAll });
    console.log(listingAll);

};

module.exports.createPage = async (req, res, next) => {
    // in an async function, or as a 'thenable':
    const Coordinates = await maptilerClient.geocoding.forward(req.body.listings.location, { limit: 1 });
    console.log(Coordinates.features[0].geometry);
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(req.url, "...", req.filename);

    let result = listingSchema.validate(req.body);

    const newList = new Listing(req.body.listings);
    newList.owner = req.user._id;
    newList.image = { url, filename };
    newList.geometry = Coordinates.features[0].geometry;
    let saveList = await newList.save();
    console.log(saveList);
    req.flash("success", "Listing saved successfully!");
    res.redirect("/listings");
}

module.exports.editPage = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "This listing does not exist !")
        req.redirect("/listings");
    }
    let orginalImageUrl = listing.image.url;
    let OriginalImage = orginalImageUrl.replace("/upload", "/upload/w_250,h_200,c_fill,e_blur:200");
    res.render("listings/edit.ejs", { id, listing, OriginalImage });
};
module.exports.updatePage = async (req, res) => {
    if (!req.body.listings) {
        throw new ExpressError("400", "Please enter a valid request!");
    }
    let { id } = req.params;
    let updatedList = await Listing.findByIdAndUpdate(id, { ...req.body.listings });
    if (typeof req.file !== undefined) {
        let url = req.file.path;
        let filename = req.file.filename;
        updatedList.image = { url, filename };
        let save = await updatedList.save();
        console.log(save);
    }
    req.flash("success", "Edited successfully!");
    res.redirect("/listings");

};
module.exports.destroyPage = async (req, res) => {
    let { id } = req.params;
    console.log("Delete request received for ID:", id);
    const deleteList = await Listing.findByIdAndDelete(id);
    if (!deleteList) {
        req.flash("error", "Listing does not exist!"); // Handle the error
    } else {
        req.flash("success", "Listing deleted successfully!");
    }
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
};
