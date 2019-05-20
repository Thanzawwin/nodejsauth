const express = require('express');

const Route = express.Router();

//model
const Posts = require('../models/posts');
const Users = require('../models/users');

//init 
Route.get('/',(req,res)=>{
    Posts.find({})
        .then(posts =>{
            
            res.render('index',{posts});
        })
        .catch(err => console.log('post fetch error'));
        
})


//post view
Route.get('/post/view/:id',(req,res)=>{
    Posts.findById(req.params.id)
        .then(post => {
            let date = getDate(post.date)
            //search user
            Users.findById(post.user)
                .then(myUser => {
                    
                    res.render('posts/view',{post,date,myUser})
                })
            
        })
        .catch(err => console.log('post view error'));
})

//post add
Route.get('/post/add',isAuthen,(req,res)=>{
    
    res.render('posts/add',);
})

//post add submit
Route.post('/post/add',(req,res)=>{
    let post = new Posts({
        title:req.body.title,
        author:req.body.author,
        user:req.user._id,
        body:req.body.body
    })
    
    Posts.postTitleCompare(post,function(err,checkPost){
        if(err){
            req.flash('error_msg','post title is already');
            res.redirect('/post/add');            
        }else{
            
            checkPost.save()
                .then((post)=> {
                    // console.log('post added');
                    req.flash('success_msg','post added');
                    res.redirect('/');
                })
                .catch(err => console.log('post added fail'));
        }
    })
})


//post edit
Route.get('/post/edit/:id',isAuthen,(req,res)=>{
    Posts.findById(req.params.id)
        .then(post => {
            res.render('posts/edit',{post})
        })
        .catch(err => console.log('post view error'));
})

//post update
Route.post('/post/update',(req,res)=>{
    let id = {_id:req.body.id};
    let body = {
        title:req.body.title,
        author:req.body.author,
        body:req.body.body
    }
    Posts.updateOne(id,body)
        .then(post => {
            // console.log('post updated');
            req.flash('success_msg','Post Update Success');
            res.redirect('/');
        })
        .catch(err => {
            console.log('post update error')
            req.flash('error_msg','Post Update error');
            
        });
    
})

//post delete
Route.delete('/post/delete/:id',(req,res)=>{
    let id = {_id:req.params.id};

    Posts.remove(id)
        .then(post =>{
            // console.log('post deleted');
            req.flash('success_msg','Post Delete Success');            
            res.send('success');
        })
        .catch(err => console.log('post deleted error'));
})

Route.get('/about',(req,res)=>{
    res.render('about');
})


function getDate (dateNow){
    let date = `${dateNow.getDate()}/${dateNow.getMonth()}/${dateNow.getFullYear()}/Time:${dateNow.getHours()}:${dateNow.getMinutes()}:${dateNow.getSeconds()}`
    return date;
}

function isAuthen (req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash('error_msg','You Are Not Login!');
        res.redirect('/user/login');
    }
}
module.exports = Route;