const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName:{
        type:String,
        required:true,
        minlength:3
    },
    lastName:{
        type:String,
    },
    emailAddress:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});
module.exports = mongoose.model('users', UserSchema);

