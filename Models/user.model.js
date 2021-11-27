const mongoose=require('mongoose')
const Schema=mongoose.Schema
const validator = require('validator')


const userSchema=new Schema ({
    username:{
        type:String,
        required:true,
        trim:true,
        },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
        },
    password:{
        type:String,
        required:true,
        trim:true,
        },
    // bmi:{
    //   type:Number,
    //   // required:true,
    // },
    tokens:[{
        token: {
            type: String,
            // required: true
        }}]
})


const User = mongoose.model('User', userSchema)

module.exports = User