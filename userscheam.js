var mongoose = require("mongoose");
var userSchema = mongoose.Schema({

email:{type:String},
name:{type:String},
lastName:{type:String},
phone:{type:String},
password:{type:String},
pic:{type:String},
verified:{type:Boolean},
googleId:{type:String},
},{ versionKey: false });

module.exports = mongoose.model("collectionusers",userSchema);