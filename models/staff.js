const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const staffSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: {}, required: true },
  role: { type: String, required: true },
  doB: { type: Date, required: true },
  salaryScale: { type: Number, required: true },
  startDate: { type: Date, required: true },
  department: { type: String, required: true },
  annualLeave: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  workStatus: { type: Boolean },
  workTimes: [
    {
      startTime: { type: Date },
      workPlace: { type: String },
      endTime: { type: Date },
      hours: { type: Number }
    }
  ],
  totalTimeWork: { type: Number },
  isConfirm: { type: Boolean },
  leaveInfoList: [
    {
      startLeaveDay: { type: Date },
      endLeaveDay: { type: Date },
      totalDateLeave: { type: Number },
      timeLeave: { type: Number },
      reason: { type: String },
    }
  ],
  bodyTemperature: [
    {
      temperature: { type: Number },
      date: { type: Date },
      time: { type: String }
    }
  ],
  vaccineInfo: [
    {
      vaccineName1: { type: String },
      date1: { type: Date },
      vaccineName2: { type: String },
      date2: { type: Date }
    }
  ],
  covidInfection: [
    {
      positiveDate: { type: Date },
      recoverDate: { type: Date }
    }
  ]
});

// Thêm thời gian điểm danh bắt đầu làm
staffSchema.methods.addStartWorkTime = function (startWorkTime, workStatus) {
  const updateWorkTime = [...this.workTimes];
  updateWorkTime.push(startWorkTime);
  this.workTimes = updateWorkTime;
  this.workStatus = workStatus;
  return this.save();
};

// Thêm thời gian kết thúc làm: cập nhật trạng thái làm việc, 
// tính toán số giờ làm mỗi phiên checkin - checkout
staffSchema.methods.addEndTime = function (newEndTime, workStatus) {
  if (this.workTimes[this.workTimes.length - 1].endTime === null) {
    const lastWorkTimeIndex = this.workTimes.length - 1;

    this.workStatus = workStatus;
    this.workTimes[lastWorkTimeIndex].endTime = newEndTime.endTime;
    this.workTimes[this.workTimes.length - 1].hours = newEndTime.hours;
    return this.save();
  } return this.save();
};

// Thêm danh sách nghỉ phép
staffSchema.methods.addLeaveInfoList = function (leaveInfoList) {
  const updateLeaveInfoList = [...this.leaveInfoList];
  updateLeaveInfoList.push(leaveInfoList);
  this.leaveInfoList = updateLeaveInfoList;
  this.annualLeave = this.annualLeave - leaveInfoList.totalDateLeave;
  return this.save();
}

// Tính toán tổng thời gian làm việc
staffSchema.methods.calculateTotalTime = function (totalTime) {
  let total = 0;

  totalTime.workTimes.forEach((workOneTime) => {
    return (total += new Number(workOneTime.hours));
  });

  this.totalTimeWork = total.toFixed(2);
  return this.save();
}

// Đăng ký thông tin thân nhiệt (kèm ngày, giờ đăng ký)
staffSchema.methods.addTemperature = function (bodyTemperature) {
  const updateTemperature = [...this.bodyTemperature];
  updateTemperature.push(bodyTemperature);
  this.bodyTemperature = updateTemperature;
  return this.save();
}

// Đăng ký thông tin tiêm vaccine
staffSchema.methods.addVaccineInfo = function (vaccineInfo) {
  const updateVaccineInfo = [...this.vaccineInfo];
  updateVaccineInfo.push(vaccineInfo);
  this.vaccineInfo = updateVaccineInfo;
  return this.save();
}

// Đăng ký thông tin dương tính với covid
staffSchema.methods.addCovidInfection = function (covidInfection) {
  const updateCovidInfection = [...this.covidInfection];
  updateCovidInfection.push(covidInfection);
  this.covidInfection = updateCovidInfection;
  return this.save();
}

module.exports = mongoose.model('Staff', staffSchema);
