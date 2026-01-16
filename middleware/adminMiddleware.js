const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
  console.log("Inside admin JWT Middleware");
  console.log(req.headers.authorization.slice(7));
  try {
    const token = req.headers.authorization.slice(7);
    const jwtVerification = jwt.verify(token, process.env.jwtKey);
    console.log(jwtVerification); // userMail: 'kes17@gmail.com',role: 'BookStore User',iat: 1766646946
    req.payload = jwtVerification.userMail;
    req.role = jwtVerification.role
    if (req.role == "Admin") {
      next();
    } else {
      res.status(403).json("Authorization Error... Only admin can access");
    }
  } catch (err) {
    res.status(402).json("Authorization Error" + err);
  }

};
module.exports = adminMiddleware;
