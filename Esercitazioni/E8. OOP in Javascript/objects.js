// Definizione di oggetto
// plain Javascript
var person = {};

// person è una istanza di Object
person.name = 'Roberto';
person.surname = 'Pirrone';
person.age = 25;
person.isALiar = function() { return true; }

// Creazione di una classe tramite definizione esplicita
// della funzione corstruttore
function Persons(name, ...args) {
    // il costruttore è polimorfo

    this.name = name; // this --> riferimento all'oggetto che fa
    // da contesto all'esecuzione

    // la valutazione da sx a dx degli operatori booleani
    // che considerano vero ciò che è diverso da 0 , null o undefined
    // garantisce che se le prime due condizioni sono vere
    // il risultato sarà il valore del terzo operando
    this.surname = (args && typeof args[0] == 'string' && args[0]) || null;
    this.age = (args && typeof args[0] == 'number' && args[0]) ||
        (args && typeof args[1] == 'number' && args[1]) || null;
}

// La proprietà prototype di un costruttore contiene le proprietà
// che saranno identiche per tutte le istanze degli oggetti della classe
// mentre le proprietà che variano da istanza a istanza sono proprietà
// dirette del costruttore
Persons.prototype.isALiar = function() { return false; }

let jack = new Persons('Jack', 'London', 87);

// Uso di Object.create()
const protoPeople = {
    name: 'Fred',
    surname: 'Flinstone',
    salutation: function() {
        console.log(`Hi everybody! My name is ${this.name} ${this.surname}`);
    }
}

// il nuovo oggetto sovrascrive le proprietà del prototipo
let barney = Object.create(protoPeople);
barney.name = 'Barney';
barney.surname = 'Rumble';

// Persona è una classe secondo la definizione
// ECMAScript 2015 e successive
class Persona {

    constructor(name, surname) {
        this.name = name;
        this.surname = surname;
    }

    sayHello = function() {
        console.log(`Hi, my name is ${this.name} ${this.surname}`)
    }
}

let fred = new Persona('Fred', 'Flinstone');