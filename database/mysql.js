require("dotenv").config();
const mysql = require("mysql2/promise");

const conn = mysql.createPool({
  host: "localhost",
  port: "9999",
  user: "root",
  password: "root",
  database: "dev-hub",
  dateStrings: true,
});

module.exports = conn;
