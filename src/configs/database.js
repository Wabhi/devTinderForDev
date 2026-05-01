const mongoose = require("mongoose");

const connectToDb = async () => {
  await mongoose.connect(
    "mongodb+srv://abhishek_dressup:Abhishek182928697@cluster0.lw77rgh.mongodb.net/devTinder",
  );
};

module.exports = connectToDb;