// load the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define the schema for user model
var userSchema = mongoose.Schema({
    created         : {type: Date, default: Date.now},
    modified        : {type: Date, default: Date.now},
    email           : {type: String, index: true, sparse: true},
    facebook        : {
        id          : {type: String, index: true},
        token       : String,
        name        : String,
        picture     : String
    },
    google          : {
        id          : {type: String, index: true},
        token       : String,
        picture     : String,
        name        : String
    },
    picture         : String,
    role            : {type : String, default : "user"}, //user, trusted user, moderator, admin
    provider        : String,   //current login provider
    description     : String,
    loginCount      : {type : Number, default : 1}
});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
