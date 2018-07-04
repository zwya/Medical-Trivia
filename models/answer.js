var mongoose = require('mongoose');

var answerSchema = new mongoose.Schema({
  answertext: {type: String, required: true},
  iscorrect: {type: Boolean, required: true},
  question: {type: mongoose.Schema.Types.ObjectId, ref: 'Question', required:true}
});

module.exports = mongoose.model('Answer', answerSchema);
