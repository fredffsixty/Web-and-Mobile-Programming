// eliminiamo il comando node e il nome dello script
let params = process.argv.slice(2);

if (params != []) {
    let table = '<table>\
                    <tr><th>Chiave</th><th>Valore</th>';
    for (let i = 0; i < params.length; i += 2)
        table += `<tr><td>${params[i]}: </td><td>${params[i+1]}</td></tr>`;

    table += '</table>';
    console.log('<html>\
            <head>\
            <title>Risposta alla query</title>\
            </head>\
            <body>' + table + '</body></html>');
} else {
    console.log('<html>\
            <head>\
            <title>Risposta alla query</title>\
            </head>\
            <body>Non è stato fornito alcun valore</body></html>');
}