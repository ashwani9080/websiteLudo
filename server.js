const express=require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose');
const app=express();
let router=require('./router');
var path = require('path')
const keys=require('./keys.js');
const cors = require("cors");
const cookiesSession=require('cookie-session');
const passport=require('passport');


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
// app.use(cors()) ; 

mongoose.connect('mongodb://localhost:27017/webdatabase',
{ useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
}).then(()=>{console.log('connected to db')}).catch(err=>{console.log(err)});


app.use(cookiesSession({
  maxAge:20*60*60*1000,
  keys:[keys.session.cookiesSession]

}));
app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname,'Ludo-master')));
app.use(express.static(path.join(__dirname,'images')));
app.use("/",router);

app.listen(8086,function(req,res){

    console.log("connected");

});


