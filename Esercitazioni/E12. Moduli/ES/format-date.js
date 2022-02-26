// L'importazione usa la parola chiave import (opzionale import ... as)
// lesportazione usa la parola chiave export
// export default indica il binding di default del modulo

import ordinal from "./ordinal.js";
import { days as giorni, months } from "./date-names.js";

export default function formatDate(date, format) {
    return format.replace(/YYYY|M(MMM)?|Do?|dddd/g, tag => {
        if (tag == "YYYY") return date.getFullYear();
        if (tag == "M") return date.getMonth();
        if (tag == "MMMM") return months[date.getMonth()];
        if (tag == "D") return date.getDate();
        if (tag == "Do") return ordinal(date.getDate());
        if (tag == "dddd") return giorni[date.getDay()];
    });
};