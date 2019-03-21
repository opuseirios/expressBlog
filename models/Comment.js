const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const marked = require('marked')

const CommentSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  meta: {
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  }
})

CommentSchema.pre('save', function (next) {
  this.content = marked(this.content);
  next();
})

CommentSchema.statics = {
  //通过文章id获取该文章下的留言数
  getCommentsCount: function (postId) {
    return this.count({postId}).exec();
  },
  //通过文章id删除文章下所有留言
  delCommentsByPostId: function (postId) {
    return this.deleteMany({postId}).exec();
  },
  //通过留言id删除一个留言
  delCommentById: function (commentId) {
    return this.findByIdAndRemove({_id: commentId}).exec()
  },
  //通过留言id获取一个留言
  getCommentById: function (commentId) {
    return this.findOne({_id: commentId}).exec()
  }
}

module.exports = mongoose.model('Comment', CommentSchema);