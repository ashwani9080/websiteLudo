var mongoose = require("mongoose");
var logSchema = mongoose.Schema({

uname:{type:String},
psw:{type:String},


},{ versionKey: false });

module.exports = mongoose.model("collectionlog",userSchema)