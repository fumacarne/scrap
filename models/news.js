var mongoose= require('mongoose');

var newsSchema = new mongoose.Schema({
    title: String,
    url:String,
    source: String
  });

 
  //mongoose.model('news', newsSchema);
  module.exports = newsSchema