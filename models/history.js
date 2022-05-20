const mongoose = require("mongoose");

module.exports = mongoose.model('documatic-game-history', new mongoose.Schema({
    user: String,
    sessions: {
        type: Array,
        default: []
    },
}))