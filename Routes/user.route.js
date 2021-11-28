const express=require('express')
const router=express.Router()
const control=require('../Controllers/user.conrtoller')

router.get('/',(req,res)=>{
    control.getAllUsers(req, res).then(r =>console.log(r))
})
router.post('/register',(req,res)=>{
    control.Register(req,res).then(r =>console.log(r))
})
router.post('/login',(req,res)=>{
control.LogIn(req,res)
})
router.post('/updatingBMI/:userId/:bmiId',(req,res)=>{
control.addingBMIToUser(req,res)
})
// router.post('',(req,res)=>{
//
// })
module.exports=router