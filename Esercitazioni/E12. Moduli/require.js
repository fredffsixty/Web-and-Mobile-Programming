// richiesta di un modulo installato globalmente
// che non inizia con ./ o ../
const { readFileSync } = require('fs');

myrequire.cache = Object.create(null);

function myrequire(name) {
    if (!(name in myrequire.cache)) {
        let code = '';
        code = readFileSync(name);
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

const { fd } = myrequire('./CommonJS/format-date.js');

fd(new Date(), 'Do')