const router = require('express').Router();

const checkLogin = require('../middlewares/check').checkLogin;

router.get('/',(req,res,next)=>{
  res.send('主页')
})

router.post('/create',(req,res,next)=>{
  res.send('发表文章')
})

router.get('/create',(req,res,next)=>{
  res.send('发表文章页')
})

router.get('/:postId',(req,res,next)=>{
  res.send('文章详情页')
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