var createError = require('http-errors');
var express = require('express');
var router = express.Router();

const { sign_on, login } = require('../controllers/userController');

/* La rotta /users è vietata */
router.get('/', function(req, res, next) {
    next(createError(403));
});

/* Registrazione Utente */
router.post('/utenteregistrato', sign_on);

/* Login Utente */
router.post('/login', login);

module.exports = router;