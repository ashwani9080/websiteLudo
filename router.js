const express=require('express');
const router=express.Router();
var path    = require("path");
var multer  = require('multer');
 var storage = multer.diskStorage({
     destination: function (req, file, cb) {
       cb(null, 'public/profile');
     },
     filename: function (req, file, cb) {
       cb(null,file.originalname);
     }
   });   
var upload = multer({ storage:storage });
const userapi =  require('./api');
var cors = require('cors');

router.get('/logout',(req,res)=>{

    req.logOut();
    res.redirect('/');

});


const authCheck=(req,res,next)=>{
  if(!req.user){
    res.sendFile(__dirname+"/public/login.html");
  }else{
    next();
  }
}

router.post("/login",async (req,res,next)=>{
  try{

  let resultfromlogin = await userapi.Login(req.body);
      if(resultfromlogin){
           res.sendFile(__dirname+"/Ludo-master/ludo.html"); 
          }else{
          console.log("called false");
        }
    }catch(err){
      console.log("error message: "+err);
    }   
  });
  
  
  


router.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname + '/public/website.html'));

});


router.post("/adduser", upload.single('pic'),(req,res,next)=>{

  userapi.Validate(req.body,req,res);  
  next();  
    
});

  router.get('/googleapi',  userapi.passport.authenticate('google',{ 
    scope:['profile']

  }));

  

  router.get('/auth/google/redirect/',userapi.passport.authenticate('google'),(req,res)=>{

    res.redirect( `/ludo?origin=${req.originalUrl}`);

  });


  router.get('/ludo',(req,res)=>{
    res.sendFile(__dirname+"/Ludo-master/ludo.html"); 
    
  });


  router.post('/adduser', async (req, res) => {
    try {
      const sent = await userapi.sendMail()
      if (sent) {
        res.send({ message: 'email sent successfully' })
      }
    } catch (error) {
      throw new Error(error.message)
    }
  });


module.exports=router;



