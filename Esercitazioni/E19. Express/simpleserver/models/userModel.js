// carichiamo crypto, la configurazione e il middleware per il database
const crypto = require('crypto');
const { config } = require('./db/config');
const { makeDb, withTransaction } = require('./db/dbmiddleware');


async function registrazione(req_body) {
    const db = await makeDb(config);
    let results = {};
    await withTransaction(db, async() => {
        // inserimento utente
        results = await db.query('INSERT INTO `utente` \
            (nome, genere, id_regione, id_provincia, id_comune, data_nascita) \
            SELECT ? AS nome, ? AS genere, \
            `regioni`.id AS id_regione, `province`.id AS id_provincia, `comuni`.id AS id_comune, \
            ? AS data_nascita FROM `regioni`, `province`, `comuni` \
            WHERE `regioni`.nome=? AND `province`.nome=? AND `comuni`.nome=?', [
                req_body.name,
                req_body.gender == 'male' ? 'M' : 'F',
                req_body.birthdate,
                req_body.region,
                req_body.state,
                req_body.town
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
                        req_body.address,
                        req_body.addressnum,
                        req_body.cap,
                        req_body.city,
                        req_body.tel
                    ]
                ]
            ])
            .catch(err => {
                throw err;
            });
        console.log('Inserimento tabella indirizzo');
        console.log(results);
        // generazione della password cifrata con SHA512
        let pwdhash = crypto.createHash('sha512'); // istanziamo l'algoritmo di hashing
        pwdhash.update(req_body.pass); // cifriamo la password
        let encpwd = pwdhash.digest('hex'); // otteniamo la stringa esadecimale
        console.log('Password cifrata');
        results = await db.query('INSERT INTO `autenticazione` \
            (id_utente, email, password) VALUES ?', [
                [
                    [
                        id_utente,
                        req_body.email,
                        encpwd
                    ]
                ]
            ])
            .catch(err => {
                throw err;
            });
        console.log(results);
    });
    return results;
}


async function autenticazione(req_body) {
    // istanziamo il middleware
    const db = await makeDb(config);

    // formattiamo la nostra struttura dati di ritorno
    let returndata = { errcode: 200, errmsg: 'OK', user: null };
    let results = {}

    await withTransaction(db, async() => {
        // inserimento utente
        results = await db.query('SELECT * FROM `autenticazione`\
        WHERE email = ?', [
                req_body.email
            ])
            .catch(err => {
                throw err;
            });
        if (results.length == 0) {
            console.log('Utente non trovato!');
            returndata.errcode = 404;
            returndata.errmsg = 'Utente non trovato';
            //next(createError(404, 'Utente non trovato'));
        } else {
            let pwdhash = crypto.createHash('sha512'); // istanziamo l'algoritmo di hashing
            pwdhash.update(req_body.pass); // cifriamo la password
            let encpwd = pwdhash.digest('hex'); // otteniamo la stringa esadecimale
            if (encpwd != results[0].password) {
                // password non coincidenti
                console.log('Password errata!');
                returndata.errcode = 403;
                returndata.errmsg = 'Password errata';
                //next(createError(403, 'Password errata'));
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
                returndata.user = results[0];
            }
        }
    });
    return returndata;
}


module.exports = { registrazione, autenticazione }