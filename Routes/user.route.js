const express=require('express')
const router=express.Router()
const control=require('../Controllers/user.conrtoller')
const auth = require("../middleware/auth");

router.get('/me', auth, async (req, res) => {
    res.send(req.user)
})
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
router.post('/logoutAll',auth,async(req,res)=>{
await control.logOutAll(req,res)
})
router.delete('/delete/me',auth,(req,res)=>{
 control.DeleteUser(req,res)
})
module.exports=router