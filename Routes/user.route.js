const express = require('express')
const router = express.Router()
const control = require('../Controllers/user.conrtoller')
const auth = require("../middleware/auth");
const authAdmin = require("../middleware/checkAdmin");
const userModel = require('../Models/user.model').User

router.get('/me', auth, async (req, res) => {

    userModel.findById(req.user._id).populate('bmi').exec((err, data) => {
        if (err) return res.status(240).send(err)
        return res.status(200).send(data)
    })
})
router.get('/', async(req, res) => {
  await  control.getAllUsers(req, res)
})
router.post('/register', async (req, res) => {
    await control.Register(req, res)
})
router.post('/login', async (req, res) => {
    await control.LogIn(req, res)
})
router.post('/updatingBMI/:bmiId',auth, (req, res) => {
    control.addingBMIToUser(req, res)
})
router.put('/updatingWeight',auth, (req, res) => {
    control.addCurrentWeight(req, res)
})
router.put('/DeleteWeight/:weightID',auth, (req, res) => {
    control.removeWeight(req, res)
})
router.get('/logout', auth, async (req, res) => {
    await control.logOut(req, res)
})
router.get('/logoutAll', auth, async (req, res) => {
    await control.logOutAll(req, res)
})
router.delete('/delete/me', auth, (req, res) => {
    control.DeleteUser(req, res)
})
router.delete('/delete/:id', authAdmin, (req, res) => {
    control.DeleteUserByAdmin(req, res)
})
router.put('/update/me',auth,async(req,res)=>{
    await control.UpdateUser(req,res)
})


module.exports = router