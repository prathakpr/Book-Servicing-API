const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username : String,
    email : String,
    password : String,
    role : { type: String, enum: ['Author', 'Borrower'], required: true }

});

const user = mongoose.model("user", userSchema);
module.exports = user;
