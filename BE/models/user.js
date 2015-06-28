// load the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    created         : {type: Date, default: Date.now},
    facebook        : {
        id          : {type: String, index: true},
        token       : String,
        email       : {type: String, index: true, sparse: true},
        name        : String,
        picture     : String
    },
    google          : {
        id          : {type: String, index: true},
        token       : String,
        email       : {type: String, index: true, sparse: true},
        picture     : String,
        name        : String
    },
    boredomLevel    : {type : Number, default : 0},
    picture         : String,
    role            : {type : String, default : "user"}, //user, trusted user, moderator, admin
    provider        : String,
    description     : String,
    loginCount      : {type : Number, default : 0}
});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
