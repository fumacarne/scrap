const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");


var app = express();

const url = "https://news.ycombinator.com/";

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/api/scrape", (req, res) => {
  axios
    .get(url)
    .then(result => {
        let html = cheerio.load(result.data)

        // parse cheerio output

        // save to mongo with mongoose
        console.log(result.data);
      res.send(result.data)
    });
});

app.listen(3000, () => {
  console.log("You are in port 3000");
});
