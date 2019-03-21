const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type: String,
    required: true
  },
  gender:{
    type:String,
    enum:['m','f','x'],
    default:'x',
    required:true
  },
  bio:{
    type:String,
    required:true
  },
  avatar:{
    type:String,
    required:true
  },
  meta:{
    createdAt:{
      type:Date,
      default: Date.now()
    }
  }
})

module.exports = mongoose.model('User',UserSchema);