const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../schemas/user");
const authMiddleware = require("../middlewares/auth-middleware");

const { JWT_SECRET_KEY } = process.env


// 회원가입 API
router.post("/users/signup", async (req, res) => {
    const { nickname, email, password } = req.body;

    const existsUsers = await User.findOne({ email });
    if (existsUsers) {
        // NOTE: 보안을 위해 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-responses
        return res.status(400).send({
            msg: '이미 존재하는 이메일입니다.',
        });
    }

    const user = new User({ nickname, email, password });
    await user.save();

    res.status(201).json({ result: true, msg: '회원가입에 성공하였습니다.' });
});

// 로그인 API
router.post("/users/login", async (req, res) => {
    const { email, password } = req.body; // email 양식 맞춰서 받는 것 고려해야 하는 것 추후 구현
    let check_password = false;
    const user = await User.findOne({ email });
    if (user) {
        check_password = await user.compare(password)
    }
    // NOTE: 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-responses
    if (!user || !check_password) {
        return res.status(400).send({result: false,
            msg: '아이디 또는 비밀번호를 확인해주세요.',
            });
    }
        
    res.send({ result: true,
        token: jwt.sign({ email: user.email }, JWT_SECRET_KEY), // jwt.sign의 첫번째 인자는 payload부분, token 자체는 위변조하기 힘들지만 담긴 데이터는 볼 수 있으므로
    });
});

// 토큰 확인 API
router.post("/users/me", authMiddleware, async (req, res) => {
    const { user } = res.locals;

    if (user) {
        res.send({ result: true,
            email: user.email,
            nickname: user.nickname
           });
    } else {
        res.send({
            result: false,
            msg: '접근경로가 올바르지 않습니다.'
        })
    }
    
});


module.exports = router;
