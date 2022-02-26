function uncomment(code) {
    let comments = /^(\/\/|\/\*(\s|\w)*|\*\/|\*(\s|\w)*)/gm;

    return code.replace(comments, '');
}

console.log(uncomment(`/*\n\
* This is my comment\n\
*/\n\
let a = 4;\n\
//a = a * 5;`));