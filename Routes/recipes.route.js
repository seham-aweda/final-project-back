const express = require('express')
const router = express.Router()
const control=require('../Controllers/recipes.control')

router.get('/getAllRecipes',(req,res)=>{
    control.getAllRecipes(req,res)
})

module.exports = router