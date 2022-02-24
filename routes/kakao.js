const express = require("express");
const User = require("../schemas/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = process.env;

// 로그인 정보 저장 + 토큰 발급
router.post("/users/loginKakao", async (req, res) => {
    const { email, nickname } = req.body;

    const existsUsers = await User.findOne({ email });
    if (existsUsers) {
        // NOTE: 보안을 위해 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-responses
        return res.status(400).send({
            msg: "이미 존재하는 이메일입니다.",
        });
    }

    const user = new User({ email, nickname });
    await user.save();

    res.send({
        result: true,
        token: jwt.sign({ email: user.email }, JWT_SECRET_KEY),
    });
});

module.exports = router;
