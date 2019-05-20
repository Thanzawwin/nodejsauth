const express = require('express');
const { check, validationResult } = require('express-validator/check');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


const Route = express.Router();

//model
const Users = require('../models/users');

//register
Route.get('/register',(req,res)=>{
    res.render('auth/register',{errors:false,body:false})
})

//register submit
Route.post('/register',[
    check('name').not().isEmpty().withMessage('name is require'),
    check('username').not().isEmpty().withMessage('username is require'),
    check('email').isEmail().withMessage('email is not valid'),
    check('password').isLength({min:6}).custom((value,{req})=>{
        if(value === req.body.confirm){
            return value;
        }else{
            return false;
        }
    }).withMessage('password is require')
],
(req,res)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        res.render('auth/register',{
            errors:errors.array(),
            body:req.body
        })
    }else{
        
        
        Users.checkUsername(req.body,function(username){
           if(username.length == 0){
                //register
                let user = new Users({
                    name:req.body.name,
                    username:req.body.username,
                    email:req.body.email,
                    password:req.body.password
                })
                Users.passwordHash(user,function(err,user){
                    user.save()
                        .then(post => {
                            req.flash('success_msg','Registered You now Login');
                            res.redirect('/user/login');
                        })
                })
                
            
            }else{
                res.render('auth/register',{
                    errors:[{msg:'Username is already!'}],
                    body:req.body
                })
            }
            
        })
        
    }
})


//login
Route.get('/login',(req,res)=>{
    res.render('auth/login');
})

//passport serialize 
passport.serializeUser(function(user,done){
	done(null,user.id)
})
passport.deserializeUser(function(id,done){
	Users.findById(id,done);
})

//authanticate Middelware
passport.use(new LocalStrategy(
    function(username,password,done){
        Users.findOne({username})
            .then(user => {
                if(!user){
                    return done(null,false,{message:'Incorrent Username!'})
                }else{

                    Users.comparePassword(password,user.password,function(err,isMatch){
                        if(isMatch){
                            return done(null,user);
                        }else{
                            return done(null,false,{message: 'Incorrent Password'})
                        }
    
                    })
                }
                
            })
    }
))

//login submit
Route.post('/login',passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/user/login',
    failureFlash: true
}),(req,res)=>{

})

//logout
Route.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/user/login');
})



module.exports = Route;