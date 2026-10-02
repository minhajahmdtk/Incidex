const express = require("express");
const cors = require("cors");

const server = express();
const port = 3000;

require("dotenv").config();

const db = require("./config/db");
db();

//-------------------
// Routes
//-------------------

//User routes

const authRouter = require("./router/authRouter");
const userRouter = require("./router/userRouter");

//Admin routes

const adminRouter = require("./router/adminRouter");
const adminAuthRouter = require("./router/adminAuthRouter");
const adminDashboardRouter = require("./router/adminDashboardRouter");
const adminNotificationRouter = require("./router/adminNotificationRouter");

//case Routes

const caseRouter = require("./router/caseRouter");

//Notification Routes

const userNotificationRouter = require("./router/userNotificationRouter");

//Feedback Routes

const userFeedbackRouter = require("./router/userFeedbackRouter");

//-------------------
//    Models
//-------------------

//user Model

const userModel = require("./models/user");

//admin Model

const adminModel = require("./models/admin");

//case Model

const crimeReport = require("./models/crimeReport");


//-------------------
// Middleware
//-------------------

server.use(cors());
server.use(express.json());


//-------------------
// Mount Routes
//-------------------

//Mount user route

server.use("/user", authRouter);
server.use("/user", userRouter);

//Mount admin route

server.use("/admin", adminRouter);
server.use("/admin", adminAuthRouter);

//Mount admin dashboard route

server.use("/admin/dashboard", adminDashboardRouter);

//Mount admin notification route

server.use("/admin/notifications", adminNotificationRouter);

//Mount case route

server.use("/cases", caseRouter);

//Mount notification route

server.use("/user-notifications", userNotificationRouter);

//Mount feedback route

server.use("/feedback", userFeedbackRouter);


server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});