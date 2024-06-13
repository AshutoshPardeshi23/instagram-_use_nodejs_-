const mongoose = require('mongoose');
const post = require('./upload_img');


const postSchema = new mongoose.Schema({
    imgeText: {
        type: String
    },
    comect: {
        type: String
    },
    img: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ]

}, { timestamps: true });

module.exports = mongoose.model('post', postSchema);