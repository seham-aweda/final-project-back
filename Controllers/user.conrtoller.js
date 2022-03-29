const bcrypt = require("bcryptjs");
const userModel = require('../Models/user.model').User
const bmiModel = require('../Models/user.model').BMI

const formatDistanceStrict = require('date-fns/formatDistanceStrict')


const getAllUsers = async (req, res) => {
    await userModel.find({}).populate('bmi').exec((err, users) => {
        if (err) return res.status(240).send(err)
        if (users) {
            users.map((user) => {
                user.isActive = (formatDistanceStrict(new Date(), user.lastVisit, {
                    unit: 'day'
                }).slice(0, 2) <= 4)
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
    const userId = req.user._id
    bmiModel.findById(bmiId, (err, data) => {
        if (err) return res.status(240).send('there is no bmi like that')
        if (data) {
            userModel.findByIdAndUpdate(userId, {bmi: bmiId,$push: { weightTracker: {weight:data.weight} }}, {new: true, runValidators: true}, (err, user) => {
                if (err) return res.status(240).send(err)
                return res.status(200).send(user)
            })
        }
    })
}

const addCurrentWeight = (req, res) => {
    const {weight, date} = req.body
    const userId = req.user._id
    userModel.findById(userId, (err, user) => {
        if (err) return res.status(240).send('No such User')
        if (user) {
            let now = new Date()
            let todayUpdate = user.weightTracker.find(updatedWeight => (updatedWeight.date.getDate() === now.getDate() && updatedWeight.date.getMonth() === now.getMonth() && updatedWeight.date.getFullYear() === now.getFullYear())
            )
            if (todayUpdate) {
                return res.status(240).send('You Can Only Insert One Change Of Your Weight Per Day, Come Back Tomorrow')
            } else {
                bmiModel.findByIdAndUpdate(user.bmi, {weight: weight}, {
                    new: true,
                    runValidators: true
                }, (err, data) => {
                    if (err) return res.status(240).send(err)
                    userModel.findByIdAndUpdate(userId, {$push: {weightTracker: req.body}}, {
                        new: true,
                        runValidators: true
                    }, (err, user) => {
                        if (err) return res.status(240).send(err)
                        return res.status(200).send(user)
                    })
                })
            }


        }
    })
}

const removeWeight = (req, res) => {
    const {weightID} = req.params
    const userId = req.user._id
    userModel.findById(userId, (err, user) => {
        if (err) return res.status(240).send('no such user')
        if (user) {
            let idFound = user.weightTracker.find(id => id._id.toString() === weightID.toString())
            if (idFound === undefined) {
                return res.status(240).send('no weightId like that for this user')
            } else {
                user.weightTracker = user.weightTracker.filter(weight => weight._id.toString() !== weightID.toString())
                user.save()
                return res.status(200).send(user)
            }
        }
    })
}

const LogIn = async (req, res) => {
    try {
        const user = await userModel.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        user.lastVisit = new Date()
        user.isActive = (formatDistanceStrict(new Date(), user.lastVisit, {
            unit: 'day'
        }).slice(0, 2) < 7)
        user.save()
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

const UpdateUser = async (req, res) => {
    const id = req.user._id
    if (req.body.password !== undefined) {
        req.body.password = await bcrypt.hash(req.body.password, 8)
    }
    userModel.findByIdAndUpdate(id, req.body, {new: true, runValidators: true}, (err, update) => {
        if (err) res.status(240).send(err)
        if (update) res.status(200).send(update)
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
    DeleteUserByAdmin, addCurrentWeight, removeWeight
}