const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema(
    {
    
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        reqiured: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Must not contain the word Password')
            }
        }  
    },
    age: {
        type: Number,
        defualt: 0,
        Validite(value) {
            if (value < 0 ){
                throw new Error('Age must be a positive number')
            }
        }
    }, 
    email:{
        type: String,
        reqiured: true,
        trim:true,
        lowercase:true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('email is invalid')
            }
        }
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }], 
    avatar:{ 
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    console.log(9)
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    
    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token

}


userSchema.statics.findByCredentials = async(email, password) =>{
    const user = await User.findOne({ email })

    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function(next) {
    const user = this
    console.log(10)
    if (user.isModified('password')) {
        console.log(12)

        user.password = await bcrypt.hash(user.password,8)  
    }
    console.log(13)

    next()
    console.log(14)
})

userSchema.pre('remove', async function(next) {
    const user = this

    await Task.deleteMany({owner: user._id})
    next()
})

const User = mongoose.model("User", userSchema)

module.exports = User
console.log(11)