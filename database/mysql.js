require("dotenv").config();
const mysql = require("mysql2/promise");

const conn = mysql.createPool({
  host: "dev-hub.c1ym8qg2aidm.ap-northeast-2.rds.amazonaws.com",
  port: process.env.DB_PORT,
  user: "admin",
  password: "devhub1234",
  database: "DevHub",
  dateStrings: true,
});

module.exports = conn;
