import express from 'express'
import User from '../models/User.js';
import bcript from 'bcrypt'
import jwt from 'jsonwebtoken';
import middleware from '../middleware.js';

const router = express.Router()

router.post('/register', async(req, res) =>{
    try{
        const {name, email, password} = req.body;
        const user = await User.findOne({email})


        if(user){
            return res.status(401).json({success: false, message: "User already exist"})
        }

        const hashPassword = await bcript.hash(password, 10)

        const newUser = new User({
            name, email, password: hashPassword
        })

        await newUser.save()

        console.log("Account Created Successfully")

        return res.status(200).json({success: true, message: "Account Created Successfully"})

    }catch(error){

        return res.status(500).json({success: false, message: "Error in Adding User"})
        
    }
})

router.post('/login', async(req, res) =>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email})


        if(!user){
            return res.status(401).json({success: false, message: "User Not exist"})
        }

        const checkpassword = await bcript.compare(password, user.password)

        if(!checkpassword) {
            return res.status(401).json({success: false, message: "Wrong Credentials"})
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET,{
            expiresIn: "5h",
        })
        

        return res.status(200).json({success: true,
            token, user: {name: user.name}, message: "Login Successfully"});

    }catch(error){

        return res.status(500).json({success: false, message: "Error in loging"})
        
    }
})

router.get('/verify', middleware, async(req,res)=>{
    return res.status(200).json({success: true,user: req.user})
})

export default router