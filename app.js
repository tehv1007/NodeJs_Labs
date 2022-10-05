const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const errorController = require('./controllers/error');
const Staff = require('./models/staff');

const app = express();
dotenv.config();

app.set('view engine', 'ejs');
app.set('views', 'views');

//Routes import
const homeRoutes = require('./routes/home');
const attendanceRoutes = require('./routes/attendance');
const infoCheckRoutes = require('./routes/info-check');

//mongodb connection states
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

//middlewares
app.use((req, res, next) => {
  Staff.findById('633d39f21900c393d5f6d816')
    .then(staff => {
      req.staff = staff;
      next();
    })
    .catch(err => console.log(err));
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(homeRoutes);
app.use(attendanceRoutes);
app.use(infoCheckRoutes)
app.use(errorController.get404);

mongoose
  .connect(process.env.MONGODB)
  .then(result => {
    Staff.findOne().then(staff => {
      if (!staff) {
        const staff = new Staff({
          name: 'Nguyen Van A',
          doB: new Date(1989, 07, 10),
          salaryScale: 1.5,
          startDate: new Date(2022, 07, 10),
          department: 'IT',
          annualLeave: 12,
          imageUrl: '../images/staff1.jpg',
          workStatus: null,
          workTime: [],
          totalTimeWork: null,
          leaveInfoList: [],
          bodyTemperature: [],
          vaccineInfo: [],
          covidInfection: []
        });
        staff.save();
      }
    });
    app.listen(3000, () => {
      connect();
      console.log("Connected to backend.");
    });
  })
  .catch(err => {
    console.log(err);
  });
