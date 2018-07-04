var express = require('express');
var router = express.Router();
var multer = require('multer');
var DIR = './uploads/';
var upload = multer({dest: DIR}).single('photo');
var fs = require('fs');
var checksum = require('checksum');
var jwt = require('jsonwebtoken');

var Image = require('../models/image');
const acceptedmimeTypes = ['image/jpeg', 'image/png'];

router.use('/', function(req, res, next) {
  const token = req.query.token ? req.query.token : req.get('authorization') ? req.get('authorization') : null;
  jwt.verify(token, 'secret', function(err, decoded) {
    if(err) {
      return res.status(401).json({
        title: 'Not Authenticated',
        error: err
      });
    }
    if(!decoded.user.admin) {
      return res.status(401).json({
        title: 'Not Authenticated',
        error: err
      });
    }
    next();
  });
});

router.get('/:id', function(req, res, next) {
  Image.findById(req.params.id, function(err, img) {
    if(!img) {
      return res.status(500).json({
        message: 'Image not found',
        data: ''
      });
    }
    var bitmap = fs.readFileSync(img.path);
    var data = new Buffer(bitmap).toString('base64');
    res.status(201).json({
      message: 'Image found',
      data: data,
      obj: img
    });
  });
});

router.post('/', function(req, res, next){
  var path = '';
  upload(req, res, function(err) {
    if(err) {
      console.log(err);
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }
    path = req.file.path;
    if(acceptedmimeTypes.indexOf(req.file.mimetype) != -1) {
      checksum.file(path, function(err, sum) {
        if(err) {
          console.log(err);
          return res.status(500).json({
            title: 'An error occured',
            error: err
          });
        }
        const fileExt = req.file.mimetype.split('/')[1];
        fs.rename(path, DIR + sum + '.' + fileExt, function(err) {
          if(err) {
            console.log(err);
            return res.status(500).json({
              title: 'An error occured',
              error: err
            });
          }
          Image.findOne({imagemd5: sum}, function(err, img) {
            if(err) {
              console.log(err);
              return res.status(500).json({
                title: 'An error occured',
                error: err
              });
            }
            if(!img){
              var img = new Image({
                path: DIR + sum + '.' + fileExt,
                imagemd5: sum
              });
              img.save(function(err, img) {
                return res.status(201).json({
                  message: 'Saved image',
                  obj: img
                });
              });
            }
            else {
              res.status(201).json({
                message: 'Saved image',
                obj: img
              });
            }
          });
        });
      });
    }
  });
});

module.exports = router;
