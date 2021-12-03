const bcrypt = require("bcryptjs");
const userModel = require('../Models/user.model').User
const bmiModel = require('../Models/user.model').BMI
const formatDistanceStrict = require('date-fns/formatDistanceStrict')


const getAllUsers = async (req, res) => {
    await userModel.find({}).populate('bmi').exec((err, users) => {
        if (err) return res.status(240).send(err)
        if(users){
            users.map((user)=>{
                console.log(user.lastVisit)
               user.isActive=  (formatDistanceStrict(new Date(), user.lastVisit, {
                   unit: 'day'
               }).slice(0, 2) <= 7)
                console.log(user.isActive)
                 user.save()
            })
        return res.status(200).send(users)
        }
    })
}
const Register = async (req, res) => {
    const user = new userModel(req.body)
    user.lastVisit = new Date()
    try {
        await user.save()
        const token = await user.generateAuthToken()

        res.status(201).json({user, token})
    } catch (e) {
        res.status(240).send(e.message)
    }
}

const addingBMIToUser = (req, res) => {
    const {bmiId} = req.params
    const userId=req.user._id
    userModel.findByIdAndUpdate(userId, {bmi: bmiId}, {new: true, runValidators: true}, (err, user) => {
        if (err) return res.status(240).send(err)
        return res.status(200).send(user)
    })
}

const LogIn = async (req, res) => {
    try {
        const user = await userModel.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.status(200).send({user, token})
    } catch (e) {
        res.status(240).send(e.message)
    }
}

const logOut = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        })
        await req.user.save()
        res.status(200).send(req.user)
    } catch (e) {
        res.status(240).send(e.message)
    }
}

const logOutAll = async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send(req.user)
    } catch (e) {
        res.status(240).send(e.message)
    }

}

const UpdateUser=async (req,res)=>{
    const id=req.user._id
    console.log(req.body.password)
   if(req.body.password!==undefined){
       req.body.password=await bcrypt.hash( req.body.password,8)
   }
    console.log(req.body.password)
    userModel.findByIdAndUpdate(id,req.body,{new:true,runValidators:true},(err,update)=>{
        if(err) res.status(240).send(err)
        if(update) res.status(200).send(update)
    })
}
const DeleteUserByAdmin = (req, res) => {
    const {id} = req.params
    userModel.findById(id, (err, data) => {
        const bmiId = data.bmi

        userModel.findByIdAndDelete(id, (err, user) => {
            if (err) return res.status(240).send(err)
            bmiModel.findByIdAndDelete(bmiId, (err, bmi) => {
                if (err) return res.status(240).send(err)
                if (bmi) return res.status(200).json({deletedUser: user, deletedBMI: bmi})
            })
        })
    })
}
const DeleteUser = (req, res) => {
    const id = req.user._id
    userModel.findByIdAndDelete(id, (err, user) => {
        if (err) return res.status(240).send(err)
        if (req.user.bmi) {
            const bmiId = req.user.bmi
            bmiModel.findByIdAndDelete(bmiId, (err, bmi) => {
                if (err) return res.status(240).send(err)
                if (bmi) return res.status(200).json({deletedUser: user, deletedBMI: bmi})
            })
        } else {
            if (user) return res.status(200).json(user)
        }
    })
}

module.exports = {
    getAllUsers,
    Register,
    LogIn,
    addingBMIToUser,
    logOut,
    logOutAll,
    UpdateUser,
    DeleteUser,
    DeleteUserByAdmin
}