const express=require('express');
const router=express.Router();
var path    = require("path");
var qs = require('query-string');
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



router.get('/verify',async (req,res)=>{
 
    console.log(req.query.email);

    try{

      let result=await userapi.updateVerified(req.query.email);
      if(result){
        res.send('verified updated');
      }else{
        res.send('error');
      }
    }catch(err){

      res.send(err);
    }



});

router.post("/login",async (req,res,next)=>{
  try{
  let resultfromlogin = await userapi.Login(req.body);

      if(resultfromlogin){
           res.sendFile(__dirname+"/Ludo-master/ludo.html"); 
          }else{
          console.log("called false");
          res.send('sorry');
        }
    }catch(err){
      res.send(err);
      console.log("error message: "+err);
    }   
  });
  
  
  


router.get('/',(req,res)=>{

  res.sendFile(path.join(__dirname + '/public/website.html'));

});


router.post("/adduser", upload.single('pic'), async (req,res)=>{
  try{
    let checkValidated= await userapi.Validate(req.body,req,res);

     if(checkValidated){
       console.log('adduser'+checkValidated);
       res.sendFile(__dirname+"/public/login.html");
      }else{
        console.log('adduser'+checkValidated);
      }
  }catch(err){

    res.send(err);
  
    }
  
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


  router.get('/sendmail', async (req, res) => {
    try {
      const sent = await userapi.sendMail();
      if (sent) {
        res.send({ message: 'email sent successfully' })
      }
    } catch (error) {
      res.send(error);
      
    }
  });


  router.get('/nodemailer',async (req,res)=>{

    try{  
    const sent =await userapi.nodeMailerSend();
    console.log('called'+sent);
    if(sent)
      res.send({ message: 'email sent successfully' });
    }catch(err){
      throw new Error(error.message)
    }
  })

module.exports=router;



