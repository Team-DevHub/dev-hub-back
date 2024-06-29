exports.githubJoin = `INSERT INTO users (id, name, email, password, salt, login_type, github_token) VALUES (?, ?, ?, ?, ?, ?, ?)`;
exports.getGithubToken = `SELECT github_token FROM users WHERE id = ?`;
