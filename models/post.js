const mongoose=require('mongoose')
const Schema=mongoose.Schema

const commentSchema = new mongoose.Schema({
    content: String,
    author: { 
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true })

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    category:['sport', 'politics', 'economic', 'tecnical', 'Art'],
    image: {
        url: { type: String, required: true },
        cloudinary_id: { type: String, required: true}
    },
    publisher: { 
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [commentSchema]
}, { timestamps: true })

module.exports = mongoose.model('Post', postSchema)