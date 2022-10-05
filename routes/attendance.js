const express = require('express');
const router = express.Router();

const attendanceController = require('../controllers/attendance');

router.get('/attendance', attendanceController.getAttendance);
router.get('/attendance/checkin', attendanceController.getCheckin);
router.post('/attendance/checkin', attendanceController.postCheckin);
router.post('/attendance/checkout', attendanceController.postCheckout);
router.get('/attendance/leave', attendanceController.getLeave);
router.post('/attendance/leave', attendanceController.postLeave);

module.exports = router;