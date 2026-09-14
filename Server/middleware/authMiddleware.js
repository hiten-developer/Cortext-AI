const jwt = require('jsonwebtoken')

// authMiddleware Code
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const result = jwt.verify(token, process.env.JWT_SECRET);
    if (result) {
      req.user = result;
      next();
    }
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = authMiddleware