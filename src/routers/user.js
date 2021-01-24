const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail, sendCancellationEmail} = require('../emails/account')


const avatar = multer({
    limits:{
        fileSize:1000000
    }, 
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            cb(new Error('File must be an image'))
        }        

        cb(undefined, true)

    }
})

router.post("/users", async (req, res) => {
    console.log(1)
    const user = new User(req.body)
    console.log(2)

    try {
        console.log(3)

        await user.save()
        console.log(4)

        sendWelcomeEmail(user.email, user.name)
        console.log(5)

        const token = await user.generateAuthToken()
        console.log(6)

        res.status(201).send({user, token})
    } catch (e){
        console.log(7)

        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.send({user, token})
    }catch(e){
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            console.log(token.token)
            console.log(req.token)
            return token.token !== req.token
        })

        await req.user.save()
        res.send()
    }catch (e){
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth,  (req, res) =>{
    res.send(req.user)
})

//Can't access a different user profile
// router.get('/users/:id', (req, res) =>{
//     const _id = req.params.id
//     console.log(_id)

//     User.findById(_id).then((user) =>{
//         if (!user){
//             return res.status(404).send()
//         }

//         res.send(user)
//     }).catch((e) => {
//         res.status(500).send()
//     })
// })

router.patch('/users/me',auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: 'invalid updates!'})
    }

    try{
        updates.forEach((update) => { 
            req.user[update] = req.body[update]
        })

       //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
       await req.user.save()
       res.send(req.user)
    }catch (e) {
        console.log('failed')
        res.status(400).send(e)
    }
})

router.delete('/users/me',auth ,  async (req, res) => {
    try {
        // const user = await User.findByIdAndRemove(req.user._id)
        // if(!user){
        //     return res.status(404).send()
        // }

        await req.user.remove()
        res.send(req.user)
        sendCancellationEmail(user.email,user.name)
    } catch (e) {
        res.status(500).send(e)
        
    }
})

router.post('/users/me/avatar',auth,  avatar.single('avatar'), async (req, res) => {
    // req.user.avatar = req.file.buffer

    const buffer = await sharp(req.file.buffer).png().resize({width:250, height:250}).toBuffer()
    await req.user.save()

    res.send()

}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    try{
        req.user.avatar = undefined
        await req.user.save()

        res.send(req.user)

    }catch(e){
        res.status(500).send(e)
    }
})

router.get('/users/:id/avatar', async (req, res) => {
    try{

        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(404).send()
    }
})

module.exports = router