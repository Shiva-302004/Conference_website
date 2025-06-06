const express=require("express")
const { cloud } = require("../multer/multer")
const UserModel=require("../models/User")
const dotenv=require("dotenv")
dotenv.config()
const bcryptjs=require("bcryptjs")
const secret=process.env.secret
const jwt=require("jsonwebtoken")
const validator=require("validator")

/**
 * 
 * @description Upload an image to cloud storage
 * @route POST /user/image
 * @access Private
 * @param {import("express").Request} req 
 * @param {import("express").Response} res  
 */
exports.uploadImage=async(req,res)=>{
    try{
        const result=await cloud.uploader.upload(req.file.path)
        return res.json({success:true,msg:" uploaded 😍",result:result.url})
    }catch(err){
        return res.json({success:false,msg:"error while uploading message",err})
    }
    
}
/**
 * 
 * @param {string} imageUrl 
 * @returns imagedata|null
 */
const getImageByImageUrl=async(imageUrl)=>{
    const publicId=imageUrl.split("/").slice(7).join("/").split(".")[0];
    return publicId;
}

/**
 * 
 * @description delete an image from cloud storage
 * @route DELETE /user/image/:imageurl
 * @access Private
 * @param {import("express").Request} req 
 * @param {import("express").Response} res  
 */
exports.deleteImage=async(req,res)=>{
    try{
        const {imageurl}=req.body;
        if(!imageurl){
            return res.json({success:false,msg:"image url is required"})
        }
        const public_id=await getImageByImageUrl(imageurl);
        const result=await cloud.uploader.destroy(public_id);
        return res.json({success:true,msg:"deleted successfully",result})
    }catch(err){
        return res.json({success:false,msg:"error while deleting image",err})
    }
}

/**
 * 
 * @description Sign up a new user
 * @route POST /user/signup | This route is not used in the app, it is only for admin to create new users
 * @access Private
 * @param {import("express").Request} req 
 * @param {import("express").Response} res  
 */
exports.signUp=async(req,res)=>{
    const {name,email,password,pic}=req.body
    if(!name || !email ||!password||!pic){
        return res.json({success:false,msg:"these fields cannot be empty"})
    }
    if(!validator.isEmail(email)){
        return res.json({msg:"enter a valid email",success:false})
    }
    const isExisting=await UserModel.findOne({email:email})
    if(isExisting){
        return  res.json({success:false,msg:"email already in use"})
    }else{
        const pass=await bcryptjs.hash(password,10)
        const user=new UserModel({name,email,password:pass,pic})
        const newuser=await user.save();
        const payload={
            user:{
                id:newuser._id
            }
        }
        const token=await jwt.sign(payload,secret)
        return res.json({success:true,msg:`Welcome ${name} 😍 ! your registration successfull`,token,user:newuser})
    }
}

/**
 * 
 * @description Create a new admin member
 * @route POST /user/newuser
 * @access Private
 * @param {import("express").Request} req 
 * @param {import("express").Response} res  
 */
exports.createNewAdmin=async(req,res)=>{
    const {name,email,password,pic}=req.body
    
    if(!name || !email ||!password||!pic){
        return res.json({success:false,msg:"these fields cannot be empty"})
    }
    if(!validator.isEmail(email)){
        return res.json({msg:"enter a valid email",success:false})
    }
    const isExisting=await UserModel.findOne({email:email})
    if(isExisting){
        return  res.json({success:false,msg:"email already in use"})
    }else{
        const pass=await bcryptjs.hash(password,10)
        const user=new UserModel({name,email,password:pass,pic})
        const newuser=await user.save();
        return res.json({success:true,msg:` ${name} 😍 is ceated successfully`,user:newuser})
    }
}

/**
 * 
 * @description Login a user
 * @route POST /user/login
 * @access Private
 * @param {import("express").Request} req 
 * @param {import("express").Response} res  
 */
exports.login=async(req,res)=>{
    const {email,password}=req.body
    
    if(!email ||!password){
        return res.json({success:false,msg:"these fields cannot be empty"})
    }
    if(!validator.isEmail(email)){
        return res.json({msg:"enter a valid email",success:false})
    }
    const isExisting=await UserModel.findOne({email:email})
    if(!isExisting){
        return  res.json({success:false,msg:"email not registered"})
    }else{
        const pass=await bcryptjs.compare(password,isExisting.password)
        if(!pass){
            return res.json({msg:"wrong password",success:false})
        }
        const payload={
            user:{
                id:isExisting._id
            }
        }
        const token=await jwt.sign(payload,secret)
        return res.json({success:true,msg:`Welcome ${isExisting.name} 😍 ! your login successfull`,token,user:isExisting})
    }

}

/**
 * 
 * @description Get all users except the logged-in user
 * @route GET /user/Allusers
 * @access Private
 * @param {import("express").Request} req 
 * @param {import("express").Response} res  
 */
exports.getAllUsers=async(req,res)=>{
    try{
        console.log(req.user)
        const {name}=req.query;
        const keyword= (name)?{$or:[{name:{$regex:name,$options:"i"}},{email:{$regex:name,$options:"i"}}]}:{}
        const data=await UserModel.find(keyword,{name:1,email:1,pic:1}).find({_id:{$ne:req.user.id}});
        return res.json({
            success:true,
            data
        })
    }catch(err){
        console.log(err)
        return res.status(400).json({
            success:false,
            msg:"failed to load all users"
        })
    }
}