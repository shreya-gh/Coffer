function checkRole(requiredRole) {
  return (req, res, next) => {
    next();
  };
}

module.exports = checkRole;