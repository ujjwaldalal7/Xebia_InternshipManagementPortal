// ──────────────────────────────────────────────────────
// Authentication Middleware — JWT Verification
// ──────────────────────────────────────────────────────
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { errorResponse  } from '../utils/responseFormatter.js';

/**
 * Protects routes by verifying the JWT token from the Authorization header.
 * Attaches the authenticated user to req.user.
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from Authorization header (Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return errorResponse(res, 401, 'Not authorized — no token provided');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (exclude password)
    const user = await User.findById(decoded.id);
    if (!user) {
      return errorResponse(res, 401, 'Not authorized — user no longer exists');
    }

    if (!user.isActive) {
      return errorResponse(res, 403, 'Account has been deactivated');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, 401, 'Not authorized — invalid token');
    }
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Not authorized — token expired');
    }
    return errorResponse(res, 500, 'Authentication error');
  }
};

/**
 * Role-based authorization middleware factory.
 * Restricts access to users with one of the specified roles.
 * @param  {...string} roles - Allowed roles (e.g., 'admin', 'mentor')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        403,
        `Role '${req.user.role}' is not authorized to access this resource`
      );
    }
    next();
  };
};

export {  };
