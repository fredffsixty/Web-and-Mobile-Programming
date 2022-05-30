const { registrazione, autenticazione } = require('../models/userModel');

async function sign_on(req, res, next) {

    try {

        let results = await registrazione(req.body);

        console.log(`Utente ${req.body.email} inserito!`);
        res.render('landing', { title: 'Registrazione effettuata' });

    } catch (err) {
        console.log(err);
        next(createError(500));
    }
}

// middleware di autenticazione
async function login(req, res, next) {

    try {

        let results = await autenticazione(req.body);
        if (results.user == null)
            next(createError(results.errcode, results.errmsg));
        else {
            res.render('profile', {
                title: 'Profilo Utente',
                profile: {
                    user: req.body.email,
                    data: results.user
                }
            });
        }
    } catch (err) {
        console.log(err);
        next(createError(500));
    }
}


module.exports = { sign_on, login };