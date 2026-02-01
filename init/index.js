const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const MONGO_URL = ('mongodb://127.0.0.1:27017/Wanderlust');
async function main() {
    await mongoose.connect(MONGO_URL);
}
async function main() {
    await mongoose.connect(MONGO_URL);

}

const initDB = async () => {
    await Listing.deleteMany({});
    const existingUser = await User.findOne({});
    if (!existingUser) {
        console.log("ERROR: No users found in database. Create a user first!");
        return;
    }
    initData.data = initData.data.map((obj) => ({ ...obj, owner: existingUser._id }));
    await Listing.insertMany(initData.data); // This inserts your updated array.
    console.log("Data was re-initialized with owner:", existingUser.username);
};
main().then((res) => {
    console.log("Connected to DB");
    initDB(); // <--- Call it HERE, only after connection is successful
})
    .catch(err => console.log(err));
initDB().then((res) => {
    console.log("Connected to DB");
    initDB(); // <--- Call it HERE, only after connection is successful
})
    .catch(err => console.log(err));