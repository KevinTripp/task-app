const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

console.log(1)

app.use(express.json())
console.log(2)

app.use(userRouter)
console.log(3)

app.use(taskRouter)
console.log(4)

app.listen(port, () =>{
    console.log('Server is up on port '  + port)
})

