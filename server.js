const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./model/user')
const bcrypt = require('bcryptjs')
const { json } = require('body-parser')
const jwt = require("jsonwebtoken")
const JWT_SECRET ='fiuhberuipvhbrtuipghewr9p7eg982370237480uobcn;kwcie'
mongoose.connect('mongodb://localhost:27017/login-app-db',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

const app = express()

app.use('/', express.static(path.join(__dirname,'static')))
app.use(bodyParser.json())
//--------------------------------Change password-----------------------------------------------------------------
app.post('/api/change-password', async(req,res)=>{
    const {token, newpassword: plainTextPassword} = req.body
    if (!plainTextPassword ||typeof plainTextPassword !== 'string')
    {
        return res.json({status: 'error', error: 'INVALID USERNAME'})
    }
    if (plainTextPassword.length < 5){
        return res.json({
            status: "error",
            error : "password must be more than 6 characters"
        })
    }
    
         
    try{

        const user = jwt.verify(token, JWT_SECRET)  
        const _id = user.id
        const password = await bcrypt.hash(plainTextPassword,10)
        await User.updateOne({ _id},{$set:{password}})
        res.json({status:'ok'})
        
    }
    catch(error){
        res.json({status: 'error', error:"Someone is tring to mess up "})
    }
    
})
//----------------------------------Login---------------------------------------------------------------
app.post('/api/login', async(req,res)=>{

    const{username, password} = req.body
    
    const user = await User.findOne({username}).lean()
    if(!user){
        return res.json({status:'error', error:'INVALID USERNAME?PASSWORD'})
    }

    if(await bcrypt.compare(password, user.password)){
        const token = jwt.sign( {id: user._id, username: user.username} , JWT_SECRET )
        return res.json({status:'ok', data:token})
    }

    res.json({status:'error', data:"error:'INVALID USERNAME?PASSWORD'"})
}
)
//-------------------------------------Register------------------------------------------------------------
app.post('/api/register', async (req, res) => {

    const { username, password: plainTextPassword } = req.body


    if (!username ||typeof username !== 'string')
    {
        return res.json({status: 'error', error: 'INVALID USERNAME'})
    }
    if (!plainTextPassword ||typeof plainTextPassword !== 'string')
    {
        return res.json({status: 'error', error: 'INVALID USERNAME'})
    }
    if (plainTextPassword.length < 5){
        return res.json({
            status: "error",
            error : "password must be more than 6 characters"
        })
    }

    const password = await bcrypt.hash(plainTextPassword,10)
        try{
        const response = await User.create({
            username,
            password
        })
        console.log('User created successfully: ',response)
        
    } catch (error) {
        if(error.code === 11000){
            return res.json({status: 'error', error: 'Username already in use'})
        }
        throw error
    }
    res.json({ status:'ok'})
})   
app.listen(9999,() => {
    console.log('Server up at 9999')
})

