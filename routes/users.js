const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const User = require("../schemas/user");
const authMiddleware = require("../middlewares/auth-middleware");

const { JWT_SECRET_KEY } = process.env


// 회원가입 API
router.post("/users", async (req, res) => {
    const { user_id, password } = req.body;

    const existsUsers = await User.findOne({ user_id });
    if (existsUsers) {
        // NOTE: 보안을 위해 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-responses
        return res.status(400).send({
            errorMessage: "ID가 이미 사용중입니다.",
        });
    }

    const user = new User({ user_id, password });
    await user.save();

    console.log(user_id, '회원가입 완료!')
    res.status(201).send({ result: 'success', msg: '회원가입에 성공하였습니다.' });
});

// 로그인 API
router.post("/auth", async (req, res) => {
    const { user_id, password } = req.body;
    let check_password = false;
    const user = await User.findOne({ user_id });
    if (user) {
        check_password = await user.compare(password)
    }
    // NOTE: 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-responses
    if (!user || !check_password) {
        return res.status(400).send({
            errorMessage: "ID 또는 패스워드가 틀렸습니다.",
        });
    }
    console.log(user_id, '로 로그인 되었습니다.')
    res.send({
        token: jwt.sign({ userId: user.userId }, JWT_SECRET_KEY),
    });
});

// 토큰 확인 API
router.get("/users/me", authMiddleware, async (req, res) => {
    const { user } = res.locals;
    res.send({ user_id: user.user_id });
});


module.exports = router;
