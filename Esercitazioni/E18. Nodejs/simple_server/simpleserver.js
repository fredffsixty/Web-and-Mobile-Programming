// istanza del server
const { createServer } = require("http");

// gestione dei percorsi dei file
const { parse, URLSearchParams } = require("url");
const { resolve, sep } = require("path");

// istanza del flusso dati della risposta
const { createReadStream } = require("fs");

// gestione delle informazioni su file e directory
const { stat, readdir } = require("fs").promises;

// gestione dei tipi MIME
const mime = require("mime");

// parsing della stringa di query
const qs = require('querystring');

// gestione dei processi per avviare l'applicazione
// che gestisce le richieste GET con query 
// ovvero le richieste POST
const { execFileSync } = require('child_process');

// l'oggetto process consente di accedere alla shell da cui abbiamo invocato node
const baseDirectory = process.cwd();

// conterrà tutti i gestori dei metodi di richiesta
const methods = Object.create(null);

createServer((request, response) => {

    // request.method coincide con 'GET', 'POST', 'DELETE' ...
    // quindi methods['GET'] --> methods.GET cioè invoca
    // un metodo chiamato GET dell'oggetto methods
    let handler = methods[request.method] || notAllowed;

    handler(request)
        .catch(error => {
            if (error.status != null) return error;
            return { body: String(error), status: 500 };
        })
        .then(({ body, status = 200, type = "text/plain" }) => {
            response.writeHead(status, { "Content-Type": type });
            if (body && body.pipe) body.pipe(response);
            else response.end(body);
        });
}).listen(8000);

// handler per il codice 405 richiesta non consentita
async function notAllowed(request) {
    return {
        status: 405,
        body: `Method ${request.method} not allowed.`
    };
}

// gestione del percorso della risorsa
// restituisce eventualmente anche la query
function urlPath(url) {
    let { pathname, query } = parse(url);

    // risoluzione dei percorsi relativi
    // sul percorso della risorsa da cui abbiamo rimosso
    // il carattere '/' iniziale
    let path = resolve(decodeURIComponent(pathname).slice(1));

    // check che la cartella non sia "al di sopra" di baseDirectory
    if (path != baseDirectory &&
        !path.startsWith(baseDirectory + sep)) {
        throw { status: 403, body: "Forbidden" };
    }

    if (query != null) {
        // oggetto che contiene le coppie chiave valore
        // della richiesta
        let params = qs.parse(query);

        return { path, params };

    } else
        return { path, query };
}

// Esecuzione dell'applicazione
function execServerApp(path, params) {
    // argomenti dell'invocazione del processo node
    let arguments = [];

    // oggetto della risposta
    let response = { body: '', type: 'text/html' };

    // isoliamo il nome dell'applicazione dal path
    arguments.push(path.split(sep).pop());

    // facciamo il parsing dei parametri della query
    for (let key of Object.keys(params)) {
        arguments.push(key);
        arguments.push(params[key]);
    }

    // eseguiamo il processo in maniera sincrona con un timeout di 2 sec
    try {
        response.body = execFileSync('node', arguments, {
            // chiamiamo node nella directory che contiene lo script
            cwd: path.substring(0, path.indexOf(path.split(sep).pop())),
            timeout: 2000
        });

        return response;

    } catch (error) {
        throw (error);
    }

}

// Metodo GET

methods.GET = async function(request) {
    let { path, params } = urlPath(request.url);

    let stats;
    try {
        stats = await stat(path); // stat è asincrona perché accede al disco
    } catch (error) {
        if (error.code != "ENOENT") throw error; // ENOENT --> risorsa non trovata
        else return { status: 404, body: "File not found" };
    }
    if (stats.isDirectory() && params == null) {
        return { body: (await readdir(path)).join("\n") };
        // retituisce la lista dei file 
        // se la risorsa è una cartella
    } else {
        // se la query è presente la passa all'applicazione 
        // che si trova alla fine del path
        if (params != null) {

            try {
                return execServerApp(path, params);
            } catch (error) {
                throw error;
            }
        }

        // altrimenti crea la risposta dallo stream
        // con il tipo MIME inferito dal nome del file
        else
            return {
                body: createReadStream(path),
                type: mime.getType(path)
            };
    }
};

methods.POST = function(request) {
    return new Promise((resolve, reject) => {

        if (request.headers['content-type'] === 'application/x-www-form-urlencoded') {
            // richiediamo solo il path dall'oggetto restituito
            // dalla funzione
            let { path } = urlPath(request.url);

            // corpo della richiesta che conterrà
            // le coppie chiave valore
            let body = '';

            // l'oggetto request risponde agli eventi 'data'
            // quando arriva un 'chunck' di dati cioè un flusso di byte
            // e 'end' quando sono arrivati tutti i dati
            request.on('data', function(data) {

                // aggiungiamo i dati in arrivo a quelli già arrivati
                body += data.toString();

                // chiudiamo la connessione se i dati sono troppi
                // per un tentativo di flooding
                if (body.length > 1e6)
                    request.destroy();
            });

            request.on('end', () => {

                // parsing thel corpo della richiesta
                // restituisce un oggetto che contiene
                // le coppie chiave-valore

                try {
                    resolve(execServerApp(path, qs.parse(body)));
                } catch (error) {
                    throw error;
                }

            });
        } else {
            reject(null);
        }
    });
}