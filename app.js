const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const multer = require('multer');
const csrf = require("csurf");
const MongoDBStore = require('connect-mongodb-session')(session);
const Staff = require('./models/staff');

const app = express();
dotenv.config();

//Routes import
const homeRoutes = require('./routes/home');
const attendanceRoutes = require('./routes/attendance');
const infoCheckRoutes = require('./routes/info-check');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const errorController = require('./controllers/error');

//Mongodb connection states
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

// Store sessions in MongoDB
const store = new MongoDBStore({
  uri: process.env.MONGODB,
  collection: "sessions",
});

//CSRF protection
const csrfProtection = csrf({});

//Store images and files
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().slice(0, 13) + "-" + file.originalname);
  },
});

//Filter suitable image file format
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// View engine
app.set('view engine', 'ejs');
app.set('views', 'views');

//Middlewares using declaration
app.use(cookieParser())
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"));

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

app.use(csrfProtection);

app.use((req, res, next) => {
  if (!req.session.staff) {
    res.locals.role = false;
    return next();
  }
  Staff.findById(req.session.staff._id)
    .then((staff) => {
      req.staff = staff;
      if (staff.role === "admin") {
        res.locals.role = "admin";
        return next();
      }
      res.locals.role = "staff";
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(homeRoutes);
app.use(attendanceRoutes);
app.use(infoCheckRoutes)
app.use(adminRoutes);
app.use(authRoutes);
app.use(errorController.get404);

mongoose
  .connect(process.env.MONGODB)
  .then(result => {
    Staff.findOne({ username: "admin" }).then(staff => {
      if (!staff) {
        const adminStaff = new Staff({
          username: "admin",
          password: "123456",
          role: "admin",
          name: 'Nguyen Van A',
          doB: new Date(1989, 07, 10),
          salaryScale: 1.5,
          startDate: new Date(2022, 07, 10),
          department: 'IT',
          annualLeave: 12,
          imageUrl: './images/admin.jpg',
          workStatus: null,
          isConfirm: null,
          workTimes: [],
          totalTimeWork: null,
          leaveInfoList: [],
          bodyTemperature: [],
          vaccineInfo: [],
          covidInfection: []
        });
        adminStaff.save();
      }
    });
    Staff.findOne({ username: "staff" }).then(staff => {
      if (!staff) {
        const normalStaff = new Staff({
          username: "staff",
          password: "123456",
          role: "staff",
          name: 'Nguyen Van B',
          doB: new Date(1989, 07, 10),
          salaryScale: 1.5,
          startDate: new Date(2022, 07, 10),
          department: 'HR',
          annualLeave: 12,
          imageUrl: './images/staff1.jpg',
          workStatus: null,
          isConfirm: null,
          workTimes: [],
          totalTimeWork: null,
          leaveInfoList: [],
          bodyTemperature: [],
          vaccineInfo: [],
          covidInfection: []
        });
        normalStaff.save();
      }
    });
    Staff.findOne({ username: "staff2" }).then(staff => {
      if (!staff) {
        const anotherStaff = new Staff({
          username: "staff2",
          password: "123456",
          role: "staff",
          name: 'Nguyen Van C',
          doB: new Date(1989, 07, 10),
          salaryScale: 1.5,
          startDate: new Date(2022, 07, 10),
          department: 'HR',
          annualLeave: 12,
          imageUrl: './images/staff2.jpg',
          workStatus: null,
          isConfirm: null,
          workTimes: [],
          totalTimeWork: null,
          leaveInfoList: [],
          bodyTemperature: [],
          vaccineInfo: [],
          covidInfection: []
        });
        anotherStaff.save();
      }
    });
    app.listen(process.env.PORT || 8080, '0.0.0.0', () => {
      connect();
      console.log("Connected to backend.");
    });
  })
  .catch(err => {
    console.log(err);
  });
