const express=require('express')
const router=express.Router()
const control=require('../Controllers/user.conrtoller')
const auth = require("../middleware/auth");

router.get('/',async(req,res)=>{
    await control.getAllUsers(req, res)
})
router.post('/register',async(req,res)=>{
    await control.Register(req,res)
})
router.post('/login',async(req,res)=>{
await control.LogIn(req,res)
})
router.post('/updatingBMI/:userId/:bmiId',(req,res)=>{
control.addingBMIToUser(req,res)
})
router.post('/logout',auth,async(req,res)=>{
await control.logOut(req,res)
})
module.exports=router