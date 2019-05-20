const mongoose = require('mongoose');

const posts = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    user:{
        type:String
    },
    body:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})

const Posts = module.exports = mongoose.model('Posts',posts);

module.exports.postTitleCompare = function(post,callback){
    Posts.findOne({title:post.title})
        .then(match => {
            if(match == null){
                callback(null,post);
            }else{
                callback(true,null)
            }

        })
        .catch(err => {
            console.log('err')
        })
        
}