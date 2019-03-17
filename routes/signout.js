const router = require('express').Router();

const checkLogin = require('../middlewares/check').checkLogin;

router.get('/',checkLogin,(req,res,next)=>{
  //清空session值
  req.session.user = null;
  req.flash('success','登出成功');
  return res.redirect('/posts')
})


module.exports = router;