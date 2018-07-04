var express = require('express');
var router = express.Router();
var multer = require('multer');
var DIR = './uploads/';
var upload = multer({dest: DIR}).single('photo');
var fs = require('fs');
var checksum = require('checksum');
var Image = require('../models/image');
const acceptedmimeTypes = ['image/jpeg', 'image/png'];

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
            var bitmap = fs.readFileSync(DIR + sum + '.' + fileExt);
            var data = new Buffer(bitmap).toString('base64');
            if(!img){
              var img = new Image({
                path: DIR + sum + '.' + fileExt,
                imagemd5: sum
              });
              img.save(function(err, img) {
                return res.status(201).json({
                  message: 'Saved image',
                  obj: img,
                  data: data
                });
              });
            }
            else {
              res.status(201).json({
                message: 'Saved image',
                obj: img,
                data: data
              });
            }
          });
        });
      });
    }
  });
});

module.exports = router;
