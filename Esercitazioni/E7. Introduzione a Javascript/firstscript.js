// Semplice codice di test
// per la dichiarazione delle variabili, la
// gestione di numeri e stringhe
// e l'introduzione alle funzioni

var foo, baz = 35.76e-3;
var bar = 'pippo';

if (!foo || newvar) {
    let myvar = false;
    var another = 'pippo'.length;
}

var myFun = function(x) {

    let num = 0;
    if (typeof x == 'string')
        num = Number.parseFloat(x);
    else
        num = x;

    console.log(2 * x + 3);
    console.log(baz.toPrecision(6));
}

function longestWord(phrase) {

    let words = phrase.split(/\W+/);

    let res = '',
        len = -1000;

    // for ... in cicla sugli indici/chiavi di un array
    // for ... of cicla sui valori di un array
    for (word of words) {
        if (word.length > len) {
            res = word;
            len = word.length;
        }
    }

    return res;
}

// versione polimorfa
function longestSequence(phrase, ...args) {

    let words;

    if (arguments.length > 1) {

        if ((typeof args[0] == 'string' || args[0] instanceof RegExp)) {
            if (typeof args[1] == 'number')
                words = phrase.split(args[0], args[1]);
            else
                words = phrase.split(args[0]);
        } else if (typeof args[0] == 'number')
            words = phrase.split(/\W+/, args[0]);
    } else
        words = phrase.split(/\W+/);

    let res = '',
        len = -1000;

    // for ... in cicla sugli indici/chiavi di un array
    // for ... of cicla sui valori di un qualunque "oggetto iterabile"
    // come Array, String, NodeList etc. generando un "iteratore"
    // cioè un particolare oggetto che itera su una sequenza
    // e la consuma, cioè non consente di tornare indietro
    for (word of words) {
        if (word.length > len) {
            res = word;
            len = word.length;
        }
    }

    return res;
}

var sinc = x => x == 0 ? 1 : Math.sin(Math.PI * x) / (Math.PI * x);