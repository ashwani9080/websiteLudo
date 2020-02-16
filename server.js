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
{useNewUrlParser:true,useUnifiedTopology:true});
app.use(cookiesSession({
  maxAge:20*60*60*1000,
  keys:[keys.session.cookiesSession]

}));
app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname,'Ludo-master')));
app.use("/",router);


app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', req.get('origin'));
    res.set('Access-Control-Request-Method','GET');
    res.set('Origin','http://localhost:8086/');
    res.set('Host','localhost:8086');
    res.set('X-AppEngine-Cron','true');
    res.set('Content-Type', 'text/html')
    res.set('Access-Control-Allow-Headers','Proxy-Authorization')
    res.set('Access-Control-Max-Age', '120')
    
    next()
  });

app.listen(8086,function(req,res){

    console.log("connected");

});


