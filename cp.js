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
var multer=require('multer');
var upload=multer({dest:'./public/images'});

var sess;
// middleware

app.use(flash());
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended:true}));
app.use(bodyParser.json());

//session

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: true },
 
}));

app.use(express.static('public'));

app.get('/',function(req,res)
{

res.sendFile(__dirname+"/index.html");
});


app.get('/logout',function(req,res)
{
req.session.destroy(function(err)
{
if(err)
{
    console.log("error");
}
else{

    res.redirect('/');
}
});
});


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
{console.log(req.session.email);
    User.compare(req.query.name,function(err,user)
    {

    res.render('flagSet',{profile:req.query.q,data:user}); 
    });  
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
{console.log(sess.email);
    User.compare(req.query.q,function(err,user)
    {
    res.render('admin',{profile:user,data:user}); 
});
});
app.get('/adduser',(req,res) =>
{   console.log(sess.email);
    User.compare(req.query.q,function(err,user)
    {
    res.render('adduser',{data:user}); 
}); 

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
    User.compare(req.query.q,function(err,user)
    {
 res.render('changePasswordadmin',{data:user});
}); 

});
app.get('/userlist',(req,res) =>
{ 
    User.compare(req.query.q,function(err,user)
    {
req.session.user=user;
    User.getAll(function(err,user)
    {
        res.render('userlist',{profile:user,data:req.session.user});
    });
});
});
app.get('/editprofile',(req,res) =>
{

        User.editProfile(req.query.q,function(err,user)
        {
        res.render('editprofile',{profile:user,data:user});     
    });

});

app.get('/userListEditProfile',(req,res) =>
{
    User.editProfile(req.query.q,function(err,user)
    {
        req.session.user=user; 
      User.compare(req.query.name,function(err,user)
    { 
    res.render('userListEditProfile',{profile:req.session.user,data:user});     
    });
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

app.get('/communityprofile',(req,res) =>
{

    User.compare(req.query.q,function(err,user)
    {
        req.session.user=user;
     User.getcommunity(req.query.club,function(err,user)
    { 
        res.render('communityProfile',{profile:user,data:req.session.user});     
    });
});
});

app.get('/communityprofileAdmin',(req,res) =>
{

    User.compare(req.query.q,function(err,user)
    {
        req.session.user=user;
     User.getcommunity(req.query.club,function(err,user)
    { 
        res.render('communityProfileAdmin',{profile:user,data:req.session.user});     
    });
});
});

app.get('/editcommunity',(req,res) =>
{

    User.compare(req.query.q,function(err,user)
    {
        req.session.user=user;
     User.getcommunity(req.query.club,function(err,user)
    { 
        res.render('editCommunity',{profile:user,data:req.session.user});     
    });
});
});

app.get('/discussion',(req,res) =>
{
   
    User.compare(req.query.q,function(err,user)
    {
        req.session.user=user;
     User.getcommunity(req.query.club,function(err,user)
    { 
        res.render('discussion',{profile:user,data:req.session.user});     
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

app.get('/editCommunityAdmin',(req,res) =>
{
    User.compare(req.query.q,function(err,user)
    {
        req.session.user=user;
    User.getcommunity(req.query.club,function(err,doc)
    {
        res.render('editCommunityAdmin',{profile:doc,data:req.session.user});
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
    User.compare(req.query.q,function(err,user)
    {
req.session.user=user;
    
    User.getAllCommunity(function(err,user)
    {
        res.render('communitylist',{profile:user,data:req.session.user});
    });
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
            res.send('undefined');
        }
        else
        {

        res.send(user);
        }
    });

});

app.get('/leaveCommunity',function(req,res)
{

   User.leaveCommunity(req.query.name,req.query.club,function(err,user)
    {
        if(!user)
        {
            res.send('undefined');
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
res.redirect('/adduser?q='+req.query.q);
});

//login

app.post('/login',function(req,res)
{ 
    sess=req.session;
    sess.email=req.body.email;

User.compare1(req.body,function(err,user)
{
    if(!user)
    {
        res.redirect('/');
    }
    else if(user.role==='admin'){

        if(user.status==='pending')
        {
         res.render('updateprofile',{profile:user});
        }
else
{
    User.compare2(user,function(err,doc)
    {
    
 res.render('admin',{profile:doc,data:doc});
    });
}
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
            User.compare(user.email,function(err,user)
            {
            req.session.user=user;
            User.compare2(user,function(err,doc)
            {
           res.render('communitymanager',{profile:doc,data:req.session.user});
            });
            });
    }
}
});

});
app.post('/editProfile',upload.single('profilePhoto'),function(req,res)
{
User.updateProfile(req,function(err,user)
{
    if(!user)
    {
        console.log(error);
    }
    else{

        res.render('editprofile',{profile:user,data:user}); 
    }
});  
});

app.post('/userListEditProfile',function(req,res)
{
User.updateProfile(req,function(err,user)
{
    req.session.user=user;
    if(!user)
    {
        console.log(error);
    }
    else{
        User.compare(req.query.q,function(err,user)
        {

        res.render('userListEditProfile',{profile:req.session.user,data:user}); 
    });
    }

});  
});

app.post('/updateProfile',upload.single('profilePhoto'),function(req,res)
{
User.updateBothProfile(req,function(err,user)
{
    if(!user)
    {
        console.log(error);
    }
    else{
        req.session.destroy(function(err)
        {
if(err)
{
console.log(err);
}
else
{
res.redirect('/');
}
});
}
});
});

app.post('/changePasswordAdmin',function(req,res)
{
User.changePasswordAdmin(req,function()
{

res.redirect('/changepasswordadmin?q='+req.query.q);
});
});

app.post('/changePassword',function(req,res)
{
User.changePasswordAdmin(req,function()
{
res.redirect('/changepassword?q='+req.query.q);
});
});

app.post('/createCommunity',upload.single('file'),function(req,res)
{
    User.compare(req.query.q,function(err,user)
    {  
        req.session.user=user;
User.createCommunity(req,user.name,function(err,user)
{

res.redirect('/createCommunities?q='+req.query.q);
});
});
});

app.post('/updateCommunity',upload.single('file'),function(req,res)
{
    req.session.name=req.query.q;
    req.session.club=req.query.club;
  
User.updateCommunity(req,function(err,user)
{ 
console.log("community updated successfully");
res.redirect('editCommunity?q='+req.session.name+'&club='+req.session.club);
});
});

app.post('/updateCommunityAdmin',function(req,res)
{
    req.session.name=req.query.q;
    req.session.club=req.query.club;
    
User.updateCommunity(req,function(err,user)
{ 
console.log("community updated successfully");
res.redirect('editCommunityAdmin?q='+req.session.name+'&club='+req.session.club);
});
});

app.post('/changeflagSet',(req,res) =>
{

   User.changeStatus(req,function()
   {
    res.redirect('/flagSet?q='+req.query.q+'&name='+req.query.name);
});    
});

app.post('/editProfileUser',upload.single('profilePhoto'),function(req,res)
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

app.post('/discussion',upload.single('file'),function(req,res)
{
User.compare(req.query.q,function(err,user)
{
req.session.user=user;
User.createDiscussion(req,req.query.club,function(err,user)
{
    console.log(user);
    res.send('hello');
//res.render('discussion',{profile:user,data:req.session.user});    
});

});
});


//favicon
var favicon=require('serve-favicon');
app.use(favicon(__dirname + "/public/images/logo.png"));

//listen
app.listen(3030,() => console.log(` app listening on port ${3030}!`));
