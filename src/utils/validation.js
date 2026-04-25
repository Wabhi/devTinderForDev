const validator = require("validator");

const validateUserDataOnSignUp = (data) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    confirmPassword,
    age,
    gender,
    city,
    hobbies,
    dob,
    photoUrl,
    skills,
    about,
  } = data;

  const errors = [];

  // ─── firstName ───────────────────────────────────────────
  if (!firstName || firstName.trim() === "") {
    errors.push("First name is required");
  } else if (firstName.trim().length < 2) {
    errors.push("First name must be at least 2 characters");
  } else if (firstName.trim().length > 50) {
    errors.push("First name cannot exceed 50 characters");
  } else if (!/^[a-zA-Z]+$/.test(firstName.trim())) {
    errors.push("First name can only contain letters");
  }

  // ─── lastName ────────────────────────────────────────────
  if (!lastName || lastName.trim() === "") {
    errors.push("Last name is required");
  } else if (lastName.trim().length < 2) {
    errors.push("Last name must be at least 2 characters");
  } else if (lastName.trim().length > 50) {
    errors.push("Last name cannot exceed 50 characters");
  } else if (!/^[a-zA-Z]+$/.test(lastName.trim())) {
    errors.push("Last name can only contain letters");
  }

  // ─── email ───────────────────────────────────────────────
  if (!email || email.trim() === "") {
    errors.push("Email is required");
  } else if (!validator.isEmail(email)) {
    errors.push("Please enter a valid email address");
  }

  // ─── phoneNumber ─────────────────────────────────────────
  if (!phoneNumber || phoneNumber.trim() === "") {
    errors.push("Phone number is required");
  } else if (!/^\+?[1-9]\d{9,14}$/.test(phoneNumber.trim())) {
    errors.push("Please enter a valid phone number (e.g. +919876543210)");
  }

  // ─── password ────────────────────────────────────────────
  if (!password || password.trim() === "") {
    errors.push("Password is required");
  } else if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    errors.push(
      "Password must be 8+ chars with uppercase, lowercase, number & special character"
    );
  }

  // ─── confirmPassword ─────────────────────────────────────
  if (!confirmPassword || confirmPassword.trim() === "") {
    errors.push("Confirm password is required");
  } else if (confirmPassword !== password) {
    errors.push("Passwords do not match");
  }

  // ─── age ─────────────────────────────────────────────────
  if (age === undefined || age === null || age === "") {
    errors.push("Age is required");
  } else if (typeof age !== "number" || !Number.isInteger(age)) {
    errors.push("Age must be a valid number");
  } else if (age < 18) {
    errors.push("You must be at least 18 years old");
  } else if (age > 100) {
    errors.push("Age cannot exceed 100");
  }

  // ─── gender ──────────────────────────────────────────────
  if (!gender || gender.trim() === "") {
    errors.push("Gender is required");
  } else if (!["male", "female", "other"].includes(gender.toLowerCase())) {
    errors.push('Gender must be "male", "female", or "other"');
  }

  // ─── city ────────────────────────────────────────────────
  if (!city || city.trim() === "") {
    errors.push("City is required");
  } else if (city.trim().length < 2) {
    errors.push("City must be at least 2 characters");
  } else if (city.trim().length > 100) {
    errors.push("City cannot exceed 100 characters");
  } else if (!/^[a-zA-Z\s]+$/.test(city.trim())) {
    errors.push("City can only contain letters and spaces");
  }

  // ─── hobbies ─────────────────────────────────────────────
  if (hobbies !== undefined) {
    if (!Array.isArray(hobbies)) {
      errors.push("Hobbies must be an array");
    } else if (hobbies.length > 10) {
      errors.push("You can add a maximum of 10 hobbies");
    } else if (hobbies.some((h) => typeof h !== "string" || h.trim() === "")) {
      errors.push("Each hobby must be a non-empty string");
    }
  }

  // ─── dob ─────────────────────────────────────────────────
  if (!dob || dob.trim() === "") {
    errors.push("Date of birth is required");
  } else if (!validator.isDate(dob, { format: "YYYY-MM-DD" })) {
    errors.push("Date of birth must be in YYYY-MM-DD format");
  } else {
    // check dob is not a future date
    const today = new Date();
    const dobDate = new Date(dob);
    if (dobDate >= today) {
      errors.push("Date of birth cannot be a future date");
    }
  }

  // ─── photoUrl ────────────────────────────────────────────
  if (photoUrl !== undefined) {
    if (!Array.isArray(photoUrl)) {
      errors.push("Photo URLs must be an array");
    } else if (photoUrl.length > 5) {
      errors.push("You can upload a maximum of 5 photos");
    } else if (photoUrl.some((url) => !validator.isURL(url))) {
      errors.push("Each photo must be a valid URL");
    }
  }

  // ─── skills ──────────────────────────────────────────────
  if (!skills || skills.length === 0) {
    errors.push("At least one skill is required");
  } else if (!Array.isArray(skills)) {
    errors.push("Skills must be an array");
  } else if (skills.length > 20) {
    errors.push("You can add a maximum of 20 skills");
  } else if (skills.some((s) => typeof s !== "string" || s.trim() === "")) {
    errors.push("Each skill must be a non-empty string");
  }

  // ─── about ───────────────────────────────────────────────
  if (about !== undefined) {
    if (typeof about !== "string") {
      errors.push("About must be a string");
    } else if (about.trim().length > 500) {
      errors.push("About section cannot exceed 500 characters");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const validateUserDataOnLogin = (data) => {
  const { email, password } = data;
  const errors = [];

  // email
  if (!email || email.trim() === "") {
    errors.push("Email is required");
  } else if (!validator.isEmail(email)) {
    errors.push("Please enter a valid email address");
  }

  // password
  if (!password || password.trim() === "") {
    errors.push("Password is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {validateUserDataOnSignUp, validateUserDataOnLogin};