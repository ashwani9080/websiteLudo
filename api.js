var userdb = require("./userscheam");
const keys=require('./keys');
const passport=require('passport');
const GoogleStrategy=require('passport-google-oauth20');
const nodemailer=require('nodemailer');
const mongoose=require('mongoose');
/*************sendgrid configuration is here******************/
const sendmail=require('./template');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
    to: 'nancy@daffodilsw.com',
    from: 'ashwani8090singh@gmail.com',
    subject: 'Test verification email',
    html: sendmail.emailTemplate,

  }

/*************node mailer configuration is here******************/

var transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "1606c163243f16",
      pass: "7a737408cf4807"
    }
  });  

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

        console.log("user details: "+data.email);
        data.pic=req.file.originalname;
          
           userdb.find({'email':''+data.email},'email',(err,email)=>{
       
           if(err) {
               console.log(err);}
           else {
               if(email.length===0){
                   return CreateUser(data,res);
       
               }
               else{
                   res.send('user alreay exists');
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

//send mail through sendgrid
    const sendMail = async () => {
        try {
          sgMail.setApiKey(keys.sendmail.apiKeys);
          return sgMail.send(msg)
        } catch (error) {
          throw new Error(error.message)
        }
    }

//send maill through nodemailer
  
const mailOptions = {
    to: 'ashwani.singh@daffodilsw.com',
    from: 'ashwani9080singh@gmail.com',
    subject: 'Test verification email',
    html: sendmail.emailTemplate,
    text: 'Hey this is ashwani sent you mail to check  nodemailer ', 
};

const nodeMailerSend=()=> {
return new Promise((resolve,reject)=>{


    transport.sendMail(mailOptions,(err,info)=>{
        if (error) {
            reject(error);
                 }
            resolve(true);
    });


})
        


}
  

module.exports={Validate,CreateUser,Login,passport,GoogleStrategy,sendMail,nodeMailerSend};
    
//AIzaSyD32VrRDm-7bz2CynW6iymk0QFwRHHDQd8