const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'users'
    },
    fullName:{
        type:String,
        required:true
    },
    userEmail:{
        type:String,
        required:true
    },
    
    commentBody:{
        type:String,
        required:true
    },
    postId:{
        type:Schema.Types.ObjectId,
        ref:'posts'
    },
    approve:{
        type:Boolean,
        default:false
    },
    commentDate:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model('comments', CommentSchema);