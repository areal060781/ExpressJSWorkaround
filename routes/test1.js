var express = require('express');
var router = express.Router();
var request = require('request');

/* Classic Hello world */
router.get('/helloworld', function(req, res) {
    res.render('helloworld', { title: 'Hello world!'});
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

/*AJAX search form*/
router.get('/search', function(req, res){
    res.render('search');
});

/*searchin method*/
router.get('/searching', function(req, res){
    var val = req.query.search;
    var url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20craigslist.search" +
        "%20where%20location%3D%22sfbay%22%20and%20type%3D%22jjj%22%20and%20query%3D%22" + val + "%22&format=" +
        "json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

//resquest module is used to process the yql url and return the results in JSON format
    request(url, function(err, resp, body){
        body = JSON.parse(body);
        //logic used to compare search results with the input from user
        if (!body.query.results.RDF.item){
            results = "No se encontraron resultados. Intente de nuevo";
        }else{
            results = body.query.results.RDF.item[0]['description'];
        }
        //pass back the result to client side
        res.send(results);
    });

    //testing the route
    //res.send("WHEEE");
});

router.get('/url', function(req, res){
    res.render('url', {title: 'Shortener URL', result:'', posturl:''});
});

router.post('/shortenerurl', function(req, res){
    var longURL = req.body.longurl;

    request('http://tinyurl.com/api-create.php?url=' + longURL, function (error, response, body) {
        //cb(body.split("\n")[0]);
        //body = JSON.stringify(body);
        res.render('url', {title: 'Shortener URL', result: body, posturl:longURL});
    });
});

router.get('/searchinglongurl', function(req, res){
    var shortenUrl = req.query.search;

    request('http://api.unshort.tk/index.php?u=' + shortenUrl, function(error, response, body){
        body = JSON.parse(body);
        res.send(body[shortenUrl]);
    });
});

module.exports = router;