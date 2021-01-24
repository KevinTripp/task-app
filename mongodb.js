

const {MongoClient, ObjectID} = require('mongodb')

const connctionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'
 console.log("mongodb.js")

MongoClient.connect(connctionURL, {useUnifiedTopology: true}, (error, client) => {
    if(error){
        return console.log('unable to connect to database')
    }

    const db = client.db(databaseName)

    // db.collection('users').deleteMany({
    //     age:27
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    db.collection('tasks').deleteOne({
        _id:new ObjectID("5e8fb4b7ef6f4b5984a09a0b")
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })

    // db.collection('tasks').updateMany({
    //     completed: false
    // }, {
    //     $set:{
    //         completed: true
    //     }
    // }).then((result) =>{
    //     console.log(result.modifiedCount)
    // }).catch((error) => {
    //     console.log(error)
    // })


    // db.collection('users').updateOne({
    //     _id: new ObjectID("5e8e64088573974f88600eb1")
    // }, {
    //     $set: {
    //         name: 'Mike'
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })

    // db.collection('users').insertMany([
    //     {
    //         name: 'jen',
    //         age: 28
    //     },
    //     {
    //         name:'gunther',
    //         age: 27
    //     }
    // ], (error, result ) =>{
    //     if (error){
    //         return console.log('Unable to insert documents!')
    //     }    
    //     console.log(result.ops)
    // } )
    // db.collection('tasks').insertMany([
    //     {
    //         description: "Go fishing",
    //         completed: true
    //     }, {
    //         description: "Go sailing",
    //         completed: false
    //     },{
    //         description: "Go cooking",
    //         completed: false
    //     }
    // ], (error, result) =>{
    //     if(error){
    //        return console.log('Could not insert documents')
    //     }
    //     console.log(result.ops)
    // })

})