const express = require('express');
const router = express.Router();

const infoCheckController = require('../controllers/info-check');

router.get('/staff-info', infoCheckController.getStaffInfo);
router.post('/staff-info', infoCheckController.postStaffInfo);
router.get('/work-info', infoCheckController.getWorkInfo);
router.get('/covid-info', infoCheckController.getCovidInfo);
router.post('/covid-info/temperature', infoCheckController.postTemperature);
router.post('/covid-info/vaccine', infoCheckController.postVaccine);
router.post('/covid-info/covidInfection', infoCheckController.postCovidInfection);
//get pdf router
router.get("/covid-info/:covidId", infoCheckController.getPDF);

module.exports = router;