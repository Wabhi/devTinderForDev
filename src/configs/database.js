// const mongoose = require("mongoose");

// const connectToDb = async () => {
//   await mongoose.connect(
//     "mongodb+srv://abhishek_dressup:CYryj5I6gnKgfIz0@cluster0.lw77rgh.mongodb.net/",
//   );
// };

// connectToDb()
//   .then(() => {
//     console.log("Database is successfully connected !!!!!!!!!");
//   })
//   .catch((error) => {
//     console.log("Database is not successfully connected !!!!!!!!");
//   });


const mongoose = require("mongoose");

const connectToDb = async () => {
  await mongoose.connect(
    "mongodb+srv://abhishek_dressup:CYryj5I6gnKgfIz0@cluster0.lw77rgh.mongodb.net/devTinder",
  );
};

module.exports = connectToDb