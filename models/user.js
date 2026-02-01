
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

// userSchema.plugin(passportLocalMongoose);
// This line checks for that wrapper and unwraps it if necessary.
userSchema.plugin(passportLocalMongoose.default || passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);

