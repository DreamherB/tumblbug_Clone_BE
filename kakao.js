// 로그인 정보 저장 + 토큰 발급
router.post('/users/loginKakao', async (req, res) => {
  const { email, nickname } = req.body;

  const user = new User({ email, nickname });
  await user.save();

  res.send({
    result: true,
    token: jwt.sign({ email: user.email }, JWT_SECRET_KEY),
  });
});

schema 수정도 필요할듯요 창훈님! required 지우기!
