exports.join = `INSERT INTO users (name, email, password, salt) VALUES (?, ?, ?, ?)`;
exports.getUserByEmail = `SELECT * FROM users WHERE email = ?`;
