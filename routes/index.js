const express = require('express');
const router = express.Router();
const models = require('./../models');
const passportAdmin = require('./../config/passport');
const passport = require('passport');
const jwt = require('jwt-simple');
const jwtConfig = require('./../config/jwtConfig');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', {
  session: false
});

function tokenForAdmin(admin) {
  var timestamp = new Date().getTime();
  return jwt.encode({ sub: admin.id, iat: timestamp }, jwtConfig.secret);
}

// api untuk halaman awal list user dan list paket
router.get('/', (req, res) => {
  models.User.findAll({
    include: [
      {
        model: models.Profiluser,
        as: 'Profiluser'
      },
      {
        model: models.Paket,
        as: 'Paket',
        include: [
          {
            model: models.Image,
            as: 'Image'
          }
        ]
      }
    ]
  }).then(result => {
    res.send(result);
  });
});

// akun user
router.get('/user', requireAuth, function(req, res) {
  res.json({ user: req.user });
});

// login user
router.post('/login', requireSignin, (req, res, next) => {
  res.json({ token: tokenForAdmin(req.user) });
});

// create user
router.post('/create_user', (req, res, next) => {
  var data = models.User.build({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });

  data
    .save()
    .then(() => {
      res.json({ token: tokenForAdmin(data) });
    })
    .catch(err => {
      res.send(err);
    });
});

module.exports = router;
