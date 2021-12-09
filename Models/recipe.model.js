const mongoose=require('mongoose')
const Schema=mongoose.Schema

const recipeSchema=new Schema ({
   ingredients : {
        type: String,
    } ,
    methods: {
        type: String,
    } ,
    title: {
        type: String,
    } ,
    photo: {
        type: String,
    }
})

const Recipe = mongoose.model('Recipe', recipeSchema)

module.exports = Recipe