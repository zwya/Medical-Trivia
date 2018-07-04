var express = require('express');
var router = express.Router();
var paginate = require('express-paginate');
var jwt = require('jsonwebtoken');

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
    if(!decoded.user.admin) {
      return res.status(401).json({
        title: 'Not Authenticated',
        error: err
      });
    }
    next();
  });
});

router.post('/', function(req, res, next){
  var question = new Question({
    question: req.body.question,
    image: req.body.imageid
  });
  question.save(function(err, question) {
    if(err) {
      console.log(err);
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }
    var allAnswers = [];
    if(req.body.answers.length != 4) {
      return res.status(500).json({
        title: 'Answers length must be exactly 4'
      });
    }
    allAnswers.push(new Answer({
      answertext: req.body.answers[0],
      iscorrect: true,
      question: question._id
    }));
    for(var i=1;i<req.body.answers.length;i++) {
      allAnswers.push(new Answer({
        answertext: req.body.answers[i],
        iscorrect: false,
        question: question._id
      }));
    }
    Answer.create(allAnswers, function(err, answers) {
      if(err) {
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }
      var answerIds = [];
      answers.forEach(function(item) {
        answerIds.push(item._id);
      });
      question.answers = answerIds;
      question.save(function(err, question){
        if(err) {
          return res.status(500).json({
            title: 'An error occured',
            error: err
          });
        }
        res.status(201).json({
          title: 'Question Saved',
          obj: question
        });
      });
    });
  });
});

router.get('/:id', function(req, res, next){
  Question.findById(req.params.id).populate('answers', ['answertext']).exec(function(err, question) {
      if(err){
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }
      res.status(201).json(question);
  });
});

router.get('/', function(req, res, next){
  Question.find().limit(req.query.limit).skip(req.skip).populate('answers', ['answertext', '_id']).exec(function(err, question) {
    if(err){
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }
    Question.count({}, function(err, count) {
      if(err){
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }
      const pageCount = Math.ceil(count / req.query.limit);
      res.status(201).json({
        has_more: paginate.hasNextPages(req)(pageCount),
        question: question[0]
      });
    });
  });
});

router.patch('/:id', function(req, res, next) {
  Question.findById(req.params.id, function(err, question) {
    if(err){
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }
    if(!question) {
      return res.status(500).json({
        title: 'Question not found'
      });
    }
    Answer.remove({_id: question.answers}, function(err, result) {
      if(err){
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }
    });
    var allAnswers = [];
    if(req.body.answers.length != 4) {
      return res.status(500).json({
        title: 'Answers length must be exactly 4'
      });
    }
    allAnswers.push(new Answer({
      answertext: req.body.answers[0],
      iscorrect: true,
      question: question._id
    }));
    for(var i=1;i<req.body.answers.length;i++) {
      allAnswers.push(new Answer({
        answertext: req.body.answers[i],
        iscorrect: false,
        question: question._id
      }));
    }
    Answer.create(allAnswers, function(err, answers) {
      if(err) {
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }
      var answerIds = [];
      answers.forEach(function(item) {
        answerIds.push(item._id);
      });
      question.question = req.body.question;
      question.answers = answerIds;
      question.image = req.body.imageid;
      question.save(function(err, question) {
        if(err) {
          return res.status(500).json({
            title: 'An error occured',
            error: err
          });
        }
        res.status(200).json({
          message: 'Updated question',
          obj: question
        });
      });
    });
  });
});

router.delete('/:id', function(req, res, next) {
  Question.findById(req.params.id, function(err, question) {
    if(err){
      return res.status(500).json({
        title: 'An error occured',
        error: err
      });
    }
    if(!question) {
      return res.status(500).json({
        title: 'Question not found'
      });
    }
    Answer.remove({_id: question.answers}, function(err, result) {
      if(err){
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }
    });
    question.remove(function(err, result) {
      if(err){
        return res.status(500).json({
          title: 'An error occured',
          error: err
        });
      }
      res.status(200).json({
        title: 'Question Removed',
        obj: result
      });
    });
  });
});

module.exports = router;
