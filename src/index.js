const express = require('express');
require('./db/mongoose');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/tasks')

const app = express();
const port = process.env.PORT || 5000;

app.use((req,res,next)=>{ //middlewares: new request-> do something(middleware) ->run route handeler

})

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


app.listen(port,()=>{
    console.log('server runnig on',port);
})

const jwt = require('jsonwebtoken');
const myFunction = async()=>{
    const token = jwt.sign({_id:'abcd123'},'secret',{expiresIn:'1h'}); //this creates jwt token with payload data and the secret key, and exprires in param
    console.log(token);

    const data = jwt.verify(token,'secret'); //this verify the secret of jwt and returns the payload data from that token
    console.log(data);
}
//myFunction();