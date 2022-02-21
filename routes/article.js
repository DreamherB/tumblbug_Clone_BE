const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const articles = require('../schemas/articleSchema');
const authMiddlleware = require('../middlewares/auth-middleware');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// 랜덤 게시글 8개 발송
router.get('/articles/mainProjects', async (req, res) => {
  const postings = await articles.aggregate([{ $sample: { size: 8 } }]);
  res.json({ result: true, mainProjects: postings });
});

// 인기 프로젝트 조회
router.get('/articles/popularProjects', async (req, res) => {
  const postings = await articles.find(
    {},
    { contents: 0, donator: 0, creatorImg: 0, articleId: 0 }
  );
  res.json({ result: true, popularProjects: postings });
});

// 전체(카테고리)
router.get('/articles/all', async (req, res) => {
  const postings = await articles.find(
    {},
    { contents: 0, donator: 0, creatorImg: 0, articleId: 0 }
  );
  const count = await postings.length;
  res.json({
    result: true,
    count: count,
    allProjects: postings,
  });
});

// 상세(카테고리)
router.get('/articles/category', async (req, res) => {
  const { category } = req.query;
  const postings = await articles.find(
    { category: category },
    { contents: 0, donator: 0, creatorImg: 0, articleId: 0 }
  );
  const count = await postings.length;
  res.json({
    result: true,
    count: count,
    categorizedProjects: postings,
  });
});

// nickname & 후원한 프로젝트 조회 (마이페이지)
router.get('/articles/myDonatedProjects', authMiddlleware, async (req, res) => {
  const { user } = res.locals;
  const postings = await articles.find(
    { donator: { $elemMatch: { email: user.email } } },
    { contents: 0, donator: 0, creatorImg: 0, articleId: 0 }
  );

  res.json({
    result: true,
    nickname: user.nickname,
    donatedProjects: postings,
  });
});

// 검색 ( 카테고리, title 기준 )
router.get('/articles', async (req, res) => {
  const keyword = req.query.search.replace(/\s/gi, '');
  const postings = await articles.find(
    {
      $or: [{ category: new RegExp(keyword) }, { title: new RegExp(keyword) }],
    },
    { contents: 0, donator: 0, creatorImg: 0, articleId: 0 }
  );
  res.json({
    result: true,
    matchedProjects: postings,
  });
});

// 상세 게시글 조회 (게시클 클릭)
router.get('/article/:articleId', async (req, res) => {
  const { articleId } = req.params;
  const postings = await articles.findOne({ articleId: articleId });
  const donatorNum = await postings.donator.length;
  res.json({
    result: true,
    donatorNum: donatorNum,
    detailedProjects: postings,
  });
});

// 후원하기
try {
  router.patch(
    '/article/:articleId/donation',
    authMiddlleware,
    async (req, res) => {
      const { articleId } = req.params;
      const { user } = res.locals;
      console.log(user);

      await articles
        .findByIdAndUpdate(articleId, {
          $push: { donator: { email: user.email } },
          $inc: { totalAmount: +50000 },
        })
        .exec();
      res.json({
        result: true,
      });
    }
  );
} catch (error) {
  res.status(400).send({ result: false });
}

// 후원 취소
try {
  router.patch(
    '/article/:articleId/donationCancel',
    authMiddlleware,
    async (req, res) => {
      const { articleId } = req.params;
      const { user } = res.locals;

      const name = await articles.findById({
        _id: articleId,
      });

      const donateCancel = name.donator.filter(
        (e) => e === { email: user.email }
      );

      await articles.findByIdAndUpdate(articleId, {
        $inc: { totalAmount: -50000 },
        donator: donateCancel,
      });
      res.json({ result: true });
    }
  );
} catch (error) {
  res.status(400).send({ result: false });
}

module.exports = router;
