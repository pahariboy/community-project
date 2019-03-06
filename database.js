
var mongoose=require('mongoose');


// Build the connection string 
var dbURI = 'mongodb://localhost:27017/login_database'; 

// Create the database connection 
mongoose.connect(dbURI, { useNewUrlParser: true }); 

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open to ' + dbURI);
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
});







mongoose.set('useCreateIndex', true);

var bcrypt = require('bcryptjs');

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

var communitySchema =mongoose.Schema({
    pic:
    {
        type:String,
      
    },
rule:
    {
      type:String,

    },
name:
    {
type:String,
required :true
    },
description:
{
    type:String
},
owner:
{
    type:String,
    required:true
},
date:
{
    type:String
},
request:[{type:String}],
member:[{type:String}],
invite:[{type:String}]
});
var community_manager=mongoose.model('Community_data',communitySchema,'Community_data');

var discussionSchema=mongoose.Schema({
name:{
type:String,
required:true,
unique:true,
},
detail:[{
pic:[{type:String}],
title:[{type:String}]

}],
loc:
{
    type:String,
},

});
var discussion=mongoose.model('discussion',discussionSchema,'discussion');

var commentSchema=mongoose.Schema({
title_club:{
    type:String,
    required:true
},
comment:[{type:String}]
});

var comment=mongoose.model('comment',commentSchema,'comment');


module.exports.createCommunity=function(req,username,callback){
  var d=new Date();
  var dat=d.getFullYear()+"-"+d.getMonth()+1+"-"+d.getDate();

    var newuser1=new community_manager({
        pic:req.file.filename,
        
    rule:req.body.type,
    name:req.body.name,
    description:req.body.description,
    owner:username,
    date:dat,
    request:[""],
    member:[""],
    invite:[""]
    });

    newuser1.save(function (err, user) {
        if (err) 
        {
            callback(null,false);
        }
        else{
console.log("write schema 1succesfully");
callback(null,user);
        }
      });

    
};
module.exports.updateCommunity=function(req,callback)
{
    community_manager.findOne({name:req.body.name},function(err,user)
    {
  user.pic=req.file.filename,
 user.rule=req.body.type,
    user.name=req.body.name,
    user.description=req.body.description,
        user.save(function (err) {
            if(err) {
                console.error('ERROR!');
            }
            callback(null,user);   
         });
            
        
    });
};
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
};

module.exports.passportCompare=function(username,password,callback)
{
 
     var query1={email:username};
    user1.findOne(query1, function(err, user) {
    if(user === null)
    {
        
        callback(null, false);
    }
    
    else if(user.flag ==='activate')
    {

    bcrypt.compare(password,user.password, function(err, res) {
        if(res)
        {
        
        callback(null,user);
        }
        else{
            callback(null,false);
        }
    });

    
      
    }
 
 
});
};

module.exports.getUserById=function(id,done)
{
    user1.findById(id, function(err, user) {
        done(err, user);
      });
};




module.exports.compare=function(doc,callback)
{
     var query2={email:doc};
     user2.findOne(query2, function(err, user) {
        
         callback(null,user);
     
 });
};

module.exports.changePasswordAdmin=function(email,req,callback)
{
     var query2={email:email};
     user1.findOne(query2, function(err, user) {

        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(req.body.newPassword, salt, function(err, hash) {
          
        user.password=hash;
        user.save(function (err) {
            if(err) {
                console.error('ERROR!');
            }
        });
         callback();
    });
});   
 });
};

module.exports.changePassword=function(email,req,callback)
{
     var query2={email:email};
     user1.findOne(query2, function(err, user) {

        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(req.body.newPassword, salt, function(err, hash) {
        user.password=hash;
        user.save(function (err) {
            if(err) {
                console.error('ERROR!');
            }
        });
        callback();
    });
}); 
 });
};

module.exports.changeStatus=function(req,callback)
{
     var query2={email:req.query.q};
     user1.findOne(query2, function(err, user) {
        user.flag=req.body.flag;
        user.save(function (err) {
            if(err) {
                console.error('ERROR!');
            }
        });
        callback();
     
 });
};

module.exports.compare2=function(doc,callback)
{
   if(doc.role==='admin')
   {
    var query2={email:doc.email};
    user2.findOne(query2, function(err, user) {
       
        callback(null,user);
    
});
   }
   else if(doc.role==='user')
   {
    user2.findOne({email:doc.email}, function(err, user) {
    community_manager.find({member:{$in:[user.name]}},function(err,user)
        {
            callback(err,user);
        });
    
});

   
}
   else
   {
   
    community_manager.find({$or:[{member:{$in:[doc.name]}},{owner:doc.name}]},function(err,user)
    {
        callback(err,user);
    });
 
   }
};

module.exports.editProfile=function(req,callback)
{
var query2={email:req};
    user2.findOne(query2, function(err, user) {
       
        callback(null,user);
    
});
   };


module.exports.getUserById=function(id,callback)
{
    
    user.findById(id,callback);
}; 
module.exports.getUserByEmail=function(email,callback)
{
    var query={email:email};
    user.findOne(query, function(err, user) {
    
        callback(err, user);
      });
}; 

module.exports.comparePassword=function(candidatePassword,hash,callback)
{

   var query={password:candidatePassword};
    user.findOne(query, function(err, user) {
        callback(null,isMatch);
      });
     
};

module.exports.createUser1=function(req){

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
       hashCode=hash;
       
  
    var newuser1=new user1({
        flag:'activate',
        role:req.body.roleoptions,
        phone:req.body.phone,
        city:req.body.city,
        email:req.body.username,
        password:hash,
        status:'pending'
    });

    newuser1.save(function (err, user) {
        if (err) return console.error(err);
           console.log("write schema 1succesfully");
      });

    });
});    
};
  

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
        user.pic=req.file.filename,

    
        user.save(function (err) {
            if(err) {
                console.error('ERROR!');
            }
        });
        callback(null,user);    });
      

};


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

};

module.exports.getAll=function(callback)
{
    user1.find({},function(err,user)
    {
        callback(err,user);
    });

};


module.exports.getAllCommunity=function(callback)
{
    community_manager.find({},function(err,user)
    {
        callback(err,user);
    });

};

module.exports.getDataCommunity=function(doc,callback)
{
community_manager.find({name:doc},function(err,user)
{
callback(err,user);
});
};

module.exports.userCommunity=function(doc,callback)
{
    user2.findOne({email:doc}, function(err, user) {
        community_manager.find({member:{$in:[user.name]}},function(err,user)
            {
                callback(err,user);
            });
        
    });
};

module.exports.communityOwner=function(user,callback)
{
   
        community_manager.find({$or:[{member:{$in:[user]}},{owner:user}]},function(err,user)
            {
                callback(err,user);
            });
        
};

module.exports.getcommunity=function(user,callback)
{
   
        community_manager.find({name:user},function(err,user)
            {
                callback(err,user);
            });
        
};

module.exports.joinCommunity=function(clubname,username,callback)
{
community_manager.findOne({name:clubname,member:{$in:[username]}},function(err,user)
{
                if(!user)
                {

 community_manager.update({ name: clubname },{ $push: { member: username } },function(err,user)
           {                        console.log("added"); 
                    callback(null,false);
                });
                }
                else{
                    console.log("present");
                
                callback(null,true);
                }
  
});
};

module.exports.askCommunity=function(clubname,username,callback)
{
community_manager.findOne({name:clubname,$or:[{member:{$in:[username]}},{request:{$in:[username]}}]},function(err,user)
{
                if(!user)
                {

 community_manager.update({ name: clubname },{ $push: { request: username } },function(err,user)
           {                        console.log("added"); 
                    callback(null,false);
                });
                }
                else{
                    console.log("present");
                
                callback(null,true);
                }
  
});
};


module.exports.searchCommunity=function(clubname,callback)
{
community_manager.findOne({name:clubname},function(err,user)
{
    if(!user)
    {
           callback(null,false);
    }
    else{
callback(null,user);
    }
});
};
module.exports.leaveCommunity=function(username,clubname,callback)
{
    community_manager.findOne({name:clubname,member:{$in:[username]}},function(err,user)
    {
                    if(user)
                    {
     community_manager.update({ name: clubname },{ $pull: { member: username } },function(err,user)
               {                  
                        callback(null,user);
                    });
                    }
                    else{

                    
                    callback(null,false);
                    }
      
    });
};



module.exports.createDiscussion=function(req,clubname,callback)
{

    var newuser1=new discussion({
        
        name:clubname,
        detail:[{
            pic:[req.file.filename]},{
            title:[req.body.title]
              }],
            loc:"",
    });

    newuser1.save(function (err, user) {
        if (err) return console.error(err);
console.log("write discussion schema succesfully");
callback(null,user);
      });



};
