
var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/login_database', { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
///////////////multer

var multer=require('multer');
var fileFilter=function(req,file,callback)
{
if(file.mimetype==='image/jpeg' || file.mimetype==='image/png'|| file.mimetype==='image/jpg`1')
{
    callback(null,true);
}
else{
    callback(null,false);
}
}
var storage=multer.diskStorage({
    destination:function(req,file,callback)
    {
        callback(null,'./upload');
    },
    filename:function(req,file,callback)
    {
        callback(null,Date.now()+file.originalname);
    }
});
var upload=multer({storage:storage,
fileFilter:fileFilter
}).single('profilePhoto');


////////////





var UserSchema1 =mongoose.Schema({
flag:{
            type:String,
            index:true,
           
        },
 role:
        {
    type:String,
    required:true
        },
    phone:
    {
        type:String,
        required:true
    },
    city:
    {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true
       },
    password:{
        type:String,
        required:true
      
    },
    status:{
        type:String,
        required:true
    }
    });

var user1=mongoose.model('login',UserSchema1,'login');

var UserSchema2 =mongoose.Schema({
    pic:
    {
        type:String,
      
    },
    role:
    {
type:String,

    },
phone:
{
    type:String,
    required:true
},
city:
{
    type:String,
    required:true
},
email:{
        type:String,
    index:true,
    unique:true
    },
name:
    {
type:String
    },
dob:
{
    type:String
},
gender:
{
    type:String
},
interest: {
    type:String,
   },
journey:{
    type:String
  
},
expect:{
    type:String
  
}
});
var user2=mongoose.model('user_database',UserSchema2,'user_database');


module.exports.compare1=function(doc,callback)
{
     var query1={email:doc.email};
    user1.findOne(query1, function(err, user) {
    if(user === null)
    {
        console.log("null");
        callback(null, false);
    }
    
    else if(user.flag ==='activate' && user.password === doc.password)
    {
      
        callback(null,user);
    }
    else
    {
        
        callback(null,false);
    }
});
}
 
module.exports.compare2=function(doc,callback)
{
     var query2={email:doc};
    user2.findOne(query2, function(err, user) {
       
        callback(null,user);
    
});
}




module.exports.getUserById=function(id,callback)
{
    
    user.findById(id,callback);
} 
module.exports.getUserByEmail=function(email,callback)
{
    var query={email:email};
    user.findOne(query, function(err, user) {
    
        callback(err, user);
      });
} 

module.exports.comparePassword=function(candidatePassword,hash,callback)
{

   var query={password:candidatePassword};
    user.findOne(query, function(err, user) {
        callback(null,isMatch);
      });
     
}

module.exports.createUser1=function(req){
  

    var newuser1=new user1({
        flag:'activate',
        role:req.body.roleoptions,
        phone:req.body.phone,
        city:req.body.city,
        email:req.body.username,
        password:req.body.password,
        status:'pending'
    });

    newuser1.save(function (err, user) {
        if (err) return console.error(err);
console.log("write schema 1succesfully");
      });

    
}
  

module.exports.createUser2=function(req) {

    var newuser2=new user2({
        pic:req.profilePhoto,
        role:req.body.roleoptions,
        phone:req.body.phone,
        city:req.body.city,
        email:req.body.username,
        name:req.body.fullname,
        dob:req.body.dob,
        gender:req.body.gender,
        interest:req.body.interest,
        journey:req.body.aboutjourney,
        expect:req.body.expect
    });

    newuser2.save(function (err, user) {
        if (err) return console.error(err);
console.log("write schema2 succesfully");
         
    });
}


//updateProfile
module.exports.updateProfile=function(req,callback)
{
    user2.findOne({email: req.body.username}, function (err, user) {
       
    
       user.phone=req.body.phone,
        user.city=req.body.city,
        user.email=req.body.username,
        user.name=req.body.fullname,
        user.dob=req.body.dob,
        user.gender=req.body.gender,
        user.interest=req.body.interest,
        user.journey=req.body.aboutjourney,
        user.expect=req.body.expect,
        user.pic=req.body.profilePhoto
  /* upload(req,(err)=>
    {
        if(err)
        {
            console.log("error");
        }
        else if(req.profilePhoto==undefined)
        {
         console.log("error");
        }
        else{
       user.pic=`upload/${req.profilePhoto.filename}`;      
        }
      });*/
    
        user.save(function (err) {
            if(err) {
                console.error('ERROR!');
            }
        });
        callback(null,user);    });
      

}


module.exports.updateBothProfile=function(req,callback)
{
    user1.findOne({email: req.body.username}, function (err, user) {
        user.status='confirmed',
        user.phone=req.body.phone,
        user.city=req.body.city,
        user.email=req.body.username,
         user.save(function (err) {
            if(err) {
                console.error('ERROR!');
            }
        });

  
    var newuser2=new user2({
        pic:req.body.profilePhoto,
        role:user.role,
        phone:req.body.phone,
        city:req.body.city,
        email:req.body.username,
        name:req.body.fullname,
        dob:req.body.dob,
        gender:req.body.gender,
        interest:req.body.interest,
        journey:req.body.aboutjourney,
        expect:req.body.expect
    });

    newuser2.save(function (err, user) {
        if (err) return console.error(err);
console.log("write schema2 succesfully");
   callback(null,user);
  
});
});

}
module.exports.getAll=function(callback)
{
    user1.find({},function(err,user)
    {
        callback(err,user);
    });

}