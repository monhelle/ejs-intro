const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    email: String,
    passord: String,
})

const User = mongoose.model("User", userSchema);

module.exports = User;