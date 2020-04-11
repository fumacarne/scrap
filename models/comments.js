
var mongoose = require('mongoose')

var commentsSchema = new mongoose.Schema({
    name: String,
    comment:String,
    articleId: String
  });

  //mongoose.model('comments', commentsSchema);
  module.exports = commentsSchema