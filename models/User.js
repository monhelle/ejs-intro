const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    navn: String,
    email: String,
    passord: String,
})

const User = mongoose.model("User", userSchema);

module.exports = User;