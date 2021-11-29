const express=require('express')
const router=express.Router()
const control=require('../Controllers/bmi.controller')
const auth = require("../middleware/auth");

router.get('/',(req,res)=>{
    control.getAllBMI(req,res)
})
router.post('/me',(req,res)=>{
    control.addBMI(req,res)
})
router.put('/update',auth,(req,res)=>{
    control.UpdateBMI(req,res)
})

module.exports = router