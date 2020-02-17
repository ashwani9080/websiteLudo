var userdb = require("./userscheam");
const keys=require('./keys');
const passport=require('passport');
const GoogleStrategy=require('passport-google-oauth20');
const mongoose=require('mongoose');
const sendmail=require('./sendMail');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/*---login function for the user  called in router-------*/  
 let Login=(data)=>{

    return new Promise((resolve,reject)=>{
    
        console.log("user log: "+data.uname);
    
        userdb.find({'email':''+data.uname,'password':data.psw},'email',(err,email)=>{
    
            if(err) {
                console.log(err);
                reject(false);
            }
            else {
                if(email.length===1){
                 console.log("SUCCESSFULLY  LOOGED IN ");
              
               resolve(true);
                    }
                else{
                
                    console.log("INVALID PASSWORD ");}
                    reject(false);
              }
                
            });
    
    
    })
    
    
    
    };
/*---Validate function for the user  called in router-------*/  

  let   Validate=(data,req,res)=>{

        console.log("user details: "+data.pic);
        data.pic=req.file.originalname;
          
           userdb.find({'email':''+data.email},'email',(err,email)=>{
       
           if(err) {
               console.log(err);}
           else {
               if(email.length===0){
                   return CreateUser(data,res);
       
               }
               else{
                   console.log("already exist: "+email.length);
                   return false;
               }
       
             }
                  
       
           });
          
       };
       
/*---Create database function for the user  called in router-------*/  
  
   let  CreateUser=(data,res)=>{
       
       
           userdb.create(data,function(err,result){
               if(err){
                adduser
                  res.send(err);
                  return false;
       
               }else{

                const msg = {
                    to: data.email,
                    from: 'ashwani9080singh@gmail.com',
                    subject: 'Test verification email',
                    html: sendmail.emailTemplate,
                
                  }
                  sendMail(msg);
                
       
                 console.log("user created : "+result);
                 res.sendFile(__dirname+'/public/login.html');
                 return true;
              
               }
       
              });
       
       }


       passport.serializeUser((user,done)=>{
        done(null,user.id);
    });

    passport.deserializeUser((id,done)=>{
         userdb.findById(id).then((user)=>{
             done(null,user);


         })

    })


    passport.use(
        new GoogleStrategy({
             callbackURL:'/auth/google/redirect/',
             clientID: keys.google.client,
             clientSecret:keys.google.clientSecret

        },
        (accessToken,refreshToken,profile,done)=>{
             console.log(profile);


                 userdb.findOne({googleId:profile.id}).then((currentUser)=>{

                     if(currentUser ){
                         done(null,currentUser);
                         console.log('user already exist');
                     }else{

                     new userdb({
                         googleId:profile.id,    
                         name:profile.name.giveName,
                         lastName:profile.name.familyName,
                         pic:profile.photos[0].value,
                     }).save().then((newuserdb)=>{
                         console.log('database created :'+newuserdb);
                         done(null,newuserdb);
                     }) ;  
    
                 }
    
                 });

        })
    );

//send mail
    const sendMail = async (msg) => {
        try {
          sgMail.setApiKey(process.env.SENDGRID_API_KEY)
          return sgMail.send(msg)
        } catch (error) {
          throw new Error(error.message)
        }
      }
      
   



module.exports={Validate,CreateUser,Login,passport,GoogleStrategy,sendMail};
    
//AIzaSyD32VrRDm-7bz2CynW6iymk0QFwRHHDQd8