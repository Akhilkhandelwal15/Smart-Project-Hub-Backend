import User from "../models/User.js";

export const getUsers = async(req, res)=>{
  try{
    const users = await User.find().select("-password -role -__v");
    if(!users){
      res.status(404).json({success: false, message:"Users not found"});
    }
    console.log("user is there");
    res.status(200).json({success: true, users});
  }
  catch(error){
    console.log("error:", error);
    res.status(500).json({success: false, message:"Internal server error"});
  }
}