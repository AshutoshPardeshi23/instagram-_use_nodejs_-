var express = require('express');                //this all files are require app.js
var router = express.Router();
const userModel = require('./users');
const postModel = require('./upload_img');
const passport = require('passport');
const upload = require('./multar');
const fs = require('fs-extra');

const LocalStreg = require('passport-local');
const post = require('./upload_img');
const user = require('./users');
const src = require('debug');
const users = require('./users');
passport.use(new LocalStreg(userModel.authenticate()));


router.get('/', function (req, res) {
  res.render('index');
});

router.get('/search', isLogdden, async function (req, res) {
  let user = await userModel.findOne({ username: req.session.passport.user });
  res.render('search', { user });
});

router.get('/found/user/:id', isLogdden, async function (req, res) {
  let user = await userModel.findOne({ _id: req.params.id }).populate('post');
  let original_user = await userModel.findOne({ username: req.session.passport.user });

  let choose = 'follow';
  if (user.follow.indexOf(original_user._id) === -1 ) {
    choose = 'follow';
  } else {
    choose = 'Unfollow';
  }

  res.render('chek_profile', { user, choose , original_user});
});

router.get('/folow/:id', isLogdden, async function (req, res) {
  let user = await userModel.findOne({ _id: req.params.id });
  let original_user = await userModel.findOne({ username: req.session.passport.user });

  if (user.follow.indexOf(original_user._id) === -1 ) {
    user.follow.push(original_user._id)
  } else {
    user.follow.splice(user.follow.indexOf(original_user._id), 1)
  }

  if (original_user.following.indexOf(user._id) === -1 ) {
    original_user.following.push(user._id)
  } else {
    original_user.following.splice(original_user.following.indexOf(user._id), 1)
  }
 
  await user.save();

  res.redirect(`/found/user/${user._id}`);
});

router.get('/post', isLogdden, function (req, res) {
  res.render('post');
});

router.get('/upload', isLogdden, function (req, res) {
  res.render('upload');
});

router.post('/upload', isLogdden, upload.single("file"), async function (req, res, next) {
  if (!req.file) {
    return res.status(404).send('not files were given');
  }
  const user = await userModel.findOne({ username: req.session.passport.user });
  let post = await postModel.create({
    img: req.file.filename,
    imgeText: req.body.filecaption,
    user: user._id
  });

  user.post.push(post._id);
  await user.save();

  res.redirect("/profile");
});

router.get('/dp_profile', isLogdden, async function (req, res) {
  let user = await userModel.findOne({ username: req.session.passport.user }).populate('post');
  res.render('dp_profile', { user });
});

router.get("/chenge_dp", isLogdden, async function (req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  res.render('dp_upload', { user });
});

router.post('/chenge_dp', isLogdden, upload.single('file'), async function (req, res) {
  let user = await userModel.findOne({ username: req.session.passport.user });
  if (req.file) {
    await fs.remove(`public/upload/${user.dp_img}`);
    user.dp_img = req.file.filename;
  }
  if (req.body.u_name) user.fullname = req.body.u_name; //fullnaem
  if (req.body.u_Caption) user.bio = req.body.u_Caption;  //bio 
  await user.save();
  res.redirect('/dp_profile');
});

router.get('/profile', isLogdden, async function (req, res) {
  let user = await userModel.findOne({ username: req.session.passport.user });
  const post = await postModel.find().populate('user');
  res.render('profile', { user, post });
});

router.get('/user_post', isLogdden, async function (req, res) {
  let user = await userModel.findOne({ username: req.session.passport.user }).populate('post');
  const post = await postModel.find().populate('user');
  res.render('user_post', { user, post });
});

router.get('/lick', isLogdden, async function (req, res) {
  let user = await userModel.findOne({ username: req.session.passport.user });
  res.render('lickpage', { user });
});

router.get('/lick/post/:id', isLogdden, async function (req, res) {
  let user = await userModel.findOne({ username: req.session.passport.user });
  let post = await postModel.findOne({ _id: req.params.id });

  if (post.likes.indexOf(user._id) === -1) {
    post.likes.push(user._id);
  } else {
    post.likes.splice(post.likes.indexOf(user._id), 1);
  }

  await post.save();
  res.redirect('/profile');

});

router.get('/chat', isLogdden, async function (req, res) {
  let user = await userModel.findOne({ username: req.session.passport.user });
  res.render('chat', { user });
});

router.get('/post/delete/:id',async function (req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  const post = await postModel.findOneAndDelete({ _id: req.params.id });
  
  await fs.remove(`public/uploads/${post.img}`);
  await user.save();

  res.redirect('/user_post');
});

router.post('/ragistar', function (req, res) {
  const { username, fullname, email, phone } = req.body;
  const userData = new userModel({ username, fullname, email, phone });

  userModel.register(userData, req.body.password)
    .then(function () {
      passport.authenticate('local')(req, res, function () {
        res.redirect('/chenge_dp');
      });
    })
});

router.get('/login', function (req, res) {
  res.render('login');
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}), function (req, res) { });

function isLogdden(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

router.get('/logout', function (req, res) {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect('/');
  })
});

module.exports = router;