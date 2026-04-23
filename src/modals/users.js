const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  password: {
    type: String,
  },
  confirmPassword: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
  city: {
    type: String,
  },
  hobbies: {
    type: Array,
  },
  dob:{
    type:String
  }
});

// module.exports = mongoose.model("Users",userSchema)
const User = mongoose.model("Users",userSchema)
module.exports = User