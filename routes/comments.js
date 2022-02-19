const express = require("express");
const router = express.Router();
const User = require("../schemas/user");
const Comment = require("../schemas/comment");
const authMiddleware = require("../middlewares/auth-middleware");
const jwt = require("jsonwebtoken");

/* 댓글 불러오기 */

router.get("/articles/:articleId/comments", async (req, res) => {
    const article_id = req.params.articleId;
    const comments = await Comment.find({ article_id: article_id });

    res.json({
        result: 'success',
        comments

    });
});

/* 댓글 작성, DB에 등록 */

router.post(
    "/articles/:articleId/comments",
    authMiddleware,
    async (req, res) => {

        const { content } = req.body;
        if (!content) {
            return res
                .status(400)
                .json({ result: 'fail', 'msg': "내용을 입력해주세요!" });
        }
        const article_id = req.params.articleId;
        const comment_id = Math.random().toString(36).substring(2, 6) + article_id + Math.random().toString(36).substring(2, 6)
        //0과 1사이의 수를 36진법 문자열로 변환 후 2번째 인덱스부터 6번째 인덱스의 직전인 5번째 인덱스까지 잘라냄, 고유 값인 article_id 양 옆으로 더해주어 새로운 고유값 생성

        const user_id = res.locals.user.user_id

        await Comment.create({
            comment_id,
            user_id,
            article_id,
            content,
        });

        res.status(201).json({
            result: "success",
            'msg': "작성 완료되었습니다.",
        }); // 200은 ok신호, 201은 리소스 생성 완료 신호
    }
);

/* 댓글 삭제 */

router.delete(
    "/articles/:articleId/comments/:commentId",
    authMiddleware,
    async (req, res) => {

        const user_id = res.locals.user.user_id
        const { articleId, commentId } = req.params;

        // comment_id로 가져온 비교대상 User
        const thatUser = await Comment.find({ comment_id: commentId });

        // 로그인하여 인증된 유저의 아이디와 comment_id에 담겨있는 유저 아이디 비교/ 게시글 id까지 서로 비교
        if (user_id !== thatUser[0].user_id || articleId !== thatUser[0].article_id) {
            return res
                .status(400)
                .json({ result: 'fail', 'msg': "자기 댓글만 삭제할 수 있습니다." });
        }

        await Comment.deleteOne({ comment_id: commentId });
        res.json({
            result: 'success',
            'msg': '삭제 완료되었습니다.'
        });
    }
);

/*댓글 수정*/



module.exports = router;
