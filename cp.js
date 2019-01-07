var  express = require('express');
var http=require('http');
var url=require('url');
var  app = express();
var server=http.Server(app); 
var notie=require('notie');
var User=require('./database');
var bodyParser=require("body-parser");
var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;
var flash=require('connect-flash');
var session=require('express-session');


// middleware

app.use(flash());
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

//session
app.set('trust proxy', 1) ;
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: true },
 
}));

app.use(express.static('public'));

app.get('/user',(req,res) =>
{
    User.compare(req.query.q,function(err,user)
    {
        req.session.user=user;
        User.userCommunity(user.email,function(err,user)
        {
            res.render('user',{profile:user,data:req.session.user}); 
        });


    });
   
});


app.get('/flagSet',(req,res) =>
{
   
    res.render('flagSet',{profile:req.query.q}); 
    
});

app.get('/createCommunities',(req,res) =>
{
    User.compare(req.query.q,function(err,user)
    {
res.render('createCommunities',{data:user});
});
});

app.get('/profile',(req,res) =>
{
    User.compare(req.query.q,function(err,user)
    {
 res.render('profile',{data:user});
});
});

//admin
app.get('/admin',(req,res) =>
{
    User.compare(req.query.q,function(err,user)
    {
    res.render('admin',{profile:user}); 
});
});
app.get('/adduser',(req,res) =>
{    
    res.render('adduser');
});
app.get('/changePassword',(req,res) =>
{
    User.compare(req.query.q,function(err,user)
    {
 res.render('changePassword',{data:user});
});
});
app.get('/changePasswordAdmin',(req,res) =>
{   
    res.render('changepasswordadmin');
});
app.get('/userlist',(req,res) =>
{ 
    User.getAll(function(err,user)
    {
        res.render('userlist',{profile:user});
    });
});
app.get('/editprofile',(req,res) =>
{
      User.editProfile(req.query.q,function(err,user)
    { 
        res.render('editprofile',{profile:user});     
    });
});

app.get('/editProfileUser',(req,res) =>
{
      User.editProfile(req.query.q,function(err,user)
    { 
        res.render('editProfileUser',{profile:user,data:user});     
    });
});

app.get('/communities',(req,res) =>
{
    User.compare(req.query.q,function(err,user)
    {
        req.session.user=user;
     User.getAllCommunity(function(err,user)
    {
        res.render('communities',{profile:user,data:req.session.user});     
    });
});
});

app.get('/manageCommunity',(req,res) =>
{
    User.compare(req.query.q,function(err,user)
    {
        req.session.user=user;
    User.getcommunity(req.query.club,function(err,doc)
    {
        res.render('manageCommunity',{profile:doc,data:req.session.user});
});
});
});

app.get('/member',(req,res) =>
{
    User.compare(req.query.q,function(err,user)
    {
        req.session.user=user;
    User.getcommunity(req.query.club,function(err,doc)
    {
        res.render('member',{profile:doc,data:req.session.user});
});
});
});

app.get('/communitymanager',(req,res) =>
{

    User.compare(req.query.q,function(err,user)
    {
        req.session.user=user;
        
   User.communityOwner(user.name,function(err,doc)
   {

     res.render('communitymanager',{profile:doc,data:req.session.user});
});
});
});


//notie
app.get('/node_modules/notie/dist/notie.js',(req,res) =>
{
    res.sendFile(__dirname + "/node_modules/notie/dist/notie.js");
});

app.get('/communitylist',(req,res) =>
{ 
    User.getAllCommunity(function(err,user)
    {
        res.render('communitylist',{profile:user});
    });
});

app.get('/switchstate',(req,res) =>
{ 
    
        res.render('switchstate');
  
});

app.get('/communityUser',function(req,res)
{
    User.getDataCommunity(req.query.q,function(err,user)
    {
        res.send(user);
    });

});

app.get('/joinCommunity',function(req,res)
{

   User.joinCommunity(req.query.q,req.query.name,function(err,user)
    {
        if(!user)
        {
            res.send("you are now a member");
        }
        else
        {
        res.send("you are already a member");
        }
    });

});

app.get('/askCommunity',function(req,res)
{

   User.askCommunity(req.query.q,req.query.name,function(err,user)
    {
        if(!user)
        {
            res.send("Now a member");
        }
        else
        {
        res.send("Already a member");
        }
    });

});

app.get('/searchCommunity',function(req,res)
{

   User.searchCommunity(req.query.name,function(err,user)
    {
        if(!user)
        {
            res.send("No Community Found");
        }
        else
        {

        res.send(user);
        }
    });

});

// all post below


app.post('/adduser',(req,res) =>
{   
User.createUser1(req);
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
    }
    else if(user.role==='admin'){
    User.compare2(user,function(err,doc)
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
    req.session.user=user;
            User.compare2(user,function(err,doc)
            {
           res.render('user',{profile:doc,data:req.session.user});
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
            req.session.user=user;
            User.compare2(user,function(err,doc)
            {
           res.render('communitymanager',{profile:doc,data:req.session.user});
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

app.post('/updateProfile',function(req,res)
{
User.updateBothProfile(req,function(err,user)
{
    if(!user)
    {
        console.log(error);
    }
    else{
 res.redirect('/');
    }
});
});

app.post('/changePasswordAdmin',function(req,res)
{
User.changePasswordAdmin(req,function()
{

res.redirect('/changepasswordadmin');
});
});

app.post('/changePassword',function(req,res)
{
User.changePasswordAdmin(req,function()
{
res.redirect('/changepassword');
});
});

app.post('/updateCommunity',function(req,res)
{
    User.compare(req.query.q,function(err,user)
    {  
        req.session.user=user;
User.createCommunity(req,user.name,function(err,user)
{
console.log("community created successfully");
res.render('createCommunities',{data:req.session.user});
});
});
});
app.post('/changeflagSet',(req,res) =>
{

   User.changeStatus(req,function()
   {
    res.redirect('/flagSet');
});    
});

app.post('/editProfileUser',function(req,res)
{
User.updateProfile(req,function(err,user)
{
    if(!user)
    {
        console.log(error);
    }
    else{

        res.render('editProfileUser',{profile:user,data:user}); 
    }
});  
});

//favicon
var favicon=require('serve-favicon');
app.use(favicon(__dirname + "/public/images/logo.png"));

//listen
app.listen(3030,() => console.log(` app listening on port ${3030}!`));
