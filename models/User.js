import bcrypt from 'bcrypt';
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
    trim: true,
  },
  email:{
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password:{
    type: String,
    required: true
  },
  role:{
    type:String,
    enum: ['user', 'manager', 'admin'],
    default: 'user'
  }
},{timestampts: true});

userSchema.pre('save', async function(){
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(password){
  return await bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema);
export default User;