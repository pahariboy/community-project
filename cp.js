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
var bcrypt = require('bcryptjs');

var sess;
// middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended:true}));
app.use(bodyParser.json());
app.use(express.static('public'));
//session

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: true ,maxAge:6000},
 
}));



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


app.get('/user',function(req,res)
{

    User.compare(sess.email,function(err,user)
    {
        req.session.user=user;
        User.userCommunity(user.email,function(err,user)
        {
            res.render('user',{profile:user,data:req.session.user}); 
        });


    });
   
});


app.get('/flagSet',function(req,res)
{
    User.compare(sess.email,function(err,user)
    {

    res.render('flagSet',{profile:req.query.q,data:user}); 
    });  
});

app.get('/createCommunities',function(req,res)
{
    User.compare(sess.email,function(err,user)
    {
res.render('createCommunities',{data:user});
});
});

app.get('/profile',function(req,res)
{

    User.compare(sess.email,function(err,user)
    {
 res.render('profile',{data:user});
});
});

//admin
app.get('/admin',function(req,res)
{console.log(req.session);

    User.compare(sess.email,function(err,user)
    {
    res.render('admin',{profile:user,data:user}); 
});
});
app.get('/adduser',function(req,res)  
{
    
    User.compare(sess.email,function(err,user)
    {
    res.render('adduser',{data:user}); 
}); 

});
app.get('/changePassword', function(req,res)
{
    User.compare(sess.email,function(err,user)
    {
 res.render('changePassword',{data:user});
});
});
app.get('/changePasswordAdmin', function(req,res)
{  
    User.compare( sess.email,function(err,user)
    {
 res.render('changePasswordadmin',{data:user});
}); 

});
app.get('/userlist', function(req,res)
{ 

    User.compare( sess.email,function(err,user)
    {
req.session.user=user;
    User.getAll(function(err,user)
    {
        res.render('userlist',{profile:user,data:req.session.user});
    });
});
});
app.get('/editprofile', function(req,res)
{

        User.editProfile( sess.email,function(err,user)
        {
        res.render('editprofile',{profile:user,data:user});     
    });

});

app.get('/userListEditProfile', function(req,res)
{
    User.editProfile( sess.email,function(err,user)
    {
        req.session.user=user; 
      User.compare(req.query.q,function(err,user)
    { 
    res.render('userListEditProfile',{data:req.session.user,profile:user});     
    });
});
});


app.get('/editProfileUser', function(req,res)
{
    console.log(sess.email);
      User.editProfile( sess.email,function(err,user)
    { 
        res.render('editProfileUser',{profile:user,data:user});     
    });
});

app.get('/communities', function(req,res)
{
    User.compare( sess.email,function(err,user)
    {
        req.session.user=user;
     User.getAllCommunity(function(err,user)
    {
        res.render('communities',{profile:user,data:req.session.user});     
    });
});
});

app.get('/communityprofile', function(req,res)
{

    User.compare( sess.email,function(err,user)
    {
        req.session.user=user;
     User.getcommunity(req.query.club,function(err,user)
    { 
        res.render('communityProfile',{profile:user,data:req.session.user});     
    });
});
});

app.get('/communityprofileAdmin', function(req,res)
{

    User.compare( sess.email,function(err,user)
    {
        req.session.user=user;
     User.getcommunity(req.query.club,function(err,user)
    { 
        res.render('communityProfileAdmin',{profile:user,data:req.session.user});     
    });
});
});

app.get('/editcommunity', function(req,res)
{

    User.compare( sess.email,function(err,user)
    {
        req.session.user=user;
     User.getcommunity(req.query.club,function(err,user)
    { 
        res.render('editCommunity',{profile:user,data:req.session.user});     
    });
});
});

app.get('/discussion', function(req,res)
{
   
    User.compare( sess.email,function(err,user)
    {
        req.session.user=user;
     User.getcommunity(req.query.club,function(err,user)
    { req.user=user;
        User.getDiscussion(req.query.club,function(err,user)
        {

        res.render('discussion',{profile:req.user,data:req.session.user,comm:user});     
    });    });
});

});

app.get('/manageCommunity', function(req,res)
{
    User.compare( sess.email,function(err,user)
    {
        req.session.user=user;
    User.getcommunity(req.query.club,function(err,doc)
    {
        res.render('manageCommunity',{profile:doc,data:req.session.user});
});
});
});

app.get('/editCommunityAdmin', function(req,res)
{
    User.compare( sess.email,function(err,user)
    {
        req.session.user=user;
    User.getcommunity(req.query.club,function(err,doc)
    {
        res.render('editCommunityAdmin',{profile:doc,data:req.session.user});
});
});
});


app.get('/member', function(req,res)
{
    User.compare( sess.email,function(err,user)
    {
        req.session.user=user;
    User.getcommunity(req.query.club,function(err,doc)
    {
        res.render('member',{profile:doc,data:req.session.user});
});
});
});

app.get('/communitymanager', function(req,res)
{


    User.compare( sess.email,function(err,user)
    {
        req.session.user=user;
        
   User.communityOwner(user.name,function(err,doc)
   {

     res.render('communitymanager',{profile:doc,data:req.session.user});
});
});
});


//notie
app.get('/node_modules/notie/dist/notie.js', function(req,res)
{
    res.sendFile(__dirname + "/node_modules/notie/dist/notie.js");
});

app.get('/communitylist', function(req,res)
{ 
    User.compare( sess.email,function(err,user)
    {
req.session.user=user;
    
    User.getAllCommunity(function(err,user)
    {
        res.render('communitylist',{profile:user,data:req.session.user});
    });
});
});

app.get('/switchstate', function(req,res)
{ 
    
        res.render('switchstate');
  
});

app.get('/communityUser',function(req,res)
{
    User.getDataCommunity( req.query.q,function(err,user)
    {
        res.send(user);
    });

});


app.get('/acceptUser',function(req,res)
{
    
   User.acceptDataCommunity( req,function(err,user)
    {
      
    });

});

app.get('/rejectUser',function(req,res)
{
    
   User.rejectDataCommunity( req,function(err,user)
    {
      
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


app.post('/adduser', function(req,res)
{    

User.createUser1(req);
res.redirect('/adduser');
});

//login

app.post('/login',
  passport.authenticate('local'),
  function(req, res) {

    sess=req.session;
    sess.email=req.user.email;
    
if(req.user.role==='admin'){

        if(req.user.status==='pending')
        {
         res.render('updateprofile',{profile:req.user});
        }
else
{
    User.compare2(req.user,function(err,doc)
    {
   
 res.render('admin',{profile:doc,data:doc});
    });
}
    }
    else if(req.user.role==='user'){
        if(req.user.status==='pending')
        {
            res.render('updateprofile',{profile:req.user});
        }
        else{

            User.compare2(req.user,function(err,doc)
            {
           res.render('user',{profile:doc,data:req.user});
            });
    }
}
    else
    {
        if(req.user.status==='pending')
        {
            res.render('updateprofile',{profile:req.user});
        }
        else{ 
            User.compare(req.user.email,function(err,user)
            {
            req.session.user=req.user;
            User.compare2(req.user,function(err,doc)
            {
           res.render('communitymanager',{profile:doc,data:req.session.user});
            });
            });
    }
}
});



  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
    function(username,password, done) {
      User.passportCompare(username,password, function (err, user) {
          if(user)
          {
           
            return done(null, user);
          }
          else{
        
              return done(null,false);
          }
        });
    }
  ));


  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
      done(err, user);
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
User.changePasswordAdmin(sess.email,req,function()
{

res.redirect('/changepasswordadmin');
});
});

app.post('/changePassword',function(req,res)
{
User.changePasswordAdmin(sess.email,req,function()
{
res.redirect('/changepassword');
});
});

app.post('/createCommunity',upload.single('file'),function(req,res)
{
    User.compare(req.query.q,function(err,user)
    {  
        req.session.user=user;
User.createCommunity(req,user.name,function(err,user)
{

res.redirect('/createCommunities');
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
res.redirect('editCommunity?club='+req.session.club);
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

app.post('/changeflagSet', function(req,res)
{

   User.changeStatus(req,function()
   {
    res.redirect('/flagSet?q='+req.query.q);
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
User.getDataCommunity( req.query.name,function(err,user)
{
req.user=user;
User.createDiscussion(req,function(err,user)
{

 res.render('discussion',{profile:req.user,data:req.session.user,comm:user});    
});
});
});
});


//favicon
var favicon=require('serve-favicon');
app.use(favicon(__dirname + "/public/images/logo.png"));

//listen
app.listen(3030,console.log('app listening to port 3030'));
