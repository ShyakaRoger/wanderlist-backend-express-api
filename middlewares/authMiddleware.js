const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(`Authorization header: ${authHeader}`);  // Log the Authorization header

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Authorization token missing or malformed');
    return res.status(401).json({ err: 'Authorization token missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email
    };
    console.log(`Token verified for user: ${decoded.username}`);
    next();
  } catch (error) {
    console.log('Invalid or expired token');
    return res.status(401).json({ err: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
