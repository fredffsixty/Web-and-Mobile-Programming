// Semplice API per gestire i cookie
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));

    // facciamo il match a inizio stringa ovvero dopo un ';'
    // 
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options = {}) {

    options = {
        path: '/',
        samesite: 'strict', // richiesto per ragioni di sicurezza
        // eventuali altri valori di default
        ...options
        // con l'operatore ... agganciamo tutte 
        // le proprietà passate nel parametro options all'oggetto options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    if (typeof options.expires == 'string') {
        let exp = new Date(options.expires);
        options.expires = exp.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}


function deleteCookie(name) {
    setCookie(name, "", {
        'max-age': -1
    })
}

function getAllCookies() {
    let cookies = document.cookie.split(';');
    let cookieList = {};

    for (item of cookies) {
        item.trim();
        if (item.indexOf('=') != 0) {
            let cookie = item.split('=');
            if (cookie[0] != 'expires' && cookie[0] != 'path')
                cookieList[cookie[0]] = decodeURIComponent(cookie[1]);
        }
    }

    return cookieList;
}

function isCookieSet(cname) {
    return document.cookie.split(';').some((item) => item.trim().startsWith(cname + '='));
}