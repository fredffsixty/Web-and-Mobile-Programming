'use strict';

function pippo() {
    for (i = 0; i < 5; i++)
        console.log('ciao!');
}

function People(name, surname) {
    this.name = name;
    this.surname = surname;
}

//pippo();
let fred = People('Fred', 'Flinstone'); // manca new che crea un nuovo this per l'oggetto creato
console.log(`${fred.name} ${fred.surname}`);