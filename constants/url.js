const URL = {
  github_authorize: "https://github.com/login/oauth/authorize",
  github_token: "https://github.com/login/oauth/access_token",
  github_getEmail: "https://api.github.com/user/emails",
  github_getUser: "https://api.github.com/user",
  github_deleteUser: `https://api.github.com/applications/${process.env.GITHUB_CLIENT_ID}/grant`,
};

module.exports = URL;
