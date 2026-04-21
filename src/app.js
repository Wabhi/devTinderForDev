const express = require('express');
const app = express();

//request and response handler for different routes 

// app.use('/',(req, res)=>{
//     res.send('Hello World from root route');
// })

app.get('/user',(req, res)=>{
    res.send({name:'Ankur', age: 25, city: 'Delhi' });
})

app.post('/user',(req, res)=>{
    res.send({message: 'User created successfully'});
})

app.delete('/user',(req, res)=>{
    res.send({message: 'User deleted successfully'});
})  

app.use('/test',(req, res)=>{
    res.send('Hello World from test route');
})

app.use('/profile',(req, res)=>{
    res.send('Hello World from profile route');
})

app.use('/data',(req, res)=>{
    res.send('Hello World from data route');
})

app.listen(3030,()=>{
    console.log('Server is running on port 3030');
})