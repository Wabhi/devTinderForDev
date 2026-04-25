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

app.get("/myself", (req, res) => {
  throw new Error("fetching some problem here.");
  res.send("Data for myself is sent!!!!!!!!!!!!!!!!!!");
});

app.get("/", (err, req, res, next) => {
  // log error message here.........................
  if (err) {
    res.status(500).send("something went wrong");
  }
});



// feed user api
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong!!!!!!!!!!");
  }
});

// delete a user
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete({ _id: userId });
    res.send("User deleted successfully !!!!!!!!!!");
  } catch (err) {
    res.status(400).send("Something went wrong!!!!!!!!!!");
  }
});

// update user data
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User data is successfully updated!!!!!!");
  } catch (err) {
    res.status(400).send("Something went wrong!!!!!!!!!!");
  }
});