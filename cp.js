var  express = require('express');
var http=require('http');
var url=require('url');
var  app = express();
var server=http.Server(app); 

var User=require('./database');
var bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;
var flash=require('connect-flash');
var session=require('express-session');
app.set('view engine','ejs');
app.use(flash());

//session
app.set('trust proxy', 1) ;
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: true },
 
}));



// login
app.get('/',(req,res) =>
{
    res.sendFile(__dirname + '/public/index.html');
});


//style
app.get('/style/style.css',(req,res) =>
{
    res.sendFile(__dirname + "/public/style/style.css");
});

//js file
app.get('/javascript/edit.js',(req,res) =>
{
    res.sendFile(__dirname + "/public/javascript/edit.js");
});
//admin
app.get('/admin',(req,res) =>
{
      req.session.isloggedIn = true;
      
    res.render('admin');
});
app.get('/adduser',(req,res) =>
{     
    res.render('adduser');
});
app.get('/userlist',(req,res) =>
{
    User.getAll(function(err,user)
    {
        res.render('userlist',{data:user});
    });
});
app.get('/editprofile',(req,res) =>
{
      User.compare2(req.query.q,function(err,user)
    {
        res.render('editprofile',{profile:user});     
    });
});
app.get('/communities',(req,res) =>
{
     // User.compare2(req.query.q,function(err,user)
    //{
        res.render('communities');     
    //});
});

app.get('/communitylist',(req,res) =>
{
 
    res.render('communitylist');
});
//images
app.get('/images/logo.png',(req,res) =>
{
    res.sendFile(__dirname + "/public/images/logo.png");
});

//notie
app.get('/node_modules/notie/dist/notie.js',(req,res) =>
{
    res.sendFile(__dirname + "/node_modules/notie/dist/notie.js");
});

// all post below

//post http

app.post('/adduser',(req,res) =>
{
    
User.createUser(req);
    res.redirect('/adduser');
});

//login
app.post('/login',function(req,res)
{
User.compare1(req.body,function(err,user)
{
    if(!user)
    {
        res.redirect('/');
        console.log('invalid');
    }
    else if(user.role==='admin'){
    User.compare2(user.email,function(err,doc)
    {
        
   res.render('admin',{profile:doc});
    });
}
    else if(user.role==='user'){
        if(user.status==='pending')
        {
            res.render('updateprofile',{profile:user});
        }
        else{
            User.compare2(user.email,function(err,doc)
            {
           res.render('user',{profile:doc});
            });
    }
}
    else
    {
        if(user.status==='pending')
        {
            res.render('updateprofile',{profile:user});
        }
        else{ 
            User.compare2(user.email,function(err,doc)
            {
           res.render('communitymanager',{profile:doc});
            });
    }
}
});

});
app.post('/editProfile',function(req,res)
{
User.updateProfile(req,function(err,user)
{
    if(!user)
    {
        console.log(error);
    }
    else{
        res.render('editprofile',{profile:user}); 
    }
});

   
});

app.post('/user',function(req,res)
{
User.updateBothProfile(req,function(err,user)
{
    if(!user)
    {
        console.log(error);
    }
    else{
        res.render('user',{profile:user}); 
    }
});
});

app.post('/communitymanager',function(req,res)
{
User.updateBothProfile(req,function(err,user)
{
    if(!user)
    {
        console.log(error);
    }
    else{
        res.render('communitymanager',{profile:user}); 
    }
});   
});

//favicon
var favicon=require('serve-favicon');
app.use(favicon(__dirname + "/public/images/logo.png"));

//listen
app.listen(3030,() => console.log(` app listening on port ${3030}!`));