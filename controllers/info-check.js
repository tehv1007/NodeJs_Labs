const fs = require('fs');
const path = require('path');
const PdfFile = require('pdfkit');
const fileHelper = require('../Util/file');
const Staff = require('../models/staff');
const Methods = require('../Util/auxiliary');

// GET /staff-info
exports.getStaffInfo = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/login");
    } else {
        Staff.findById(req.staff._id)
            .then(staff => {
                res.render('info-check/staff-info', {
                    path: '/staff-info',
                    pageTitle: 'Staff Info',
                    staffs: staff,
                })
            })
            .catch(err => console.log('error', err));
    }
}

// POST /staff-info
exports.postStaffInfo = (req, res, next) => {
    fileHelper.deleteFile(req.staff.imageUrl);
    const avatar = req.file;
    if (!avatar) {
        console.log("No avatar image found!");
        return res.status(422).render("info-check/staff-info", {
            path: "/staff-info",
            pageTitle: "Staff Info",
            staffs: req.session.staff,
        });
    }
    const image = avatar.path;
    req.staff.imageUrl = image;
    req.staff
        .save()
        .then((result) => {
            console.log("postStaffInfo", result);
            res.redirect("/staff-info");
        })
        .catch((err) => console.log(err));
};

// GET /work-info
exports.getWorkInfo = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/login");
    } else {
        const page = +req.query.page || 1;
        const ITEMS_PER_PAGE = +req.query.rowpage || 3;
        let totalItems;
        req.staff.calculateTotalTime(req.staff).then((staff) => {
            const month = req.body.month;
            const salary = Methods.calculateSalary(month, staff);
            const dataWork = staff.workTimes.slice(
                (page - 1) * ITEMS_PER_PAGE,
                page * ITEMS_PER_PAGE
            );
            totalItems = staff.workTimes.length;

            res.render("info-check/work-info", {
                path: "/work-info",
                pageTitle: "Working Info",
                staffs: staff,
                dataWork: dataWork,
                ITEMS_PER_PAGE: ITEMS_PER_PAGE,
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
                salary: salary,
                month: month,
            });
        });
    }
};

// GET make pdf files
exports.getPDF = (req, res, next) => {
    const covidId = req.params.covidId;
    Staff.findById(covidId)
        .then((staff) => {
            const pdfName = staff.name + '-' + covidId + ".pdf";
            const pdfPath = path.join("data", "pdfFiles", pdfName);
            const pdfDoc = new PdfFile();
            res.setHeader('Content-Type', 'application/pdf');
            pdfDoc.pipe(fs.createWriteStream(pdfPath));
            pdfDoc.pipe(res);

            pdfDoc.fontSize(26).text("Staff - Covid", { underline: true });
            pdfDoc.text("---------------");
            pdfDoc.text("Ten nhan vien : " + staff.name);
            pdfDoc.text("Nhiet do: " + staff.bodyTemperature[0]);
            pdfDoc.text("Vaccine mui 1: " + staff.vaccineInfo[0].vaccineName1);
            pdfDoc.text("Ngay tiem: " + staff.vaccineInfo[0].date1.toLocaleDateString());
            pdfDoc.text("Vaccine mui 2: " + staff.vaccineInfo[0].vaccineName2);
            pdfDoc.text("Ngay tiem : " + staff.vaccineInfo[0].date2.toLocaleDateString());
            pdfDoc.text("---------------");
            pdfDoc.end();
        })
        .catch((err) => console.log(err));
};

// GET /covid-info
exports.getCovidInfo = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/login");
    } else {
        Staff.find({ role: "staff" })
            .then((staff) => {
                res.render("info-check/covid-info", {
                    pageTitle: "Covid Info",
                    path: "/covid-info",
                    staffs: staff,
                    role: req.session.staff.role,
                });
            })
            .catch((err) => console.log(err));
    }
};

// POST /covid-info create temperature
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

// POST /covid-info create vaccine information
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

// POST /covid-info create covid infection information
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