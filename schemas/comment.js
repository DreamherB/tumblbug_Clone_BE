const mongoose = require("mongoose");
const moment = require("moment");

const commentSchema = new mongoose.Schema({
    comment_id:{
        type:String,
        require:true,
    },
    user_id:{
        type:String,
        require:true,
    },
    article_id:{
        type:String,
        require:true,
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: moment().format("YYYY-MM-DD hh:mm"),
    }
})

commentSchema.virtual("commentId").get(function () {
    return this._id.toHexString();
});
commentSchema.set("toJSON", {
    virtuals: true,
});

module.exports = mongoose.model("Comment", commentSchema)