const router = require('express').Router();

const checkLogin = require('../middlewares/check').checkLogin;
const CommentModel = require('../models/Comment')

router.post('/',checkLogin,(req,res,next)=>{
  const author = req.session.user._id;
  const content = req.fields.content;
  const postId = req.fields.postId;

  try{
    if (!content.length){
      throw new Error('请填写评论')
    }
  }catch (e) {
    req.flash('error',e.message);
    return res.redirect('back')
  }

  const comment = {
    author,
    postId,
    content
  }

  CommentModel.create(comment).then((result)=>{
    req.flash('success','留言成功');
    return res.redirect('back')
  })
    .catch(next)

})

router.get('/:commentId/remove',checkLogin,(req,res,next)=>{
  const commentId = req.params.commentId;
  const author = req.session.user._id;

  CommentModel.getCommentById(commentId).then((comment)=>{
    if(!comment){
      throw new Error('留言不存在')
    }
    if(comment.author.toString()!==author.toString()){
      throw new Error('没有权限')
    }
    CommentModel.delCommentById(commentId).then(()=>{
      req.flash('success','删除留言成功');
      return res.redirect('back')
    })
      .catch(next)
  })
})

module.exports = router;