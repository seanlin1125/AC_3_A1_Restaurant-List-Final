const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
module.exports = (app) => {
  // 初始化 Passport 模組
  app.use(passport.initialize())
  app.use(passport.session())
  // 設定本地登入策略
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true,
  }, (req, username, password, done) => {
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return done(null, false);
        }
        if (user.password !== password) {
          return done(null, false)
        }
        return done(null, user);
      })
      .catch((err) => done(err, false))
  }));
  // 設定序列化與反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then((user) => done(err, user))
      .catch((err) => done(err, null))
  });
}