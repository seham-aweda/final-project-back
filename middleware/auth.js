const jwt=require('jsonwebtoken')
const userModel=require('../Models/user.model').User

const auth=async(req,res,next)=>{
    try{console.log('fff')
        const token = req.header('Authorization').replace('Bearer ', '')
        console.log('token',token)
        const decoded = jwt.verify(token, 'thisismyfirstwebtoken')
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