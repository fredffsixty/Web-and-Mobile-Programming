/*
 * Implementazione operazioni CRUD sull'utente
 * 
 * Creazione dell'utente:
 * node mysqlapp.js -c nome M|F data_nascita regione provincia comune via num cap località tel email password
 * 
 * Lettura delle informazioni anagrafiche se il login è ok:
 * node mysqlapp.js -r email password
 *
 * Aggiornamento dell'utente:
 * node mysqlapp.js -u email password tabella campo valore
 * 
 * Cancellazione:
 * node mysqlapp.js -d email password
 * 
 */

// carichiamo il modulo crypto per cifrare le password
const crypto = require('crypto');

// carichiamo la nostra configurazione di connessione
const { config } = require('./config');

// carichiamo il middleware
const { makeDb, withTransaction } = require('./dbmiddleware');

// eliminiamo il comando node, il nome dello script e l'opzione
let record = process.argv.slice(3);

// gestiamo le transazioni legate alle singole
// operazioni CRUD
(async function crud() {

    // creiamo il nostro database con la configurazione data
    const db = await makeDb(config);
    console.log('database creato: ');
    let results = {};

    switch (process.argv[2]) {
        case '-c':
            try {

                await withTransaction(db, async() => {
                    // inserimento utente
                    results = await db.query('INSERT INTO `utente` \
                (nome, genere, id_regione, id_provincia, id_comune, data_nascita) \
                SELECT ? AS nome, ? AS genere, \
                `regioni`.id AS id_regione, `province`.id AS id_provincia, `comuni`.id AS id_comune, \
                ? AS data_nascita FROM `regioni`, `province`, `comuni` \
                WHERE `regioni`.nome=? AND `province`.nome=? AND `comuni`.nome=?', record.slice(0, 6))
                        .catch(err => { console.log(err); });

                    console.log('Inserimento tabella utente');
                    console.log(results);

                    // recupero dello user id
                    let id_utente = results.insertId;

                    let insert = record.slice(6, 11);
                    insert.unshift(id_utente);

                    // inserimento indirizzo
                    results = await db.query('INSERT INTO `indirizzo` \
                (id_utente, via, numero, cap, localita, telefono) VALUES ?', [
                            [insert]
                        ])
                        .catch(err => { console.log(err); });

                    console.log('Inserimento tabella indirizzo');
                    console.log(results);

                    // generazione della password cifrata con SHA512
                    results = await db.query('SELECT sha2(?,512) AS encpwd', [record[12]])
                        .catch(err => { console.log(err); });

                    let encpwd = results[0].encpwd;
                    console.log('Password cifrata');
                    console.log(results);

                    results = await db.query('INSERT INTO `autenticazione` \
                (id_utente, email, password) VALUES ?', [
                            [
                                [
                                    id_utente,
                                    record[11],
                                    encpwd
                                ]
                            ]
                        ])
                        .catch(err => { console.log(err); });

                    console.log(results);
                    console.log(`Utente ${record[11]} inserito!`);

                });
            } catch (err) {
                console.log(err);
            }
            break;
        case '-r':
            try {

                await withTransaction(db, async() => {
                    // reperimento dati utente
                    results = await db.query('SELECT * FROM `autenticazione`\
                    WHERE email = ?', record[0])
                        .catch(err => { console.log(err); });

                    if (results.affectedRows == 0) {
                        console.log('Utente non trovato!');
                    } else {
                        let pwdhash = crypto.createHash('sha512'); // istanziamo l'algoritmo di hashing
                        pwdhash.update(record[1]); // cifriamo la password
                        let encpwd = pwdhash.digest('hex'); // otteniamo la stringa esadecimale

                        if (encpwd != results[0].password) {
                            // password non coincidenti
                            console.log('Password errata!');
                        } else {
                            console.log('Utente autenticato');
                            console.log(results);
                            // recupero dello user id
                            let id_utente = results[0].id_utente;

                            // recupero informazioni anagrafiche
                            results = await db.query('SELECT `utente`.nome, `utente`.genere,\
                            `utente`.data_nascita, `indirizzo`.via, `indirizzo`.numero,\
                            `indirizzo`.localita, `indirizzo`.cap,`indirizzo`.telefono\
                            FROM `utente`, `indirizzo` \
                            WHERE `utente`.id = ? AND `indirizzo`.id_utente = ?', [id_utente, id_utente])
                                .catch(err => { console.log(err); });

                            console.log('Dati utente:');
                            console.log(results[0]);
                        }
                    }
                });
            } catch (err) {
                console.log(err);
            }
            break;
        case '-u':
            try {

                await withTransaction(db, async() => {
                    // reperimento dati utente
                    results = await db.query('SELECT * FROM `autenticazione`\
                        WHERE email = ?', record[0])
                        .catch(err => { console.log(err); });

                    if (results.affectedRows == 0) {
                        console.log('Utente non trovato!');
                    } else {
                        let pwdhash = crypto.createHash('sha512'); // istanziamo l'algoritmo di hashing
                        pwdhash.update(record[1]); // cifriamo la password
                        let encpwd = pwdhash.digest('hex'); // otteniamo la stringa esadecimale

                        if (encpwd != results[0].password) {
                            // password non coincidenti
                            console.log('Password errata!');
                        } else {
                            console.log('Utente autenticato');
                            console.log(results);
                            // recupero dello user id
                            let id_utente = results[0].id_utente;

                            if (record[2] == 'autenticazione' && record[3] == 'password') {
                                // generazione della password cifrata con SHA512
                                results = await db.query('SELECT sha2(?,512) AS encpwd', [record[4]])
                                    .catch(err => { console.log(err); });

                                record[4] = results[0].encpwd;
                            }

                            results = await db.query('UPDATE ?? SET\
                            ?? = ? WHERE id_utente = ?', [record[2], record[3], record[4], id_utente])
                                .catch(err => { console.log(err); });

                            console.log('Dati utente aggiornati:');
                            console.log(results);
                        }
                    }
                });
            } catch (err) {
                console.log(err);
            }
            break;
        case '-d':
            try {

                await withTransaction(db, async() => {
                    // reperimento dati utente
                    results = await db.query('SELECT * FROM `autenticazione`\
                        WHERE email = ?', record[0])
                        .catch(err => { console.log(err); });

                    if (results.affectedRows == 0) {
                        console.log('Utente non trovato!');
                    } else {
                        let pwdhash = crypto.createHash('sha512'); // istanziamo l'algoritmo di hashing
                        pwdhash.update(record[1]); // cifriamo la password
                        let encpwd = pwdhash.digest('hex'); // otteniamo la stringa esadecimale

                        if (encpwd != results[0].password) {
                            // password non coincidenti
                            console.log('Password errata!');
                        } else {
                            console.log('Utente autenticato');
                            console.log(results);
                            // recupero dello user id
                            let id_utente = results[0].id_utente;

                            // cancellazione indirizzo
                            results = await db.query('DELETE FROM `indirizzo`\
                                WHERE `indirizzo`.id_utente = ?', id_utente)
                                .catch(err => { console.log(err); });

                            console.log('indirizzo rimosso');
                            console.log(results);

                            // cancellazione autenticazione
                            results = await db.query('DELETE FROM `autenticazione`\
                                WHERE `autenticazione`.id_utente = ?', id_utente)
                                .catch(err => { console.log(err); });

                            console.log('dati login rimossi');
                            console.log(results);

                            // cancellazione indirizzo
                            results = await db.query('DELETE FROM `utente`\
                                WHERE `utente`.id = ?', id_utente)
                                .catch(err => { console.log(err); });

                            console.log('utente rimosso');
                            console.log(results);
                        }
                    }
                });
            } catch (err) {
                console.log(err);
            }
            break;
        default:
            db.end();
            console.log('Invalid operation:\
        use -c | -r | -u | -d');
    }
})();