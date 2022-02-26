class Persona {

    constructor(name, surname) {
        this.name = name;
        this.surname = surname;
    }

    sayHello() {
        return `Hi, my name is ${this.name} ${this.surname}`;
    }
}

class Professional extends Persona {

    constructor(name, surname, jobtitle, profession) {
        super(name, surname);

        this.jobtitle = jobtitle;
        this.profession = profession;
    }

    whatIsMyProfession() {
        return `I am a ${this.profession}`;
    }

    sayHello() {
        return super.sayHello() + `\nI'm a ${this.jobtitle}, and I work as a ${this.profession}`;
    }
}

let associateProfessor = new Professional('Roberto', 'Pirrone', 'Associate Professor', 'teacher and researcher');
console.log(associateProfessor.whatIsMyProfession());
console.log(associateProfessor.sayHello());