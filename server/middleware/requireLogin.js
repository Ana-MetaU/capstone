function requireLogin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({error: "authentication failed. Log in first"});
  }

  next();
}

function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({error: "authentication failed. Log in first"});
  }
  next();
}

function ensureNoConflict(req, res, next) {
  const sessionUserId = req.session.userId;
  const paramUserId = req.params.userId;
  if (sessionUserId !== paramUserId) {
    return res.status(403).json({error: "Forbidden access"});
  }
  next();
}

module.exports = {
  requireLogin,
  requireAuth,
  ensureNoConflict,
};
