import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

export const register = async(req, res)=>{
  const {name, email, password, role} = req.body;

  if (!name || !email || !password) {
    return res.status(404).json({ success: false, message: "All fields are required" });
  }

  try{
    const userExists = await User.findOne({email});
    if(userExists) return res.status(400).json({success: false, message:'User already exists'});

    const user = await User.create({name, email, password, role});
    const token = generateToken(user);

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: "strict",
      maxAge: 60*60*1000 // 1 hour
    });

    res.status(200).json({
      success: true, 
      message:'User successfully created', 
      user:{ id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  }
  catch(error){
    console.log(error);
    res.status(500).json({success: false, message:'Unexpected Server error'});
  }
}

export const login = async(req, res)=>{
  const {email, password} = req.body;
  try{
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({success: false, message: "Invalid credentials"});

    const isMatch = await user.comparePassword(password);
    if(!isMatch) return res.status(400).json({success: false, message: 'Invalid credentials'});

    const token = generateToken(user);
    
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      sameSite: "strict",
      maxAge: 60*60*1000 // 1 hour
    });

    res.status(200).json({
      success: true, 
      message:'User successfully logged in', 
      user:{ id: user._id, name: user.name, email: user.email, role: user.role }
    });
  }
  catch(error){
    console.log(error);
    res.status(500).json({success: false, message:'Unexpected Server error'});
  }
}

export const verifyUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error("verifyUser error:", error);
    res.status(500).json({ success: false, message: "Unexpected server error" });
  }
};
