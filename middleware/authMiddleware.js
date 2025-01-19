const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware xác thực token
exports.authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Không có quyền truy cập!' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token không hợp lệ!' });
  }
};

// Middleware kiểm tra quyền admin
exports.isAdmin = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user.role !== 'admin') {
    return res.status(403).json({ message: 'Không có quyền admin!' });
  }
  next();
};
