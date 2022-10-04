const Staff = require('../models/staff');
const moment = require('moment');

// GET /attendance
exports.getAttendance = (req, res, next) => {
    Staff.findById(req.staff._id)
        .then((staff) => {
            res.render('attendance/attendance', {
                pageTitle: 'Attendance',
                path: '/attendance',
                staffs: staff,
            });
        })
        .catch((error) => console.log(error));
}

// GET /attendance/checkin
exports.getCheckin = (req, res, next) => {
    Staff.findById(req.staff._id)
        .then((staff) => {
            res.render('attendance/checkin', {
                pageTitle: 'Checkin',
                path: '/attendance/checkin',
                staffs: staff,
            });
        })
        .catch((error) => console.log(error));
}

// POST /attendance/checkin
exports.postCheckin = (req, res, next) => {
    const workPlace = req.body.workplace;
    const startTime = new Date();
    const workStatus = true;

    const startWorkTime = {
        startTime: startTime,
        workPlace: workPlace,
        endTime: null,
        hours: null
    }
    req.staff
        .addStartWorkTime(startWorkTime, workStatus)
        .then((staff) => {
            res.render('attendance/get-attendance', {
                pageTitle: 'Checkin',
                path: '/attendance/checkin',
                staffs: staff
            })
        })
        .catch((error) => console.log(error));
}

// POST attendance/checkout
exports.postCheckout = (req, res) => {
    const index = req.staff.workTimes.length - 1;
    const workStart = req.staff.workTimes[index].startTime;
    const workEnd = new Date();
    const start = new moment(workStart);
    const end = new moment(workEnd);
    const duration = moment.duration(end.diff(start));
    const hours = (duration.as('minutes') / 60).toFixed(2);
    const workStatus = !req.staff.workStatus;
    const newEndTime = {
        endTime: end,
        hours: hours
    };
    req.staff
        .addEndTime(newEndTime, workStatus)
        .then((staff) => {
            res.render('attendance/checkout', {
                pageTitle: 'Checkout',
                path: 'attendance/checkout',
                staffs: staff,
            })
        })
        .catch((error) => { console.log(error); });
}

// GET attendance/leave
exports.getLeave = (req, res) => {
    Staff.findById(req.staff._id)
        .then((staff) => {
            res.render('attendance/leave', {
                pageTitle: 'Leave',
                path: 'attendance/leave',
                staffs: staff,
            })
        })
        .catch((error) => { console.log(error); });
}

// POST /attendance/leave
exports.postLeave = (req, res, next) => {
    const startLeaveDay = new Date(req.body.startLeave);
    const endLeaveDay = new Date(req.body.endLeave);
    const timeLeave = req.body.timeLeave;
    const totalDateLeave = timeLeave / 8;
    const reason = req.body.reason;

    const leaveInfoList = {
        startLeaveDay: startLeaveDay,
        endLeaveDay: endLeaveDay,
        totalDateLeave: totalDateLeave,
        timeLeave: timeLeave,
        reason: reason
    }
    req.staff
        .addLeaveInfoList(leaveInfoList)
        .then((staff) => {
            console.log('staff1', staff);
            res.redirect('/work-info');
        })
        .catch((error) => { console.log(error); });
}