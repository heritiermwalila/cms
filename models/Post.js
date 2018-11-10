const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    postTitle:{
        type:String,
        required:true,
        
    },
    postStatus:{
        type:String,
        required:true,
        default:'draft'
    },
    allowComment:{
        type:Boolean,
        required:true,
        default:true
    },
   
    postContent:{
        type:String,
        required:true

    },
    postImage:{
        type:String
    }
});

module.exports = mongoose.model('posts', PostSchema);