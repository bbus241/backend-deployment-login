const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    Username:{
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    pic:{
        type: String,
        default: ''
    },
    verify:{
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', userSchema);