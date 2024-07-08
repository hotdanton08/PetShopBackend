// utils/checkRole.js

const checkRole = (roles) => {
    return (req, res, next) => {
      const userRole = req.user.role;
      if (!roles.includes(userRole)) {
        return res.status(403).json({ message: '您沒有訪問此頁面的權限' });
      }
      next();
    };
  };
  
  module.exports = checkRole;
  