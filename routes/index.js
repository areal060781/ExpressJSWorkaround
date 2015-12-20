var express = require('express');
var router = express.Router();
//var TinyURL = require('tinyurl');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Classic Hello world */
router.get('/helloworld', function(req, res) {
  res.render('helloworld', { title: 'Hello world!' });
});

/*GET UserList page*/
router.get('/userlist', function(req, res){
  var db = req.db;
  var collection = db.get('usercollection');
  collection.find({}, {}, function(e, docs){
    res.render('userlist', {
      "userlist" : docs
    });
  });
});

/*GET New user page*/
router.get('/newuser', function(req, res){
  res.render('newuser', {title: 'Add new user'});
});

/*POST to add user service*/
router.post('/adduser', function(req, res){
  //Set our iternal database variable
  var db = req.db;

  //Get our form values. These rely on the "name" attributes
  var userName = req.body.username;
  var userEmail = req.body.useremail;

  //Set our collection
  var collection = db.get('usercollection');

  //Submit to the database
  collection.insert({
    "username": userName,
    "email": userEmail
  }, function(err, doc){
    if(err){
      //If it failed, return error
      res.send("Hubo un problema agregando la información a la base de datos")
    }else{
      //And foward to success page
      res.redirect("userlist");
    }
  });
});

/*TinyURL.shorten('http://google.com', function(res){
  console.log(res);
});*/


module.exports = router;
