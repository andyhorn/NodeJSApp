const LocalStrategy = require('passport-local').Strategy;
const mysql = require('mysql');

var dotenv = require('dotenv');
dotenv.config();

const MYSQL_DB_HOST = process.env.MYSQL_DB_HOST || 'localhost'; // Use the .env file or enter your db address here
const MYSQL_DB_USER = process.env.MYSQL_DB_USER || 'root';      // Use the .evn file or enter your db username here
const MYSQL_DB_PASSWORD = process.env.MYSQL_DB_PASSWORD || '';  // Use the .env file or enter your db password here

var connection = mysql.createConnection({
    host: MYSQL_DB_HOST, 
    user: MYSQL_DB_USER,
    password: MYSQL_DB_PASSWORD
})