const express = require('express');
const router = express.Router();

const infoCheckController = require('../controllers/info-check');

router.get('/staff-info', infoCheckController.getStaffInfo);
router.post('/staff-info/edit', infoCheckController.postEditStaff);
router.get('/work-info', infoCheckController.getWorkInfo);
router.post('/work-info', infoCheckController.postWorkInfo);
router.get('/covid-info', infoCheckController.getCovidInfo);
router.post('/covid-info/temperature', infoCheckController.postTemperature);
router.post('/covid-info/vaccine', infoCheckController.postVaccine);
router.post('/covid-info/covidInfection', infoCheckController.postCovidInfection);

module.exports = router;