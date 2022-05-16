// richiesta di un modulo installato globalmente
// che non inizia con ./ o ../
const { readFileSync } = require('fs');
const { parse, join } = require('path')
const { chdir, cwd } = require('process')

myrequire.cache = Object.create(null);

function myrequire(name) {

    let parsed = parse(name);
    //chdir(join(cwd(), parsed.dir))
    chdir(parsed.dir)
    name = parsed.name

    if (!(name in myrequire.cache)) {
        let code = '';
        code = readFileSync(name + '.js');
        /*            (err, stream) => {
                        if (err) throw err;
                        code = stream;
                    });*/
        let module = { exports: {} };
        myrequire.cache[name] = module;
        let wrapper = Function("require, exports, module", code);
        wrapper(myrequire, module.exports, module);
    }
    return myrequire.cache[name].exports;
}

const { formatDate } = myrequire('./CommonJS/format-date');

console.log(formatDate(new Date(), 'Do'))