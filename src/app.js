const express = require("express");
const app = express();

//request and response handler for different routes

// app.use('/',(req, res)=>{
//     res.send('Hello World from root route');
// })

// app.get('/user',(req, res)=>{
//     res.send({name:'Ankur', age: 25, city: 'Delhi' });
// })

// app.post('/user',(req, res)=>{
//     res.send({message: 'User created successfully'});
// })

// app.delete('/user',(req, res)=>{
//     res.send({message: 'User deleted successfully'});
// })

// app.use('/test',(req, res)=>{
//     res.send('Hello World from test route');
// })

// app.use('/profile',(req, res)=>{
//     res.send('Hello World from profile route');
// })

// app.use('/data',(req, res)=>{
//     res.send('Hello World from data route');
// })

// app.use(
//   "/user",
//   (req, res, next) => {
//     console.log("1st Route handler");
//     next();
//     res.send("Response for route handler 1.");
//   },
//   (req, res, next) => {
//     console.log("2nd Route handler");
//     next();
//     res.send("Response for route handler 2.");
//   },
//   (req, res, next) => {
//     console.log("2nd Route handler");
//     next();
//     res.send("Response for route handler 3.");
//   },
//   (req, res, next) => {
//     console.log("2nd Route handler");
//     res.send("Response for route handler 4.");
//   },
// );

app.use(
  "/user",
  [(req, res, next) => {
    console.log("1st Route handler");
    next();
    res.send("Response for route handler 1.");
  },
  (req, res, next) => {
    console.log("2nd Route handler");
    next();
    res.send("Response for route handler 2.");
  },
  (req, res, next) => {
    console.log("2nd Route handler");
    next();
    res.send("Response for route handler 3.");
  },
  (req, res, next) => {
    console.log("2nd Route handler");
    res.send("Response for route handler 4.");
  },]
);

app.listen(3030, () => {
  console.log("Server is running on port 3030");
});
