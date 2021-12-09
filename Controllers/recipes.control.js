const recipeModel=require('../Models/recipe.model')

const getAllRecipes=(req,res)=>{
    recipeModel.find({},(err,data)=>{
        if(err) return res.status(244).json(err)
        if(data) return res.status(200).json(data)
    })
}

module.exports = {
    getAllRecipes
}