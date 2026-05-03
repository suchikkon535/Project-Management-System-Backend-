// middleware/role.middleware.js

exports.authRoles = (...roles) => {
  return (req, res, next) => {
    // req.user is already set by your auth middleware
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied: ${req.user.role} role not allowed`,
      });
    }

    next();
  };
};