var mongoose = require('mongoose');

var questionSchema = new mongoose.Schema({
  question: {type: String, required: true},
  answers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Answer'}],
  image: {type: mongoose.Schema.Types.ObjectId, ref: 'Image', required:true}
});

module.exports = mongoose.model('Question', questionSchema);
