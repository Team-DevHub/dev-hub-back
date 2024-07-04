const { verifyAccessToken } = require("./verifyToken");

const tokenHandler = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    const verifyResult = verifyAccessToken(token);

    req.userId = verifyResult.userId;

    next();
  } catch (err) {
    res.status(err.statusCode || 500).json({
      isSuccess: false,
      message: err.message,
    });
  }
};

module.exports = tokenHandler;
