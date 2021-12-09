const recipeModel=require('../Models/recipe.model')

const getAllRecipes=(req,res)=>{
    recipeModel.find({},(err,data)=>{
        if(err) return res.status(244).json(err)
        if(data) return res.status(200).json(data)
    })
}
const getRecipeById=(req,res)=>{
    const {recipeId}=req.params
    recipeModel.find({_id:{$eq:recipeId}},(err,data)=>{
        if(err) return res.status(244).json(err)
        if(data) return res.status(200).json(data)
    })
}
module.exports = {
    getAllRecipes,getRecipeById
}