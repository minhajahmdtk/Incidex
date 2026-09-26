const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const Admin = require("./models/Admin");

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "admin@incidex.com";
    const password = "Admin_incidex@001";

    const existingAdmin = await Admin.findOne({
      email: email,
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const admin = new Admin({
      email: email,
      password: hashedPassword,
    });

    await admin.save();

    console.log("Admin created successfully");
    console.log("Email:", email);
    console.log("Password:", password);

    process.exit(0);

  } catch (error) {
    console.log("Error:", error.message);
    process.exit(1);
  }
};

createAdmin();