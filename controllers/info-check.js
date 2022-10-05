const Staff = require('../models/staff');
const { timeConvert, calculateWorkedTime, calculateSalary } = require('../Util/auxiliary.js');

exports.getStaffInfo = (req, res, next) => {
    Staff.findById(req.staff._id)
        .then(staff => {
            console.log('staffs-info', staff.workTime);
            res.render('info-check/staff-info', {
                path: '/staff-info',
                pageTitle: 'Staff Info',
                staffs: staff
            })
        })
        .catch(err => console.log('error', err));
}

exports.postEditStaff = (req, res) => {
    req.staff.imageUrl = req.body.image;
    req.staff
        .save()
        .then(() => res.redirect('/staff-info'))
        .catch((error) => console.log(error));
}

exports.getWorkInfo = (req, res, next) => {
    console.log('work-info', req.staff);
    req.staff
        .calculateTotalTime(req.staff)
        .then((staff) => {
            const salary = calculateSalary(req.body.month, staff);
            res.render('info-check/work-info', {
                path: '/work-info',
                pageTitle: 'Working Info',
                staffs: staff,
                salary: salary
            })
        })
}

exports.postWorkInfo = (req, res, next) => {
    const salary = calculateSalary(req.body.month, req.staff);
    res.render('info-check/work-info', {
        path: '/work-info',
        pageTitle: 'Working Info',
        staffs: req.staff,
        salary: salary
    })
}

exports.getCovidInfo = (req, res, next) => {
    res.render('info-check/covid-info', {
        pageTitle: 'Covid Info',
        path: '/covid-info',
    });
};

exports.postTemperature = (req, res, next) => {
    const temperature = req.body.temperature;
    const date = req.body.date;
    const time = req.body.time;
    const bodyTemperature = {
        temperature: temperature,
        time: time,
        date: date
    }
    req.staff
        .addTemperature(bodyTemperature)
        .then((result) => {
            console.log('created bodyTemperature');
            res.redirect('/covid-info');
        })
        .catch((error) => console.log(error));
}

exports.postVaccine = (req, res, next) => {
    const vaccineName1 = req.body.vaccineName1;
    const date1 = req.body.date1;
    const vaccineName2 = req.body.vaccineName2;
    const date2 = req.body.date2;

    const vaccineInfo = {
        vaccineName1: vaccineName1,
        date1: date1,
        vaccineName2: vaccineName2,
        date2: date2
    };
    req.staff
        .addVaccineInfo(vaccineInfo)
        .then((result) => {
            console.log('created vaccineInfo');
            res.redirect('/covid-info');
        })
        .catch(err => console.log(err));
}

exports.postCovidInfection = (req, res, next) => {
    const positiveDate = req.body.covidInfection;
    const recoverDate = req.body.getWell;
    const covidInfection = {
        positiveDate: positiveDate,
        recoverDate: recoverDate,
    }
    req.staff
        .addCovidInfection(covidInfection)
        .then((result) => {
            console.log('created covidInfection');
            res.redirect('/covid-info');
        })
        .catch((error) => console.log(error));
}