const mongoose = require("mongoose");
const moment = require("moment");

const commentSchema = new mongoose.Schema({
    commentId:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
    },
    articleId:{
        type:String,
        require:true,
    },
    nickname:{
        type:String,
        require:true,
    },
    comment: {
        type: String,
        required: true
    },
    // date: {
    //     type: String,
    //     default: moment().format("YYYY-MM-DD hh:mm"),
    // }
})

// commentSchema.virtual("commentId").get(function () {
//     return this._id.toHexString();
// });
// commentSchema.set("toJSON", {
//     virtuals: true,
// });

module.exports = mongoose.model("Comment", commentSchema)