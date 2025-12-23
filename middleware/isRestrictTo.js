const isRestrictTo = (...role) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!role.includes(userRole)) {
      res.status(403).json({
        message: "You don't have permission to this",
      });
    } else {
      next();
    }
  };
};

module.exports = isRestrictTo;
