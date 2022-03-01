const jwt=require('jsonwebtoken')
const userModel=require('../Models/user.model').User

const auth=async(req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, `${process.env.JWT_SECRET_KEY}`)
        const user = await userModel.findOne({ _id: decoded._id, 'tokens.token': token })
    if(!user){
        throw new Error()
    }

     req.token=token
     req.user=user
    next()

    }catch(e){
        res.status(240).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth