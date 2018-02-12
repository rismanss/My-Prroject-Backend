const express = require('express');
const router = express.Router();
const models = require('./../models');
const passportAdmin = require('./../config/passport');
const passport = require('passport');
const jwt = require('jwt-simple');
const jwtConfig = require('./../config/jwtConfig');
const Multer = require('multer');
const img = require('./../config/imgUpload');

const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb
  }
});

const requireAuth = passport.authenticate('jwt', { session: false });

router.get('/user/profil', function(req, res, next) {
  res.send('respond with a resource');
});

router.post(
  '/user/profil',
  requireAuth,
  multer.single('image'),
  img.sendUploadToGCS,
  (req, res) => {
    var data = models.Profiluser.build({
      name: req.body.name,
      tlpn: req.body.tlpn,
      description: req.body.description,
      image: req.file.cloudStoragePublicUrl,
      address: req.body.address,
      userId: req.user.id
    });

    data.save().then(result => {
      res.send(result);
    });
  }
);

router.post('/user/paket', requireAuth, (req, res) => {
  var data = models.Paket.build({
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    kota: req.body.kota,
    userId: req.user.id
  });

  data.save().then(result => {
    res.send(result);
  });
});

router.get('/user/paket/:id', requireAuth, (req, res) => {
  models.Paket.findById(req.params.id, {
    include: [
      {
        model: models.Image,
        as: 'Image'
      }
    ]
  }).then(result => {
    res.send(result);
  });
});

router.post(
  '/user/paket/:id/image',
  requireAuth,
  multer.single('image'),
  img.sendUploadToGCS,
  (req, res) => {
    var data = models.Image.build({
      text: req.body.text,
      image: req.file.cloudStoragePublicUrl,
      paketId: req.params.id
    });
    models.Paket.findById(req.params.id).then(() => {
      data.save().then(result => {
        res.send(result);
      });
    });
  }
);
module.exports = router;
