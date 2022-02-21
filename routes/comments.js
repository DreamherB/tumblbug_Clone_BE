const express = require("express");
const router = express.Router();
const User = require("../schemas/user");
const Comment = require("../schemas/comment");
const authMiddleware = require("../middlewares/auth-middleware");
const jwt = require("jsonwebtoken");

/* 댓글 불러오기 */

router.get("/comments/:articleId", async (req, res) => {
    const {articleId} = req.params;
    const comments = await Comment.find({ articleId });

    res.json({ result: true,
        comments: [{ 
        commentId :  comments.commentId,
        articleId : comments.articleId,
        nickname : comments.nickname,
        comment : comments.comment,
        email: comments.email,
      }]
       });
});

/* 댓글 작성, DB에 등록 */

router.post(
    "/comments/:articleId",
    authMiddleware,
    async (req, res) => {

        const { comment } = req.body;
        if (!comment) {
            return res
                .status(400)
                .json({ result: false,
                    msg: '내용을 입력해주세요!' });
        }
        const {articleId} = req.params;
        const commentId = Math.random().toString(36).substring(2, 6) + articleId + Math.random().toString(36).substring(2, 6)
        //0과 1사이의 수를 36진법 문자열로 변환 후 2번째 인덱스부터 6번째 인덱스의 직전인 5번째 인덱스까지 잘라냄, 고유 값인 article_id 양 옆으로 더해주어 새로운 고유값 생성

        const email = res.locals.user.email
        const nickname = res.locals.user.nickname

        await Comment.create({
            commentId,
            email,
            articleId,
            comment,
            nickname,
        });

        res.status(201).json({
            result: "success",
            'msg': "작성 완료되었습니다.",
        }); // 200은 ok신호, 201은 리소스 생성 완료 신호
    }
);

/* 댓글 삭제 */

router.delete(
    "/comments/delete/:commentId",
    authMiddleware,
    async (req, res) => {

        const {email} = res.locals.user
        const { commentId } = req.params;

        // commentId로 가져온 비교대상 User
        const thatUser = await Comment.find({ commentId });

        // 로그인하여 인증된 유저의 아이디와 commentId에 담겨있는 유저 아이디 비교
        if (email !== thatUser[0].email) {
            return res
                .status(400)
                .json({ result: false,
                    msg: '자기 댓글만 삭제할 수 있습니다.' });
        }

        await Comment.deleteOne({ commentId });
        res.json({ result: true,
            msg: '삭제 완료되었습니다.' 
            });
    }
);

/*댓글 수정*/

router.patch('/comments/modify/:commentId', authMiddleware, async (req, res) => {
    const { commentId } = req.params;
    const { comment } = req.body;
    const {email} = res.locals.user
    const thatUser = await Comment.findOne({ commentId });
    if (thatUser.email !== email ) {
       return res.status(400).send({result: false, msg:'본인의 글이 아닙니다.'})
    }
    if (comment.length === 0) {
        return res.status(400).send({ result: false,
            msg: '내용을 입력해주세요!' })
    }
    
    await Comment.updateOne({ commentId },{$set:{comment}})

    res.status(200).json({ result: true,
        msg: '수정 완료되었습니다.'
        });
})


module.exports = router;
