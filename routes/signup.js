const router = require('express').Router();

const checkNotLogin = require('../middlewares/check').checkNotLogin;

router.get('/',checkNotLogin,(req,res,next)=>{
  res.send('注册页')
})
router.post('/',checkNotLogin,(req,res,next)=>{
  res.send('注册')
})

module.exports = router;