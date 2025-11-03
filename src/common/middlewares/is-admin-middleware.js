export function isAdmin(req, res, next) {
  const user = req.session.user;
  if (user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  next();
}
