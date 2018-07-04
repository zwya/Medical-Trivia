var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var shuffle = require('shuffle-array');

var Question = require('../models/question');
var Answer = require('../models/answer');

router.use('/', function(req, res, next) {
  jwt.verify(req.query.token, 'secret', function(err, decoded) {
    /*
      err = {
        name: 'TokenExpiredError',
        message: 'jwt expired',
        expiredAt: 1408621000
      }
    */
    if(err) {
      return res.status(401).json({
        title: 'Not Authenticated',
        error: err
      });
    }
    next();
  });
});

router.get('/rand', function(req, res, next){
  Question.count().exec(function(err, count) {
    var random = Math.floor(Math.random() * count)
    Question.findOne().skip(random).populate('answers', ['answertext']).exec(function(err, question) {
      if(err){
        console.log(err);
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }
      question.answers = shuffle(question.answers);
      res.status(201).json(question);
    });
  });
});

router.get('/correct/:id', function(req, res, next){
  Question.findById(req.params.id, function(err, question) {
    if(err) {
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }
    var data = question.answers[0]._id;
    res.status(201).json({data});
  });
});

module.exports = router;
