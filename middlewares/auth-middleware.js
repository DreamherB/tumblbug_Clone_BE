const jwt = require('jsonwebtoken');
const User = require('../schemas/user');
const { JWT_SECRET_KEY } = process.env;
require('dotenv').config();
const bcrypt = require("bcrypt")

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


// 사전 hook , save 시 password 암호화 해서 저장
UserSchema.pre("save", function (next) {
  let user = this;
  bcrypt.genSalt(10, (err, salt) => {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) return next(err);
          user.password = hash;
          next();
      })
  })
})


// 해당 메소드 사용 시 기존과 비교 실시
UserSchema.methods.compare = function (password) {
  let user = this;
  return bcrypt.compareSync(password, user.password);
};