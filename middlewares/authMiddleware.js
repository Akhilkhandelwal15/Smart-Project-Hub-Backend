import jwt from 'jsonwebtoken';
import User from "../models/User.js";

export const protect = async(req, res, next)=>{
  let token;
  if (req.cookies && req.cookies.authToken) {
    token = req.cookies.authToken;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) return res.status(401).json({success: false, message: 'Not authorized, user not found'});
    next();
  }
  catch(error){
    console.log("error:", error);
    return res.status(401).json({success: false, message:"Not authorized, token failed"});
  }
}

export const authorize = (...roles)=>{
  return (req, res, next)=>{
    console.log(req.user);
    console.log("roles:", roles);
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not logged in' });
    }

    if(!roles.includes(req.user.role)){
      return res.status(403).json({success: false, message: 'User not authorized for this action'});
    }
    next();
  }
}