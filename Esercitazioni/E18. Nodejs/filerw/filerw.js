// usiamo il modulo 'fs'
const { readFile, writeFile } = require("fs").promises;

// verifichiamo gli argomenti
// di input da linea di comando
// node filerw -r <nomefile>
// node filerw -w <nomefile> <stream di caratteri>

if (process.argv.length < 4) {
    console.log('Invalid arguments\n\
    Usage: filerw [-r|-w] filename [characters]');
} else {

    switch (process.argv[2]) {
        case '-r':
            readFile(process.argv[3], "utf8")
                .then(text => {
                    console.log(`The file contains: ${text.length} characters`);
                    console.log(text);
                }, error => {
                    console.log(`There was an error while reading the file ${process.argv[3]}: ${error.message}`);
                });
            break;
        case '-w':
            writeFile(process.argv[3], process.argv[4], {
                flag: 'a'
            }).catch(error => {
                console.log(`There was an error when writing the file: ${process.argv[3]}: ${error.message}`);
            });
            break;
        default:
            console.log('Invalid arguments\n\
            Usage: filerw [-r|-w] filename [characters]');
    }
}