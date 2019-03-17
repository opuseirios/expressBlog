const fs = require('fs');
const path = require('path');
const sha1 = require('sha1');
const router = require('express').Router();

const UserModel = require('../models/User');
const checkNotLogin = require('../middlewares/check').checkNotLogin;

router.get('/',checkNotLogin,(req,res,next)=>{
  res.render('signup')
})
router.post('/',checkNotLogin,(req,res,next)=>{
  const name = req.fields.name;
  let password = req.fields.password;
  const bio = req.fields.bio;
  const avatar = req.files.avatar.path.split(path.sep).pop()
  const gender = req.fields.gender;
  const repassword = req.fields.repassword;

  //校验
  try{
    if(!(name.length>=1&&name.length<=10)){
      throw new Error('名字的长度必须在1-10个字符之内')
    }
    if(password.length<6){
      throw new Error('密码的长度必须在6个字符以上')
    }
    if(!(bio.length>=1&&bio.length<=30)){
      throw new Error('个人简介必须在1-30个字符之内')
    }
    if(['x','m','f'].indexOf(gender)===-1){
      throw new Error('性别只能是x,m或f')
    }
    if(!avatar.length){
      throw new Error('头像不能为空')
    }
    if(password !== repassword){
      throw new Error('两次输入的密码不一致')
    }
  }catch (e) {
    //删除头像
    fs.unlink(req.files.avatar.path);
    req.flash('error',e.message);
    return res.redirect('/signup')
  }

  password = sha1(password);
  let user = {
    name,
    password,
    avatar,
    bio,
    gender
  }
  console.log(user);
  //用户信息写入数据库
  UserModel.create(user).then(result=>{
    let user = result;
    delete user.password;
    req.session.user = user;
    req.flash('success','注册成功');
    return res.redirect('/posts')
  }).catch(e=>{
    fs.unlink(req.files.avatar.path);
    if(e.message.match('duplicate key')){
      req.flash('error','用户名被占用');
      return res.redirect('/signup')
    }
    next(e);
  })

})

module.exports = router;