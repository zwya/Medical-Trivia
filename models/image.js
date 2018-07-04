var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
  path: {type: String, required: true},
  imagemd5: {type: String, required: true}
});

module.exports = mongoose.model('Image', imageSchema);
