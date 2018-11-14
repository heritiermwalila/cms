const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({

    categoryId:{
        type:Schema.Types.ObjectId,
        ref:'categories'

    },
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
    },
    CommentsIds:[{
        
        type:Schema.Types.ObjectId,
        ref:'comments'
        
    }],
    createdDate:{
        type:Date,
        default:Date.now(),
    }
});

module.exports = mongoose.model('posts', PostSchema);