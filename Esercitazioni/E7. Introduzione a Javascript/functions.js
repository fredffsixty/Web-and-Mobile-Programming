// Passaggio dei parametri per valore
// tramite copia
function f(x) {
    x = x.replace(/p/g, '*');
    console.log(x);
}
var y = 'Pippo';
f(y);
y;

// Closure: metodo per conservare
// il valore di una variabile locale ad una funzione
// da una chiamata all'altra
function wrapValue(n) {
    let local = n;
    return () => local;
}

// Esempio più complesso
// che accetta un parametro
function gaussian(mu, sigma) {

    return x => (1 / (sigma * Math.sqrt(2 * Math.PI))) *
        Math.exp(-((x - mu) ** 2) / (2 * sigma ** 2));

}

// normal(x) è una funzione con un argomento
// che genera il valore della gaussiana 
// con media 0 e deviazione standard 1
var normal = gaussian(0, 1);

// Ricorsione
function fibonacci(num) {

    if (num = 1) {

        return 1;

    }

    return fibonacci(num - 1) + fibonacci(num - 2);
}