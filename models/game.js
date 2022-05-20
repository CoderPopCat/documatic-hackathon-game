const mongoose = require("mongoose");

module.exports = mongoose.model('documatic-game', new mongoose.Schema({
    country: Object,
    user: String,
    guesses: {
        type: Number,
        default: 0
    }
}))