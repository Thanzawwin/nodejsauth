const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session')
const bodyParser = require('body-parser');
const passport = require('passport');

//init 
const app = express();

//database
const db = require('./config/database').mongoURI;

mongoose.connect(db,{useNewUrlParser: true})
	.then(() => console.log('mongodb connected....'))
	.catch(err => console.log('mongodb connect error'));

//bodyparser
app.use(bodyParser.json({limit:'1mb'}));
app.use(bodyParser.urlencoded({
	parameterLimit:100000,
	limit:'1mb',
	extended:true
}))


//session
app.use(session({
	secret:'mySecret',
	saveUninitialized: true,
	resave:true
}))

//connect flash
app.use(flash());

//passport init
app.use(passport.initialize());
app.use(passport.session());

//global var
app.use(function(req,res,next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next()
})




//express static folder
app.use(express.static(path.join(__dirname,'public')));


//view engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

//route
const posts = require('./routes/posts');
app.use(posts);

const users = require('./routes/users');
app.use('/user',users);

//server
const port = process.env.PORT || 5000;
app.listen(port,()=> console.log(`Server is running port ${port}`));