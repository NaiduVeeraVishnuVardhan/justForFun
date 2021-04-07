const mangoose = require('mongoose')

const UserSchema = new mangoose.Schema({
    username: {type:String, required: true, unique: true},
    password: {type: String, required:true}   
    },
    {collection: 'users'}
)

const model = mangoose.model('UserSchema',UserSchema)

module.exports = model
