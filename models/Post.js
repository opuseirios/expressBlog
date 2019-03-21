const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const marked = require('marked');
const CommentModel = require('./Comment')

const PostSchema = new Schema({
  author:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  title:{
    type: String,
    required: true
  },
  content:{
    type:String,
    required:true
  },
  pv:{
    type:Number,
    default:0
  },
  meta:{
    createdAt: {
      type:Date,
      default:Date.now()
    },
    updatedAt:{
      type:Date,
      default: Date.now()
    }
  }
})

PostSchema.pre('save',function (next) {
  //将内容转换成mark格式
  this.content = marked(this.content);
  CommentModel.getCommentsCount(this._id).then(function (commentsCount) {
    this.commentsCount = commentsCount;
    next();
  })
})

PostSchema.statics = {
  incPv:function (postId) {
    return this.update({_id:postId},{$inc:{pv:1}})
      .exec();
  },
  getRawPostById:function (postId) {
    return this.findOne({_id:postId})
      .populate({path:'author',select:['name','bio','avatar']})
      .exec()
  }
}

module.exports = mongoose.model('Post',PostSchema);