const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const users = mongoose.Schema({
    name:{
        type:String
    },
    username:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    date:{
        type:Date,
        defaule:Date.now
    }
})

const Users = module.exports =  mongoose.model('Users',users);

//register
module.exports.checkUsername = function(body,callback){
    let username = {username:body.username};
    Users.find(username)
        .then(callback)
}

module.exports.passwordHash = function(user,callback){
    bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(user.password,salt,function(err,hash){
            user.password = hash;
            callback(null,user)
            
        })
    })
}

//login

module.exports.comparePassword = function(pass,hash,callback){
    bcrypt.compare(pass,hash,callback)
}







