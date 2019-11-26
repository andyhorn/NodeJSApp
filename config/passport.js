const LocalStrategy = require('passport-local').Strategy;
const mysql = require('mysql');
const User = require('../models/user');
const dotenv = require('dotenv');
dotenv.config();

const MYSQL_DB_HOST = process.env.MYSQL_DB_HOST || 'localhost'; // Use the .env file or enter your db address here
const MYSQL_DB_USER = process.env.MYSQL_DB_USER || 'root';      // Use the .evn file or enter your db username here
const MYSQL_DB_PASSWORD = process.env.MYSQL_DB_PASSWORD || '';  // Use the .env file or enter your db password here

var db = mysql.createConnection({
    host: MYSQL_DB_HOST, 
    user: MYSQL_DB_USER,
    password: MYSQL_DB_PASSWORD
});

module.exports = function(passport) {
    // Passport session setup

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        db.query("SELECT * FROM Users WHERE id = ?", [id], function(error, results) {
            done(error, results[0]);
        });
    });

    // Passport Local Registration
    passport.use('local-register', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done) {
        db.query("SELECT * FROM Users WHERE 'email' = '?'", [email], function(error, results) {
            if (error) {
                return done(error);
            }
            if (results.length > 0) {
                return done(null, false, "Email address already in use.");
            }
            else {
                let newUser = new User();
                newUser.email = email;
                newUser.setHashedPassword(password);

                db.query("INSERT INTO Users (email, password) VALUES (?, ?)", [newUser.email, newUser.password], function(error, results) {
                    newUser.id = results.insertId;
                    return done(null, newUser);
                });
            }
        });
    }));

    // Passport local login
    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done) {
        db.query("SELECT * FROM Users WHERE 'email' = '?'", [email], function(error, results) {
            if (error) {
                return done(error);
            }
            if (results.length == 0) {
                return done(null, false, "No user found with that email.");
            }

            let foundUser = new User();
            foundUser.email = email;
            foundUser.password = results[1];

            if (!foundUser.verifyPassword(password)) {
                return done(null, false, "Incorrect password");
            }

            return done(null, foundUser);
        })
    }));
}