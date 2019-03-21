const router = require('express').Router();

const checkLogin = require('../middlewares/check').checkLogin;
const PostModel = require('../models/Post');
const CommentModel = require('../models/Comment')

router.get('/',checkLogin,(req,res,next)=>{
  const query = {};
  const author = req.session.user._id;
  if(author){
    query.author = author;
  }
  PostModel.find(query)
    .populate({'path':'author',select:['name','bio','avatar']})
    .sort({_id:-1})
    .then(posts=>{
    res.render('posts',{
      posts
    })
  })
})

router.get('/create',checkLogin,(req,res,next)=>{
  res.render('create')
})

router.post('/create',checkLogin,(req,res,next)=>{
  const author = req.session.user._id;
  const title = req.fields.title;
  const content = req.fields.content;

  try{
    if(!title){
      throw new Error('请填写标题')
    }
    if(!content){
      throw new Error('请填写内容')
    }
  }catch (e) {
    req.flash('error',e.message);
    return res.redirect('back')
  }

  let post = {
    author,
    content,
    title
  }

  PostModel.create(post).then(post=>{
    req.flash('success','发表成功');
    return res.redirect(`/posts/${post._id}`)
  }).catch(next)
})

router.get('/:postId',checkLogin,(req,res,next)=>{
  const postId = req.params.postId;
  PostModel.findById({_id:postId})
    .populate({path:'author',select:['name','bio','avatar']})
    .then((post)=>{
      if(!post){
        throw new Error('该文章不存在');
      }
      PostModel.incPv(postId).then((result)=>{
        console.log(result);
        CommentModel.find({postId}).populate({path:'author',select:['name','bio','avatar']}).sort({_id:-1})
          .then((comments)=>{
            res.render('post',{
              post,
              comments
            })
          })
      })
    }).catch(next)
})

router.get('/:postId/edit',checkLogin,(req,res,next)=>{
  const postId = req.params.postId;
  PostModel.getRawPostById(postId)
    .then(post=>{
      res.render('edit',{
        post
      })
    })
})

router.post('/:postId/edit',(req,res,next)=>{
  const title = req.fields.title;
  const content = req.fields.content;
  const postId = req.params.postId;
  const author = req.session.user._id;

  try{
    if(!title.length){
      throw new Error('请填写标题')
    }
    if(!content.length){
      throw new Error('请填写内容')
    }
  }catch (e){
    req.flash('error',e.message);
    return res.redirect('back')
  }
  PostModel.getRawPostById(postId).then((post)=>{
    if(!post){
      throw new Error('该文章不存在');
    }
    if(post.author._id.toString()!==author.toString()){
      throw new Error('没有权限')
    }
    PostModel.findByIdAndUpdate({_id:postId},{$set:{
        title,
        content
      }}).then(post=>{
      req.flash('success','发表成功');
      return res.redirect(`/posts/${post._id}`)
    }).catch(next)
  })
})

router.get('/:postId/remove',checkLogin,(req,res,next)=>{
  const postId = req.params.postId;
  const author = req.session.user._id;
  PostModel.getRawPostById(postId).then(post=>{
    if(!post){
      throw new Error('该文章不存在')
    }
    if(post.author._id.toString()!==author.toString()){
      throw new Error('没有权限')
    }
    PostModel.findByIdAndRemove({_id:postId}).then((res)=>{
      console.log(res);
      if(res.result.ok&&res.result.n>0){
         CommentModel.delCommentsByPostId(postId).then(()=>{
           req.flash('success','删除成功');
           return res.redirect('/posts')
         }).catch(next);
      }
    })
  })
})

module.exports = router;