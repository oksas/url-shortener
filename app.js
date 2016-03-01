"use strict";

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();

const cleanUrl = require("./api/cleanUrl");
const testUrl = require("./api/testUrl");
const shortenUrl = require("./api/shortenUrl");
const findUrl = require("./api/findUrl");

const port = process.env.PORT || 2020;

const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
   res.render("index", {title: "sup dawg"});
});

app.get("/:word", function(req, res) {
   const word = req.params.word;
   
   findUrl(word, function(err, entry) {
       if (err) {
           return res.send(`ERROR: ${err}`);
       }
       console.log(entry.url);
       res.redirect(entry.url);
   });
});

app.post("/shorten", urlencodedParser, function(req, res) {
    
    const url = cleanUrl(req.body.url);
    
    testUrl(url, function(err) {
        if (err) {
            return res.send(`ERROR: ${err}`);
        }
        
        shortenUrl(url, function(err, entry) {
           if (err) {
               return res.send(`ERROR: ${err}`);
           }
            
            res.send(entry.word);
        });
        
    });
});

app.listen(port, function() {
    console.log(`App listening on port ${port}`);
});

