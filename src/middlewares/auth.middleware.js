const jwt = require('jsonwebtoken');
const { checkJwt } = require('../config/auth0');
const logger = require('../config/logger');

// Verify either Auth0 JWT or backend-issued JWT
const verifyAccess = async (req, res, next) => {
  try {
    // First, try Auth0 JWT verification
    checkJwt(req, res, (err) => {
      if (!err && req.auth) {
        // Auth0 token is valid
        req.user = {
          auth0Id: req.auth.sub,
          ...req.auth,
        };
        return next();
      }

      // If Auth0 fails, try backend JWT from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: 'No authorization token provided' });
      }

      const token = authHeader.replace('Bearer ', '');

      try {
        const decoded = jwt.verify(token, process.env.SESSION_SECRET);
        req.user = decoded;
        return next();
      } catch (jwtError) {
        logger.error('JWT verification failed:', jwtError.message);
        return res.status(401).json({ error: 'Invalid or expired token' });
      }
    });
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Authentication error' });
  }
};

// Role-based access control
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userRoles = req.user.roles || [];
    const hasRole = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

module.exports = {
  verifyAccess,
  requireRole,
};
