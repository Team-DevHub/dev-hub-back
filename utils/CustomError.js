class CustomError extends Error {
  statusCode = null;

  constructor(code, message) {
    super(message);
    this.statusCode = code;
  }
}

module.exports = CustomError;
