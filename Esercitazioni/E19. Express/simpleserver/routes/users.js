var createError = require('http-errors');
var express = require('express');
var router = express.Router();

// carichiamo crypto, la configurazione e il middleware per il database
const crypto = require('crypto');
const { config } = require('../db/config');
const { makeDb, withTransaction } = require('../db/dbmiddleware');

/* La rotta /users è vietata */
router.get('/', function(req, res, next) {
    next(createError(403));
});

/* Registrazione Utente */
router.post('/utenteregistrato', registrazione);

/* Login Utente */
router.post('/login', autenticazione);

// middleware di registrazione
async function registrazione(req, res, next) {
    // istanziamo il middleware
    const db = await makeDb(config);
    let results = {};
    try {

        await withTransaction(db, async() => {
            // inserimento utente
            results = await db.query('INSERT INTO `utente` \
        (nome, genere, id_regione, id_provincia, id_comune, data_nascita) \
        SELECT ? AS nome, ? AS genere, \
        `regioni`.id AS id_regione, `province`.id AS id_provincia, `comuni`.id AS id_comune, \
        ? AS data_nascita FROM `regioni`, `province`, `comuni` \
        WHERE `regioni`.nome=? AND `province`.nome=? AND `comuni`.nome=?', [
                    req.body.name,
                    req.body.gender == 'male' ? 'M' : 'F',
                    req.body.birthdate,
                    req.body.region,
                    req.body.state,
                    req.body.town
                ])
                .catch(err => {
                    throw err;
                });

            console.log('Inserimento tabella utente');
            console.log(results);

            // recupero dello user id
            let id_utente = results.insertId;

            // inserimento indirizzo
            results = await db.query('INSERT INTO `indirizzo` \
        (id_utente, via, numero, cap, localita, telefono) VALUES ?', [
                    [
                        [
                            id_utente,
                            req.body.address,
                            req.body.addressnum,
                            req.body.cap,
                            req.body.city,
                            req.body.tel
                        ]
                    ]
                ])
                .catch(err => {
                    throw err;
                });

            console.log('Inserimento tabella indirizzo');
            console.log(results);

            // generazione della password cifrata con SHA512
            results = await db.query('SELECT sha2(?,512) AS encpwd', [req.body.pass])
                .catch(err => {
                    throw err;
                });

            let encpwd = results[0].encpwd;
            console.log('Password cifrata');
            console.log(results);

            results = await db.query('INSERT INTO `autenticazione` \
        (id_utente, email, password) VALUES ?', [
                    [
                        [
                            id_utente,
                            req.body.email,
                            encpwd
                        ]
                    ]
                ])
                .catch(err => {
                    throw err;
                });

            console.log(results);
            console.log(`Utente ${req.body.email} inserito!`);
            res.render('landing', { title: 'Registrazione effettuata' });

        });
    } catch (err) {
        console.log(err);
        next(createError(500));
    }
}

// middleware di autenticazione
async function autenticazione(req, res, next) {
    // istanziamo il middleware
    const db = await makeDb(config);
    let results = {};
    try {

        await withTransaction(db, async() => {
            // inserimento utente
            results = await db.query('SELECT * FROM `autenticazione`\
            WHERE email = ?', [
                    req.body.email
                ])
                .catch(err => {
                    throw err;
                });

            if (results.length == 0) {
                console.log('Utente non trovato!');
                next(createError(404, 'Utente non trovato'));
            } else {
                let pwdhash = crypto.createHash('sha512'); // istanziamo l'algoritmo di hashing
                pwdhash.update(req.body.pass); // cifriamo la password
                let encpwd = pwdhash.digest('hex'); // otteniamo la stringa esadecimale

                if (encpwd != results[0].password) {
                    // password non coincidenti
                    console.log('Password errata!');
                    next(createError(403, 'Password errata'));
                } else {
                    console.log('Utente autenticato');
                    console.log(results);
                    // recupero dello user id
                    let id_utente = results[0].id_utente;

                    // recupero informazioni anagrafiche
                    results = await db.query('SELECT `utente`.nome, `utente`.genere,\
                        DATE_FORMAT(`utente`.data_nascita,"%d/%m/%Y") AS data_nascita, `indirizzo`.via, `indirizzo`.numero,\
                        `indirizzo`.localita, `indirizzo`.cap,`indirizzo`.telefono\
                        FROM `utente`, `indirizzo` \
                        WHERE `utente`.id = ? AND `indirizzo`.id_utente = ?', [
                            id_utente,
                            id_utente
                        ])
                        .catch(err => {
                            throw err;
                        });

                    console.log('Dati utente:');
                    console.log(results[0]);
                    res.render('profile', {
                        title: 'Profilo Utente',
                        profile: {
                            user: req.body.email,
                            data: results[0]
                        }
                    });
                }
            }
        });
    } catch (err) {
        console.log(err);
        next(createError(500));
    }
}
module.exports = router;