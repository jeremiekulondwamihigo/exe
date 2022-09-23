const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { JWT_EXPIRE, JWT_SECRET } = require("../config/data")

const UserSchema = mongoose.Schema({
    username : { type:String, required:true},
    password : { type : String, required : true},
    fonction :  {type:String, required:true}
})

UserSchema.pre("save", async function(next){
    if(!this.isModified("password")){
      next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
  
  UserSchema.methods.matchPasswords = async function(password){
    return await bcrypt.compare(password, this.password);
  }
  
  UserSchema.methods.getSignedToken = function(){
  
    return jwt.sign({ id : this._id, fonction : this.fonction}, JWT_SECRET, {
      expiresIn : JWT_EXPIRE,
    });
  }
const valeur = new mongoose.model("Login", UserSchema)
module.exports = valeur