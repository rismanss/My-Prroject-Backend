const passport = require('passport');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local');
const models = require('./../models');
const jwtConfig = require('./jwtConfig');

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: jwtConfig.secret
};

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  console.log(payload);
  models.User.findById(payload.sub, {
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
  })
    .then(admin => {
      done(null, admin);
    })
    .catch(err => {
      done(err, false);
    });
});

const localOptions = {
  usernameField: 'username'
};

const localLogin = new LocalStrategy(
  localOptions,
  (username, password, done) => {
    models.User.findOne({ where: { username: username } })
      .then(admin => {
        if (!admin) {
          done(null, false);
        } else if (!admin.validPassword(password)) {
          done(null, false, { message: 'Incorrect password.' });
        } else {
          done(null, admin);
        }
      })
      .catch(err => {
        done(err, false, { message: 'Incorret email.' });
      });
  }
);

passport.use(jwtLogin);
passport.use(localLogin);
