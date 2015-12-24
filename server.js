// Module dependencies.
var application_root = __dirname,
    express = require('express'), //Web framework
    bodyParser = require('body-parser'), //Parser for reading request body
    path = require('path'), //Utilities for dealing with file paths
    mongoose = require('mongoose'); //MongoDB integration

//Create server
var app = express();

//Where to serve static content
app.use(express.static(path.join(application_root, 'bookLib')));
app.use(bodyParser());
console.log(app.locals);
//connect to database
mongoose.connect('mongodb://localhost/library_database');

//Schemas
var Book = new mongoose.Schema({
    bookcover: String,
    title: String,
    author: String,
    pubYear: Date
});

//Models
var BookModel = mongoose.model('Book', Book);

//apis
app.get('/books', function (req, res) {
    return BookModel.find(function (err, books) {
        if (!err) {
            console.log('fetched');
            return res.send(books);
        } else {
            return console.log(err);
        }
    })
});

app.post('/books', function (req, res) {
    var book = new BookModel({
        bookcover: req.body.bookcover,
        title: req.body.title,
        author: req.body.author,
        pubYear: req.body.pubYear
    });
    return book.save(function (err) {
        if (!err) {
            console.log('created');
            return res.send(book);
        } else {
            console.log(err);
        }
    })
});

app.get('/books/:id', function (req, res) {
    return BookModel.findById(req.params.id, function (err, book) {
        if (!err) {
            return res.send(book);
        } else {
            return console.log(err);
        }
    })
});

app.put('/books/:id', function (req, res) {
    console.log('Updating book ' + req.body.title);
    return BookModel.findById(req.params.id, function (err, book) {
        book.bookcover = req.body.bookcover;
        book.title = req.body.title;
        book.author = req.body.author;
        book.pubYear = req.body.pubYear;

        return book.save(function (err) {
            if (!err) {
                console.log('book updated');
                return res.send(book);
            } else {
                console.log(err);
            }
        });
    });
});

app.delete('/books/:id', function (req, res) {
    console.log('Deleting book with id: ' + req.params.id);
    return BookModel.findById(req.params.id, function (err, book) {
        return book.remove(function (err) {
            if (!err) {
                console.log('Book removed');
                return res.send('');
            } else {
                console.log(err);
            }
        });
    });
});

//Start server
var port = 4711;

app.listen(port, function () {
    console.log('Express server listening on port %d in %s mode', port, app.settings.env);
});