const express = require("express");
const app = express();

const {
  adminAuthMiddleware,
  userAuthMiddleware,
} = require("./middlewares/Auth");

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

// app.use(
//   "/user",
//   [(req, res, next) => {
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
//   },]
// );

// app.get('/user', (req, res, next)=>{
// next()
// })
// app.get('/user', (req, res, next)=>{
// next()
// })

app.use("/admin", adminAuthMiddleware);

app.get("/admin/getAllData", (req, res) => {
  res.send("Get all data !!!!!!!!!!!!!!!!!!!!!!");
});

app.get("/admin/deleteTheUser", (req, res) => {
  res.send("User got deleted !!!!!!!!!!!!!!!!!!!!!!");
});

app.get("/admin/getAdminDashboard", (req, res) => {
  res.send("Get Admin dashboard !!!!!!!!!!!!!!!!!!!!!!");
});

app.get("/admin/profile", (req, res) => {
  res.send("Get admin profile !!!!!!!!!!!!!!!!!!!!!!");
});

app.use("/user", userAuthMiddleware);

app.get("/user/login", (req, res) => {
  res.send("User got logged in successfully!!!!!!!!!!!!!!");
});

app.listen(3030, () => {
  console.log("Server is running on port 3030");
});
