const Staff = require('../models/staff');

// GET /admin/staff
exports.getStaffManager = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/login");
    } else {
        Staff.find({ role: "staff" })
            .then((staff) => {
                res.render("admin/manage", {
                    pageTitle: "Staff Manager",
                    path: "/admin/staff",
                    staffs: staff,
                });
            })
            .catch((err) => console.log(err));
    }
};

// POST /admin/staff
exports.postStaffManager = (req, res, next) => {
    if (req.body.staff === 'none') {
        return res.redirect('/admin');
    }
    const selectedMonth = +req.body.month;
    Staff.find({ role: 'staff' }).then((staffs) => {
        Staff.findById(req.body.staff).then((staff) => {
            const totalTimeWorked = staff.totalTimeWork;
            const workTimes = staff.workTimes.filter((workTime) => {
                return +workTime.startTime.getMonth() + 1 === selectedMonth;
            });
            if (workTimes.length === 0) {
                return res.render('admin/get-info', {
                    pageTitle: 'Staff Manager',
                    path: '/admin/staff',
                    workTimes: workTimes,
                    staff: staff,
                    month: selectedMonth,
                    totalTimeWorked: totalTimeWorked,
                });
            } else {
                return res.render('admin/get-info', {
                    pageTitle: 'Staff Manager',
                    path: '/admin/staff',
                    workTimes: workTimes,
                    staff: staff,
                    month: selectedMonth,
                    totalTimeWorked: totalTimeWorked,
                })
            }
        })
            .catch((error) => { console.log(error); });
    })
        .catch((error) => { console.log(error); });
}

exports.postDeleteWorkTime = (req, res, next) => {
    const staffId = req.body.staffId;
    const workTimeId = req.body.workTime;
    Staff.findById(staffId)
        .then((staff) => {
            console.log("staffId", staffId);
            const deleteWorkTime = staff.workTimes.filter((workTime) => {
                return workTime._id.toString() !== workTimeId.toString();
            });
            staff.workTimes = deleteWorkTime;
            return staff.save();
        })
        .then((result) => {
            res.redirect("/admin/staff");
        })
        .catch((err) => console.log(err));
};

exports.postIsConfirm = (req, res, next) => {
    const staffId = req.body.staffId;
    Staff.findById(staffId)
        .then((staff) => {
            staff.isConfirm = true;
            return staff.save();
        })
        .then((result) => {
            res.redirect("/admin/staff");
        })
        .catch((err) => console.log(err));
};
