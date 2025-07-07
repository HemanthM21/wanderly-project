const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.categoryName = async (req, res) => {
    const category = req.params.categoryName;
    let listings;
    if (category) {
        listings = await Listing.find({ category });
    } else {
        listings = await Listing.find({});
    }
    res.render("listings/index", { allListings: listings, location: '' });
};

module.exports.searchListings = async (req, res) => {
    const { location } = req.query;

    let listings;
    if (location && location.trim() !== "") {
        // case-insensitive search by location (adjust field name as per your schema!)
        listings = await Listing.find({ location: { $regex: location, $options: 'i' } });
    } else {
        listings = await Listing.find({});
    }

    res.render("listings/index", { allListings: listings, location });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.createNewForm = async (req, res, next) => {
    let theResponse = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
    })
    .send()

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};

    newListing.geometry = theResponse.body.features[0].geometry;
    
    let listingSaved = await newListing.save();
    console.log(listingSaved);
    req.flash("success", "New listings was created");
    res.redirect("/listings");
}

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author"}}).populate("owner");
    if(!listing) {
        req.flash("error", "Listing your requested for does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing your requested for does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
    }

    req.flash("success", "Your listing is updated.");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
}