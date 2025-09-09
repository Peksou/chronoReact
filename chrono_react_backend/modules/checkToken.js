const jwt = require('jsonwebtoken');

function checkToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ result: false, error: "Token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contient les infos (id, email...),  on stocke les infos décodées
    next(); // on continue vers la route protégée
  } catch (error) {
    return res.status(401).json({ result: false, error: "Token invalide" });
  }
}

module.exports = { checkToken };
