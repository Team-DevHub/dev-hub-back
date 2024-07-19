exports.githubJoin = `INSERT INTO users (id, name, email, password, salt, login_type, github_token) VALUES (?, ?, ?, ?, ?, ?, ?)`;
exports.getGithubToken = `SELECT github_token FROM users WHERE id = ?`;

exports.googleJoin = `INSERT INTO users (id, name, email, password, salt, login_type, google_token) VALUES (?, ?, ?, ?, ?, ?, ?)`;
exports.getGoogleRefreshToken = "SELECT google_token FROM users WHERE id = ?";
exports.updateGoogleToken = `UPDATE users SET google_token = ? WHERE id = ?`;
