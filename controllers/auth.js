const Staff = require("../models/staff");
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false,
        errorMessage: "",
    });
}

exports.postLogin = (req, res, next) => {
    Staff.findOne({ username: req.body.username })
        .then((staff) => {
            // username checking
            if (!staff) {
                return res.render('auth/login', {
                    path: '/login',
                    pageTitle: 'Login',
                    errorMessage: 'User not found!',
                });
            }

            // Password checking
            const isPasswordCorrect = req.body.password === staff.password ? true : false;
            if (!isPasswordCorrect) {
                return res.render('auth/login', {
                    path: '/login',
                    pageTitle: 'Login',
                    errorMessage: 'Wrong password or username!',
                });
            }
            req.session.isLoggedIn = true;
            req.session.staff = staff;
            req.session.save((err) => {
                return res.redirect('/');
            });
        })
        .catch((error) => {
            console.log(error);
        });
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
}
