const crypto = require("crypto");

const defaultSalt = crypto.randomBytes(32).toString("base64");

exports.getHashPassword = (password, salt) => {
  // 로그인 - 비밀번호 검증 시
  if (salt) {
    const hashPassword = crypto
      .pbkdf2Sync(password, salt, 10000, 32, "sha512")
      .toString("base64");

    return { hashPassword, salt };
  }
  // 회원가입, 비밀번호 찾기 - 비밀번호 암호화 시
  else {
    const hashPassword = crypto
      .pbkdf2Sync(password, defaultSalt, 10000, 32, "sha512")
      .toString("base64");

    return { hashPassword, salt: defaultSalt };
  }
};
