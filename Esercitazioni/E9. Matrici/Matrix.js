class Matrix {
    constructor(height, ...data) {

        // la dimensione è 0 di default con contenuto vuoto
        // nel caso di costruttore che fallisce
        this.height = this.width = 0;
        this.content = [];

        // Matrix('magic')
        if (height == 'magic') {
            this.height = this.width = 3;
            this.content = [2, 7, 6, 9, 5, 1, 4, 3, 8]; // magic square

        } else if (height instanceof Matrix) { // Matrix(matrice)
            this.height = height.height;
            this.width = height.width;
            this.content = Array.from(height.content);
        } else {

            // Viene istanziata esplicitamente almeno la prima dimensione
            this.height = (typeof height == 'number' && height) || 0;

            // se la matrice è quadrata passo solo l'ordine 
            // della matrice nel parametro width
            this.width = (data && typeof data[0] == 'number' && data[0]) || height;

            // Matrix(n,'zeroes') oppure Matrix(n,m,'zeroes') 
            // oppure Matrix(n) oppure Matrix(n,m)
            if ((typeof data[0] == 'string' && data[0].toLowerCase() == 'zeroes') ||
                (typeof data[1] == 'string' && data[1].toLowerCase() == 'zeroes') ||
                data.length == 0 || (data.length == 1 && typeof data[0] == 'number')) {
                for (let x = 0, s = 0; x < height; x++)
                    for (let y = 0; y < width; y++, s++)
                        this.content[s] = 0;
            }

            // Matrix(n,'ones') oppure Matrix(n,m,'ones')
            else if ((typeof data[0] == 'string' && data[0].toLowerCase() == 'ones') ||
                (typeof data[1] == 'string' && data[1].toLowerCase() == 'ones')) {
                for (let x = 0, s = 0; x < height; x++)
                    for (let y = 0; y < width; y++, s++)
                        this.content[s] = 1;
            }

            // Matrix(n,'identity')
            else if (typeof data[0] == 'string' && data[0].toLowerCase() == 'identity') {
                for (let x = 0, s = 0; x < this.height; x++)
                    for (let y = 0; y < this.width; y++, s++)
                        this.content[s] = (y == x ? 1 : 0);
            }

            // Matrix (n, data)
            // fa il padding con 0 l'array di valori non è sufficiente
            else if (data[0] instanceof Array) {
                for (let x = 0, s = 0; x < this.height; x++)
                    for (let y = 0; y < this.width; y++, s++)
                        this.content[s] = data[0][s] ? data[0][s] : 0;
            }

            // Matrix (n, m, data)
            // fa il padding con 0 l'array di valori non è sufficiente
            else if (data[1] instanceof Array) {
                for (let x = 0, s = 0; x < this.height; x++)
                    for (let y = 0; y < this.width; y++, s++)
                        this.content[s] = data[1][s] ? data[1][s] : 0;
            }
        }

        // definisco la dimensione della matrice height x width
        this.size = this.height * this.width;
    }

    // metodi di utilità
    isSquare() {
        return this.width == this.height;
    }

    rank() {
        return this.isSquare() ? this.height : -1;
    }

    dim() {
        return [this.height, this.width];
    }

    minor(i, j) {
        if (this.isSquare()) {
            let height = this.height - 1;
            let width = this.width - 1;
            let content = new Array(height * width);

            for (let row = 0, s = 0; row < this.height; row++) {
                if (row == i) continue;
                for (let col = 0; col < this.width; col++) {
                    if (col == j) continue;
                    content[s++] = this.content[row * this.width + col];
                }
            }

            return new Matrix(height, width, content);

        } else {
            console.log('Not a square matrix!');
            return null;
        }
    }

    get(x, y) {
        return x * this.width + y < this.size ? this.content[x * this.width + y] : NaN;
    }

    set(x, y, value) {
        if (x * this.width + y < this.size)
            this.content[x * this.width + y] = value;
        else console.log(`location (${x},${y}) is out of range`);
    }

    toString() {
        let out = `[`;

        for (let x = 0; x < this.height; x++) {
            for (let y = 0; y < this.width; y++)
                out += `${this.content[x * this.width + y]}, `;
            out += (x == this.height - 1 ? `` : `\n`);
        }
        out += `]`;

        console.log(out);
    }

    // c = a.sum(m) --> c = a+m
    sum(m) {
        if (this.width == m.width && this.height == m.height) {
            let content = new Array(this.size);

            for (let x = 0; x < this.size; x++)
                content[x] = this.content[x] + m.content[x];

            return new Matrix(this.height, this.width, content);
        } else {
            console.log('dimensions do not agree')
            return null;
        }
    }

    // c = a.sub(m) --> c = a-m
    sub(m) {
        if (this.width == m.width && this.height == m.height) {
            let content = new Array(this.size);

            for (let x = 0; x < this.size; x++)
                content[x] = this.content[x] - m.content[x];

            return new Matrix(this.height, this.width, content);
        } else {
            console.log('dimensions do not agree')
            return null;
        }
    }

    // b = a.transpose() --> b = aT
    transpose() {
        let content = new Array(this.size);

        for (let col = 0, s = 0; col < this.width; col++)
            for (let row = 0; row < this.height; row++, s++)
                content[s] = this.content[row * this.width + col];


        return new Matrix(this.width, this.height, content);
    }

    // c = a.mult(m) --> c = a*m
    // come prodotto di matrici
    // che implica il prodotto scalare tra vettori riga: (1,n) x (n,1)
    mult(m) {
        if (this.width == m.height) {

            let height = this.height;
            let width = m.width;
            let content = new Array(height * width);
            let temp = m.transpose();

            for (let x = 0, s = 0; x < height; x++)
                for (let y = 0; y < width; y++, s++) {
                    content[s] = 0;
                    for (let h = x * this.width, k = y * temp.width; h < (x + 1) * this.width, k < (y + 1) * temp.width; h++, k++)
                        content[s] += this.content[h] * temp.content[k];
                }

            return new Matrix(height, width, content);
        } else {
            console.log('dimensions do not agree')
            return null;
        }

    }

    // c = a.reshape(h,k) --> a(m,n) ==> c(h,k)
    reshape(h, k) {
        if (h * k >= this.size) {
            let height = h;
            let width = k;
            let size = h * k;
            let content = new Array(size);

            for (let s = 0; s < size; s++)
                content[s] = this.content[s] ? this.content[s] : 0;

            return new Matrix(height, width, content);

        } else {
            console.log('Requested shape is lower than rank!')
            return null;
        }
    }

    det() {
        if (this.isSquare()) {
            if (this.rank() == 2)
                return this.content[0] * this.content[3] -
                    this.content[1] * this.content[2];

            else if (this.rank() == 3)
                return this.content[0] * this.content[4] * this.content[8] +
                    this.content[1] * this.content[5] * this.content[6] +
                    this.content[2] * this.content[3] * this.content[7] -
                    this.content[2] * this.content[4] * this.content[6] -
                    this.content[1] * this.content[3] * this.content[8] -
                    this.content[0] * this.content[5] * this.content[7];

            else {
                let d = 0;
                for (let s = 0; s < this.width; s++)
                    d += (-1) ** (1 + s + 1) * this.minor(0, s).det() * this.content[s];

                return d;
            }

        } else {
            console.log('Not a square matrix!')
            return NaN;
        }
    }

    inv() {
        if (this.isSquare()) {
            let content = new Array(this.size);
            let invdet = 1 / this.det();

            if (this.rank() == 2)
                return new Matrix(2, [invdet * this.content[3], -invdet * this.content[2], -invdet * this.content[1], invdet * this.content[0]]);
            else {
                for (let row = 0, s = 0; row < this.height; row++)
                    for (let col = 0; col < this.width; col++, s++)
                        content[s] = (-1) ** (row + col + 2) * this.minor(row, col).det() * invdet;

                let res = new Matrix(this.height, content);
                return res.transpose();
            }

        } else {
            console.log('Not a square matrix!')
            return null;
        }
    }
}

// classe iteratore customizzato
class MatrixIterator {
    constructor(matrix) {
        this.count = 0; // uso il contatore interno per stabilire a che punto sono nella sequenza
        this.matrix = matrix;
    }

    // ridefinizione di next
    next() {
        if (this.count == this.matrix.size)
            return { value: undefined, done: true };
        else {
            let obj = {
                // il value è il vettore [row, col, value]
                value: [Math.floor(this.count / this.matrix.width),
                    this.count - this.matrix.width * Math.floor(this.count / this.matrix.width),
                    this.matrix.content[this.count]
                ],
                done: false
            };
            this.count++;
            return obj;
        }

    }
}
Matrix.prototype[Symbol.iterator] = function() { return new MatrixIterator(this) }

class SymmetricMatrix extends Matrix {
    constructor(n, data) {
        let content = new Array(n * n);

        for (let row = 0, s = 0, i = 0; row < n; row++)
            for (let col = 0; col < n; col++, s++)
                content[s] = col >= row ? data[i++] : content[col * n + row];

        super(n, content);
    }

    set(x, y, value) {
        super.set(x, y, value);
        if (x != y) super.set(y, x, value);
    }
}

var a = new Matrix(2, 3, [2, 2, 2, 2, 2, 2]);
a.mult(a.transpose()).toString();
a.transpose().mult(a).toString();
a.reshape(1, 6).toString()
var b = new Matrix('magic');
b.toString();
b.minor(0, 0).toString();
console.log(b.det());
var c = new Matrix(4, [2, 7, 6, 5, 9, 5, 1, 2, 4, 3, 8, 7, 1, 2, 3, 4]);
c.toString();
console.log(c.det());
b.inv().toString();
for (let x of b)
    console.log(x);
var sim = new SymmetricMatrix(3, [1, 2, 3, 4, 5, 6]);
sim.toString();
console.log(sim.det());
sim.mult(b).toString();
for (let x of sim) console.log(x);