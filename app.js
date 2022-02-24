require('dotenv').config();

const express = require('express');
const connect = require('./schemas');
const cors = require('cors');
const app = express();
const { port } = process.env;

// Routers
const userRouter = require('./routes/users');
const commentRouter = require('./routes/comments');
const articleRouter = require('./routes/article');
const kakaoRouter = require('./routes/kakao');

// 몽고 db 커넥트
connect();

app.use((req, res, next) => {
  console.log(
    'Request URL:',
    `[${req.method}]`,
    req.originalUrl,
    ' - ',
    new Date().toLocaleString()
  );
  next();
});

const whitelist = [
  'http://tumblbugclone.s3-website.ap-northeast-2.amazonaws.com',
];

const corsOptions = {
  origin: function (origin, callback) {
    const isWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, isWhitelisted);
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.urlencoded());
app.use(express.json());

app.use('/api', [userRouter, commentRouter, articleRouter, kakaoRouter]);

app.use((err, req, res, next) => {
  res.status(401).send({ result: 'fail', msg: err.message });
});

app.listen(port, () => {
  console.log(port, '포트로 서버가 요청 받을 준비가 됐습니다!');
});
