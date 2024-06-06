const {
  body,
  validationResult,
  header,
  param,
  query,
} = require("express-validator");

/* ----- token 유효성 검사 ----- */
const tokenValidation = () =>
  header("authorization")
    .trim()
    .notEmpty()
    .withMessage("요청 값을 다시 확인해주세요.");

/* ----- user 유효성 검사 ----- */
const emailValidation = () =>
  body("email")
    .trim()
    .isEmail()
    .notEmpty()
    .withMessage("요청 값이 유효하지 않습니다.");

const passwordValidation = () =>
  body("password")
    .trim()
    .notEmpty()
    .withMessage("요청 값이 유효하지 않습니다.");

const nameValidation = () =>
  body("nickname")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("요청 값이 유효하지 않습니다.");

/* ----- post 유효성 검사 ----- */
const categoryIdValidation = () =>
  body("categoryId")
    .isInt()
    .notEmpty()
    .withMessage("요청 값이 유효하지 않습니다.");

const titleValidation = () =>
  body("title")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("요청 값이 유효하지 않습니다.");

const contentValidation = () =>
  body("content")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("요청 값이 유효하지 않습니다.");

const linksValidation = () =>
  body("links").isArray().withMessage("요청 값이 유효하지 않습니다.");

const postQueryValidation = () => [
  query("limit").isInt({ min: 1 }).withMessage("요청 값이 유효하지 않습니다."),
  query("page").isInt({ min: 1 }).withMessage("요청 값이 유효하지 않습니다."),
  query("myPage")
    .optional()
    .isBoolean()
    .withMessage("요청 값이 유효하지 않습니다."),
  query("search")
    .optional()
    .trim()
    .isString()
    .withMessage("요청 값이 유효하지 않습니다."),
  query("categoryId")
    .optional()
    .isInt()
    .withMessage("요청 값이 유효하지 않습니다."),
];

const postIdValidation = () =>
  param("postId")
    .isInt()
    .notEmpty()
    .withMessage("파라미터 값이 유효하지 않습니다.");

/* ----- comment 유효성 검사 ----- */
const commentPostIdValidation = () =>
  body("postId").isInt().notEmpty().withMessage("요청 값이 유효하지 않습니다.");

const commentIdValidation = () =>
  body("commentId")
    .isInt()
    .notEmpty()
    .withMessage("요청 값이 유효하지 않습니다.");

/* ----- 유효성 검사 처리 함수 ----- */
const validationCheck = (req, res, next) => {
  const err = validationResult(req);

  // 유효성 검사를 통과한 경우
  if (err.isEmpty()) {
    return next();
  }
  // 통과하지 못한 경우
  else {
    return res.status(400).json({
      isSuccess: false,
      error: err.array(),
    });
  }
};

module.exports = {
  tokenValidation,
  emailValidation,
  passwordValidation,
  nameValidation,
  categoryIdValidation,
  titleValidation,
  contentValidation,
  linksValidation,
  postQueryValidation,
  postIdValidation,
  commentPostIdValidation,
  commentIdValidation,
  validationCheck,
};
