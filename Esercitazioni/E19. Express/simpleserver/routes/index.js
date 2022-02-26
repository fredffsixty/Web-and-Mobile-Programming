var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'La mia Home Page' });
});

/* GET login page. */
router.get('/accedi', function(req, res, next) {
    res.render('login', { title: 'Accedi' });
});

/* GET registration page. */
router.get('/registrati', function(req, res, next) {
    res.render('registration', { title: 'Registrazione' });
});

module.exports = router;