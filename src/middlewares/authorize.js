const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'you do not have permission perform this action',
      });
    }

    next();
  };
};

export default authorize;
