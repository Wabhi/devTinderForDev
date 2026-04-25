const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name cannot exceed 50 characters"],
      match: [/^[a-zA-Z]+$/, "First name can only contain letters"],
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
      maxlength: [50, "Last name cannot exceed 50 characters"],
      match: [/^[a-zA-Z]+$/, "Last name can only contain letters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: "Please enter a valid email address",
      },
    },

    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      match: [
        /^\+?[1-9]\d{9,14}$/,
        "Please enter a valid phone number (e.g. +919876543210)",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },

    confirmPassword: {
      type: String,
      required: [true, "Confirm password is required"],
      validate: {
        validator: function (v) {
          return v === this.password;
        },
        message: "Passwords do not match",
      },
    },

    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [18, "You must be at least 18 years old"],
      max: [100, "Age cannot exceed 100"],
    },

    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: {
        values: ["male", "female", "other"],
        message: '"{VALUE}" is not a valid gender. Choose male, female, or other',
      },
    },

    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      minlength: [2, "City must be at least 2 characters"],
      maxlength: [100, "City cannot exceed 100 characters"],
      match: [/^[a-zA-Z\s]+$/, "City can only contain letters and spaces"],
    },

    hobbies: {
      type: [String],
      validate: {
        validator: (v) => v.length <= 10,
        message: "You can add a maximum of 10 hobbies",
      },
    },

    dob: {
      type: String,
      required: [true, "Date of birth is required"],
      validate: {
        validator: (v) => validator.isDate(v, { format: "YYYY-MM-DD" }),
        message: "Date of birth must be in YYYY-MM-DD format",
      },
    },

    photoUrl: {
      type: [String],
      validate: [
        {
          validator: (v) => v.length <= 5,
          message: "You can upload a maximum of 5 photos",
        },
        {
          validator: (urls) => urls.every((url) => validator.isURL(url)),
          message: "Each photo must be a valid URL",
        },
      ],
    },

    skills: {
      type: [String],
      required: [true, "At least one skill is required"],
      validate: [
        {
          validator: (v) => v.length >= 1,
          message: "Please add at least one skill",
        },
        {
          validator: (v) => v.length <= 20,
          message: "You can add a maximum of 20 skills",
        },
        {
          validator: (v) => v.every((s) => s.trim().length > 0),
          message: "Skills cannot contain empty values",
        },
      ],
    },

    about: {
      type: String,
      trim: true,
      default: "This is default about of user.",
      maxlength: [500, "About section cannot exceed 500 characters"],
    },
  },
  { timestamps: true }
);

// ✅ Step 1 — comparePassword method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Step 2 — pre-save hook
userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = undefined;
});

// ✅ Step 3 — model always last
const User = mongoose.model("User", userSchema);
module.exports = User;