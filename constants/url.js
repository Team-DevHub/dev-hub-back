const URL = {
  github_authorize: "https://github.com/login/oauth/authorize",
  github_token: "https://github.com/login/oauth/access_token",
  github_getEmail: "https://api.github.com/user/emails",
  github_getUser: "https://api.github.com/user",
  github_deleteUser: `https://api.github.com/applications/${process.env.GITHUB_CLIENT_ID}/grant`,

  google_authorize: `https://accounts.google.com/o/oauth2/v2/auth`,
  google_token: "https://oauth2.googleapis.com/token",
  google_getUser: "https://www.googleapis.com/userinfo/v2/me",
  google_deleteUser: `https://accounts.google.com/o/oauth2/revoke?token=`,
};

module.exports = URL;
