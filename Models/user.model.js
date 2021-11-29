const mongoose=require('mongoose')
const Schema=mongoose.Schema
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt=require('jsonwebtoken')



const userSchema=new Schema ({
    username:{
        type:String,
        required:true,
        trim:true,
        match:/^[a-zA-Z ]*$/
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
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    bmi:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'BMI'
    },
    tokens:[{
        token: {
            type: String,
            // required: true
        }}]
})

const BMISchema= new Schema({
    weight:{
        type:Number,
        required:true,
        min:20
    },
    height:{
        type:Number,
        required:true,
        min:0,
        max:3
    },
    result:{
        type:Number
    }
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}


userSchema.methods.generateAuthToken=async function (){
    const user=this
    const token=jwt.sign({_id:user._id.toString()},'thisismyfirstwebtoken')

    user.tokens=user.tokens.concat({token})
    await user.save()

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    console.log(isMatch)
    if (isMatch===false) {
        throw new Error('Unable to login')
    }

    return user
}


userSchema.pre('save',async function(next){
    const user=this
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
    }
    next()
})
const User = mongoose.model('User', userSchema)
const BMI = mongoose.model('BMI', BMISchema)

module.exports = {User,BMI}