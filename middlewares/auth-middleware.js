const jwt = require('jsonwebtoken');
const User = require('../schemas/user');
require('dotenv').config();
const { JWT_SECRET_KEY } = process.env



module.exports = (req, res, next) => {
  console.log(11)
  
  const {authorization} = req.headers; 
//   console.log(req)
  console.log(req.headers)
  console.log(authorization)
  console.log(22)

  const [tokenType, tokenValue] = authorization.split(' ');
  console.log(tokenType)
  console.log(tokenValue)
  console.log(33)

  if (tokenType !== 'Bearer') {
    res.status(401).send({
      errorMessage: '로그인 후 사용하세요.',
    });
    console.log(44)
    return;
  }

  try {
    const { email } = jwt.verify(tokenValue, JWT_SECRET_KEY);
    User.findOne({ email })
      .exec()
      .then((user) => {
        res.locals.user = user;
        console.log(55)
        console.log(user)
        next();
      });
  } catch (error) {
    res.status(401).send({
      errorMessage: '로그인 후 사용하세요.',
    });
    console.log(66)
    return;
  }
};
