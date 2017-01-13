// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var fs = require("fs");                     // read the file system

// var cors = require("cors");
// app.use(cors); // enables cross-origin requests

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// ==================================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function (req, res, next) {
    // do logging - allows CORS (Http headers)
    console.log('Something is happening.');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
    res.json({ message: 'Welcome to the Bookmark urls app' });
});

// more routes for our API will happen here

// Test adding a text reference
var user = {
    "user4":
    {
        "id": 4,
        "category": "category4",
        "title": "title4",
        "url": "url4",
        "description": "description4",
        "bookmarkNote": "bookmarkNote4",
        "read": false
    }
};

// Test updating a text reference
var user_update = {
    "user3":
    {
        "id": 3,
        "category": "category3update",
        "title": "title3update",
        "url": "url3update",
        "description": "description3update",
        "bookmarkNote": "bookmarkNote3update",
        "read": false
    }
};

// accessed by :
// http://localhost:8080/api/references (with get and post methods)

router.route('/references')
    .get(function (req, res) { // get all the text references
        fs.readFile(__dirname + "/" + "textreferences.json", 'utf8', function (err, data) {
            if (err)
                res.send(err);
            console.log(data);
            res.send(data);
        });
    })
    .post(function (req, res) { // post a new text reference
        fs.readFile(__dirname + "/" + "textreferences.json", 'utf8', function (err, data) {
            if (err)
                res.send(err);

            texts = JSON.parse(data);

            var arraytexts = new Array();
            arraytexts = texts; // initalize test array with the data string
            arraytexts.push(user); // add user object

            json = JSON.stringify(arraytexts, null, 4); //convert it back to json with indentation
            fs.writeFile(__dirname + "/" + "textreferences.json", json, 'utf8', function (err, data) {
                if (err)
                    res.send(data);
            }); // write it back to disk

            res.send(texts);
        });
    });

// accessed by :
// http://localhost:8080/api/references/reference_id (with get, put and delete methods)

router.route('/references/:reference_id')
    .get(function (req, res) {  // get a text reference from an id
        fs.readFile(__dirname + "/" + "textreferences.json", 'utf8', function (err, data) {
            if (err)
                res.send(err);
            var users = new Array();
            users = JSON.parse(data);
            user = users.find(x => Object.keys(x)[0] === req.params.reference_id);
            // var user = users["user"+req.params.reference_id];
            console.log(user);
            res.send(user);
        });
    })
    .put(function (req, res) { // update a text reference from an id
        fs.readFile(__dirname + "/" + "textreferences.json", 'utf8', function (err, data) {
            if (err)
                res.send(err);
            texts = JSON.parse(data);

            var arraytexts = new Array();
            arraytexts = texts; // initalize test array with the data string

            // find index of the text to be updated
            var index = arraytexts.findIndex(x => Object.keys(x)[0] === req.params.reference_id);

            // update the text with the new value
            arraytexts[index] = user_update;

            json = JSON.stringify(arraytexts, null, 4); //convert it back to json with indentation 4
            fs.writeFile(__dirname + "/" + "textreferences.json", json, 'utf8', function (err, data) {
                if (err)
                    res.send(data);
            }); // write it back to disk

            res.send(texts);
        });
    })
    .delete(function (req, res) {
        fs.readFile(__dirname + "/" + "textreferences.json", 'utf8', function (err, data) {
            if (err)
                res.send(err);
            texts = JSON.parse(data);

            var arraytexts = new Array();
            arraytexts = texts; // initalize test array with the data string

            // find index of the text to be updated
            var index = arraytexts.findIndex(x => Object.keys(x)[0] === req.params.reference_id);

            arraytexts.splice(index, 1); // delete the text reference

            json = JSON.stringify(arraytexts, null, 4); //convert it back to json with indentation 4
            fs.writeFile(__dirname + "/" + "textreferences.json", json, 'utf8', function (err, data) {
                if (err)
                    res.send(data);
            }); // write it back to disk

            res.send(texts);
        });
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);