const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  category: {
    type: String,
  },
  nickname: {
    type: String,
  },
  title: {
    type: String,
  },
  image: {
    type: String,
  },
  targetAmount: {
    type: Number,
  },
  totalAmount: {
    type: Number,
  },
  deadline: {
    type: String,
  },
  contents: {
    type: String,
  },
  donator: {
    type: Array,
  },
  creatorImg: {
    type: String,
  },
});

module.exports = mongoose.model('articles', articleSchema);
