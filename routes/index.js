module.exports = function (app) {
  app.get('/',(req,res,next)=>{
    res.redirect('/posts')
  })

  app.use('/signup',require('../routes/signup'));
  app.use('/signin',require('../routes/signin'));
  app.use('/signout',require('../routes/signout'));
  app.use('/posts',require('../routes/posts'))
  app.use('/comments',require('../routes/comments'))
}

