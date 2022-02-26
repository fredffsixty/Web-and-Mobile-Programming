// L'importazione assegna l'oggetto exports a un
// oggetto costante di cui prescriviamo i nomi delle proprietà
// potrò usare le proprietà direttamente perché vengono definite
// nelo scope globale

const { ordinal } = require("./ordinal");
const datename = require("./date-names");

// Si potrebbe usare la seguewnte sintassi
// const numeriOrdinali = require("./ordinal");
// allora dovrei chiamare numeriOrdinali.ordinal(...)

exports.formatDate = function(date, format) {
    return format.replace(/YYYY|M(MMM)?|Do?|dddd/g, tag => {
        if (tag == "YYYY") return date.getFullYear();
        if (tag == "M") return date.getMonth();
        if (tag == "MMMM") return datename.months[date.getMonth()];
        if (tag == "D") return date.getDate();
        if (tag == "Do") return ordinal(date.getDate());
        if (tag == "dddd") return datename.days[date.getDay()];
    });
};