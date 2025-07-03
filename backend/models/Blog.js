const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Başlık zorunludur'],
    },
    content: {
        type: String,
        required: [true, 'İçerik zorunludur'],
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Yazar bilgisi zorunludur.'],
    },
    likeCount: {
        type: Number,
        default: 0,
    },
    tags: [String],
    imageUrl: {
        type: String,
        default: null,
    }
}, { timestamps: true }); 

module.exports = mongoose.model("Blog", blogSchema);
