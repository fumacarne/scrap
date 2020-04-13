const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const handlebars= require('handlebars');
const mongoose= require('mongoose');
const newsSchema= require("./models/news");
const commentsSchema= require("./models/comments");
var exphbs  = require('express-handlebars');
var path = require('path');
let test = ["lalalalalal"]

var app = express();
app.use(express.json());
app.use(express.urlencoded());



app.engine('handlebars',exphbs({extname:'.handlebars'}));
app.set('view engine', 'handlebars');


// app.engine('handlebars', exphbs({defaultLayout: 'index'}));

app.set('views', path.join(__dirname, 'views'));




const url = "https://news.ycombinator.com/";

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI ||  'mongodb://localhost/3030'
mongoose.connect(MONGODB_URI, {useNewUrlParser: true});


var db = mongoose.connection;
var News = mongoose.model('News', newsSchema);
var Comment= mongoose.model('Comments', commentsSchema);

db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', function() {
  console.log('db connected')
});
app.get('/', async (req,res)=>{
  axios.get(url)
  .then(result=>{
    res.send(result.data);
    
  }
  
  
)})


app.get("/api/scrape", (req, res) => {
  axios
    .get(url)
    .then(result => {
        let $ = cheerio.load(result.data);

        let rows =  $('tr');
         let articleHeadlines = $('td.title');
        let parsedArticles = [];

        articleHeadlines.each((i, element) => {
          let title = $(element).children('a').text();
          let source = $(element).children('span').children('a').children('span').text()
          if (title && source){
            let url = $(element).children('a').attr('href');
            let articleObj = {title, url, source }
            parsedArticles.push(articleObj)
          }
        })


      // we're connected!
      // save to mongo with mongoose
      // console.log(result.data);
      News.insertMany(parsedArticles, function(err) {
        if (err) throw err
        res.render("ok parsed")
      });
      //var article = new News({ title: 'article' } );
      //article.save(function (err, res) {
      //  if (err) return console.error(err);
      //  console.log('saved successfully', res)
      //});
      // News.create({title: 'article'}, function (err, doc) {
      //   if (err) return handleError(err);
      //   // saved!
      //   res.json(doc)
      // });

        // return extracted data
    });
});

app.get("/api/news", (req, res) => {
  // use mongoose to get saved news articles
  News.find({}, function (err, docs) {
    if(err) res.json({error: err})
    res.json(docs)
    
  })
});
//   // app.route('/')
//   // get("/api/news", (req, res) => {
//   //   // use mongoose to get saved news articles
//   //   News.find({}, function (err, docs) {
//   //     if(err) res.json({error: err})
//   //     res.json(docs)
//   // })
// });

// app.route('/titles')
//   .get(async(req,res)=>{
//     try{
//       let titlesNames= await db.News.find()
//       let titles= titlesNames.map(name=>({name}));
//       res.render('Titles',{titles})
//     } catch(err){
//       console.log("ERROR",err);
//       res.json({message: "FAIL", reason:err})
//     }
//   })

 
  

app.post("/api/comments", (req, res) => {
  var comment = new Comment(req.body );
  comment.save(function (err, result) {
    if (err) console.error(err);
    console.log('saved successfully')
    res.send(result)
  })});


 
  // insterting a comment for a news article


app.listen(3030, () => {
  console.log("You are in port 3030");
})
