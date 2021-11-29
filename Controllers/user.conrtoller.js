const userModel=require('../Models/user.model').User

const getAllUsers= async (req,res)=>{
    userModel.find({}).populate('bmi').exec((err,users)=>{
        if(err) return res.status(240).send(err)
        return res.status(200).send(users)
    })
}
const Register=async(req,res)=>{
    const user=new userModel(req.body)
    try{
        await user.save()
        const token = await user.generateAuthToken()

        res.status(201).json({user, token})
    }catch (e){
        res.status(240).send(e)
    }
}

const addingBMIToUser=(req,res)=>{
    const {userId,bmiId}=req.params
userModel.findByIdAndUpdate(userId,{bmi:bmiId},{new:true,runValidators:true},(err,user)=>{
    if(err) return res.status(240).send(err)
    return res.status(200).send(user)
})
}

const LogIn=async(req,res)=>{
    try{
        const user=await userModel.findByCredentials(req,res,req.body.email,req.body.password)
        const token = await user.generateAuthToken()

        res.status(200).json({user,token})
    }catch(e){
        res.status(240).send()
    }
}

const logOut=async (req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter(token=>{
            return token.token!== req.token
        })
        await req.user.save()
        res.send(req.user)
    }catch(e){
        res.status(500).send()
    }
}

const logOutAll=async(req,res)=>{
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send(req.user)
    }catch(e){
        res.status(500).send()
    }

}
module.exports = {
    getAllUsers,Register,LogIn,addingBMIToUser,logOut,logOutAll
}