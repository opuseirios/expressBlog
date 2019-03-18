const router = require('express').Router();

const checkLogin = require('../middlewares/check').checkLogin;
const PostModel = require('../models/Post');

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

router.get('/:postId',(req,res,next)=>{
  const postId = req.params.postId;
  PostModel.findById({_id:postId})
    .populate({path:'author',select:['name','bio','avatar']})
    .then((post)=>{
      if(!post){
        throw new Error('该文章不存在');
      }
      PostModel.incPv(postId).then((result)=>{
        console.log(result);
        res.render('post',{
          post
        })
      })
    }).then(next)
})

router.get('/:postId/edit',(req,res,next)=>{
  res.send('更新文章页')
})

router.post('/:postId/edit',(req,res,next)=>{
  res.send('更新文章')
})

router.get('/:postId/remove',(req,res,next)=>{
  res.send('删除文章')
})

module.exports = router;