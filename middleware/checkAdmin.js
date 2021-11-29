const jwt = require('jsonwebtoken')
const userModel = require('../Models/user.model').User

const authAdmin = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const user = await userModel.findOne({_id: decoded._id, 'tokens.token': token})

        if (user._id.toString() === req.params.id || user.admin !== true) throw new Error( 'requested Admin Access...')
        else{
            req.token = token
            req.user = user
            res.status(200).send('deleted')
            next()
        }
    } catch (err) {
        res.status(240).send(err.message)
    }
}

module.exports = authAdmin