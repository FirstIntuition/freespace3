const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();
const https = require('https');
const mysql = require('mysql');

app.use(express.static("linked_files"));

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
  res.sendFile(__dirname+"/homepage.html");
});

app.post("/search", function(req, res){
  console.log(req.body);
  // console.log(typeof req.body.subjects);
  var query='select * from documents, topics';
  var entered = false;
  if (typeof req.body.year != 'undefined') {
    if (!entered) {
      query += ' where (';
    }else {
      query += ' and (';
    }
    entered=true;
    if (typeof req.body.year == 'string') {
      query += "doc_date_asked = '"+req.body.year+"'";
    } else {
      for (var i = 0; i < req.body.year.length; i++) {
        if (i) {
          query += ' or ';
        }
        query +=  "doc_date_asked = '" + req.body.year[i] + "'";
      }
    }
    query += ')';
  }
  if (typeof req.body.collegeYears != 'undefined') {
    if (!entered) {
      query += ' where (';
    }else {
      query += ' and (';
    }
    entered=true;
    if (typeof req.body.collegeYears == 'string') {
      query += "doc_year = '"+req.body.collegeYears+"'";
    } else {
      for (var i = 0; i < req.body.collegeYears.length; i++) {
        if (i) {
          query += ' or ';
        }
        query +=  "doc_year = '" + req.body.collegeYears[i] + "'";
      }
    }
    query += ')';
  }
  if (typeof req.body.examType != 'undefined') {
    if (!entered) {
      query += ' where (';
    }else {
      query += ' and (';
    }
    entered=true;
    if (typeof req.body.examType == 'string') {
      query += "doc_exam = '"+req.body.examType+"'";
    } else {
      for (var i = 0; i < req.body.examType.length; i++) {
        if (i) {
          query += ' or ';
        }
        query +=  "doc_exam = '" + req.body.examType[i] + "'";
      }
    }
    query += ')';
  }
  if (typeof req.body.topics != 'undefined') {
    if (!entered) {
      query += ' where (';
    }else {
      query += ' and (';
    }
    entered=true;
    if (typeof req.body.topics == 'string') {
      query += "topic = '"+req.body.topics+"'";
    } else {
      for (var i = 0; i < req.body.topics.length; i++) {
        if (i) {
          query += ' or ';
        }
        query +=  "topic = '" + req.body.topics[i] + "'";
      }
    }
    query += ')';
  }
  if (typeof req.body.subjects != 'undefined') {
    if (!entered) {
      query += ' where (';
    }else {
      query += ' and (';
    }
    entered=true;
    if (typeof req.body.subjects == 'string') {
      query += "doc_subject = '"+req.body.subjects+"'";
    } else {
      for (var i = 0; i < req.body.subjects.length; i++) {
        if (i) {
          query += ' or ';
        }
        query +=  "doc_subject = '" + req.body.subjects[i] + "'";
      }
    }
    query += ')';
  }
  if (entered) {
    query += ' and';
  }else {
    query += ' where';
  }
  query += ' documents.doc_id=topics.doc_id order by documents.doc_id desc';
  res.send(query);
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "dspace"
  });

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query(query, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
  });
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000.");
});
