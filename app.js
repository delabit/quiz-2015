var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var partials = require('express-partials');
var session = require('express-session');

var routes = require('./routes/index');

var methodOverride = require('method-override');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());
app.use(methodOverride('_method'));

app.use(cookieParser('Quiz 2015'));
app.use(session());

// Sessions
app.use(function(req, res, next){
    // guardar path en session.redir
    if(!req.path.match(/\/login|\/logout/)){
        req.session.redir = req.path;
    }
    // visible para las vistas
    res.locals.session = req.session;
    next();
});

// Autologout (Session timeout - 2 min)
app.use(function(req, res, next){
    // si logueado
    if(req.session.user){
        // Comparramos tran. actual con la anterior
        var currentTime = new Date().getTime();
        var limit = 2 * 60 * 1000; // 2 min
        var diff = currentTime - req.session.lastEvent;
        if(diff > limit){
            // logout
            delete req.session.lastEvent;
            res.redirect('/logout');
        }else{
            // Grabamos última transacción
            req.session.lastEvent = new Date().getTime();   
        }
    }
    next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
