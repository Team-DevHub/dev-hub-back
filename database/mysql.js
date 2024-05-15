require("dotenv").config();
const mysql = require("mysql2/promise");

const conn = mysql.createPool({
  host: "localhost",
  port: process.env.DB_PORT,
  user: "root",
  password: "root",
  database: "DevHub",
  dateStrings: true,
});

module.exports = conn;
