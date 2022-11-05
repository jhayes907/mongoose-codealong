const mongoose = require('mongoose');
const { commentSchema } = require('./Comment');

const postSchema = new mongoose.Schema({
    title: String,
    body: String,
    // REF COMMENTS
    Comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

module.exports = mongoose.model('post', postSchema);