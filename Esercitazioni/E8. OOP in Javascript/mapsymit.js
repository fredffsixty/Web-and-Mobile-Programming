// Una classe Map espone l'interfaccia fatta dai metodi
// set(), get(), has()
let archive = new Map();

archive.set('desktop', 56);
archive.set('laptop', 23);
archive.set('smartphone', 12);
archive.set('headset', 24);

// Definizione di iteratore standard e custom
class Persona {

    constructor(name, surname) {
        this.name = name;
        this.surname = surname;
    }

    sayHello = function() {
        console.log(`Hi, my name is ${this.name} ${this.surname}`)
    }
}

let people = [new Persona('Fred', 'Flinstone'),
    new Persona('Barney', 'Rumble'),
    new Persona('Wilma', 'Flinstone')
];

// iteratore standard:
// ritorna esplicitamente l'oggetto {value: <valore>, done: true/false}
let peopleIterator = people[Symbol.iterator]();

// classe iteratore customizzato
class myPeopleIterator {
    constructor(peopleArray) {
        this.count = 0; // uso il contatore interno per stabilire a che punto sono nella sequenza
        this.peopleArray = peopleArray;
    }

    // ridefinizione di next
    next() {
        if (this.count == this.peopleArray.length)
            return { value: undefined, done: true };
        else {
            let obj = {
                // il value è una stringa definita dall'utente
                value: `Hi! My name is ${this.peopleArray[this.count].name} ${this.peopleArray[this.count].surname}!`,
                done: false
            };
            this.count++;
            return obj;
        }

    }
}

// aggancio l'iteratore all'oggetto people
// Se fosse una classe Myclass allora la sintassi sarebbe:
// MyClass.prototype[Symbol.iterator] = function() { return new myPeopleIterator(this) }
people[Symbol.iterator] = function() { return new myPeopleIterator(this) }