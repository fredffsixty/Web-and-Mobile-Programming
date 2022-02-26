"use strict";

class People {
    constructor(name, surname, profile) {
        this.name = name;
        this.surname = surname;
        this.profile = profile;
    }

    getProfile() {
        return this.profile;
    }

    setProfile(profile) {
        this.profile = profile;
    }
}

class InvalidAccountError extends Error {}

class Portfolio extends People {
    constructor(name, surname, profile, credit, debit, accounts) {

        super(name, surname, profile);

        try {
            if (!(accounts instanceof Array) && !(accounts[0] instanceof Object))
                throw new InvalidAccountError('Invalid accounts specified!');
        } catch (error) {
            if (error instanceof InvalidAccountError) {
                this.accounts = [{ type: 'base', amount: 0 }];
                console.log('Setting a base account with 0 € amount');
            } else throw error;
        } finally {
            this.hasCreditCard = credit;
            this.hasDebitCard = debit;
        }
    }
}

let portfolio = new Portfolio('Roberto', 'Pirrone', 'standard', true, true, 'ciccio');