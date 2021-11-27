const express=require('express')
const cors=require('cors')
const bodyParser=require('body-parser')
const mongoose=require('mongoose')
require('dotenv').config()

const app=express()

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


mongoose.connect('mongodb://localhost/finalProject', {useNewUrlParser: true},()=>{
    console.log(('connected to DB'))
})

app.listen(process.env.PORT||5000,()=>{
    console.log(('server on port 5000'))
})
