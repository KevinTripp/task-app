const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.use(function(req, res, next){
    res.setTimeout(120000, function(){
        console.log('Request has timed out.');
            res.send(408);
        });

    next();
});

app.listen(port, () =>{
    console.log('Server is up on port '  + port)
})

