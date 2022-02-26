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

class PeopleArray extends Array {

    constructor(...args) {

        let allOK = args.length != 0 && true;

        for (let arg of args) {
            allOK = allOK && (arg instanceof Persona)
        }

        if (allOK) {
            super(arguments.length);
            for (let i = 0; i < arguments.length; i++)
                this[i] = arguments[i]
        } else
            throw TypeError("Cannot allocate a PeopleArray from constructor arguments");

    }
}

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

// definiamo l'iteratore della classe
PeopleArray.prototype[Symbol.iterator] = function() { return new myPeopleIterator(this) }

let persons = new PeopleArray(
    new Persona('Fred', 'Flinstone'),
    new Persona('Barney', 'Rumble'),
    new Persona('Wilma', 'Flinstone')
)

for (let p of persons) {

    console.log(p)
}

let pa = new PeopleArray()