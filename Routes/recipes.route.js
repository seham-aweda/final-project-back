const express = require('express')
const router = express.Router()
const control=require('../Controllers/recipes.control')

router.get('/getAllRecipes',(req,res)=>{
    control.getAllRecipes(req,res)
})
router.get('/byId/:recipeId',(req,res)=>{
    control.getRecipeById(req,res)
})
module.exports = router