const express=require('express')
const router=express.Router()
const control=require('../Controllers/bmi.controller')

router.get('/',(req,res)=>{
    control.getAllBMI(req,res)
})
router.post('/me',(req,res)=>{
    control.addBMI(req,res)
})

module.exports = router