exports.join = `INSERT INTO users (id, name, email, password, salt) VALUES (?, ?, ?, ?, ?)`;
exports.getUserByEmail = `SELECT * FROM users WHERE email = ?`;
exports.checkEmail = `SELECT COUNT(*) as count FROM users WHERE email = ?`;
