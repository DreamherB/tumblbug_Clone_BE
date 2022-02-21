const jwt = require('jsonwebtoken');
const User = require('../schemas/user');
require('dotenv').config();


module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const [tokenType, tokenValue] = authorization.split(' ');

  if (tokenType !== 'Bearer') {
    res.status(401).send({
      errorMessage: '로그인 후 사용하세요.',
    });
    return;
  }

  try {
    const { email } = jwt.verify(tokenValue, JWT_SECRET_KEY);
    User.findOne({ email })
      .exec()
      .then((user) => {
        res.locals.user = user;
        next();
      });
  } catch (error) {
    res.status(401).send({
      errorMessage: '로그인 후 사용하세요.',
    });
    return;
  }
};
