// Lista degli errori definiti dall'utente
class OutOfRangeError extends Error {}
class MatrixShapeError extends Error {}
class InvalidDimensionError extends Error {}
class InvalidMatrixError extends Error {}

class Matrix {
    constructor(height, ...data) {

        // Matrix('magic')
        if (height == 'magic') {
            this.height = this.width = 3;
            this.size = 9;
            this.content = [2, 7, 6, 9, 5, 1, 4, 3, 8]; // magic square

        } else if (height instanceof Matrix) { // Matrix(matrice)
            this.height = height.height;
            this.width = height.width;
            this.size = height.size;
            this.content = Array.from(height.content);
        } else {
            try {
                // Viene istanziata esplicitamente almeno la prima dimensione
                this.height = (typeof height == 'number' && height) || 0;

                // se la matrice è quadrata passo solo l'ordine 
                // della matrice nel parametro width
                this.width = (data && typeof data[0] == 'number' && data[0]) || height;

                // definisco la dimensione della matrice height x width
                // e alloco il contenuto
                this.size = this.height * this.width;
                this.content = new Array(this.size);

                // Matrix(n,'zeroes') oppure Matrix(n,m,'zeroes') 
                // oppure Matrix(n) oppure Matrix(n,m)
                if ((typeof data[0] == 'string' && data[0].toLowerCase() == 'zeroes') ||
                    (typeof data[1] == 'string' && data[1].toLowerCase() == 'zeroes') ||
                    data.length == 0 || (data.length == 1 && typeof data[0] == 'number')) {
                    for (let x = 0, s = 0; x < this.height; x++)
                        for (let y = 0; y < this.width; y++, s++)
                            this.content[s] = 0;
                }

                // Matrix(n,'ones') oppure Matrix(n,m,'ones')
                else if ((typeof data[0] == 'string' && data[0].toLowerCase() == 'ones') ||
                    (typeof data[1] == 'string' && data[1].toLowerCase() == 'ones')) {
                    for (let x = 0, s = 0; x < this.height; x++)
                        for (let y = 0; y < this.width; y++, s++)
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
                } else throw new InvalidMatrixError('invalid constructor parameters');
            } catch (e) {
                if (e instanceof InvalidMatrixError) {
                    console.log(`Unable to create matrix: ${e.message}`);
                    this.height = this.width = this.size = this.content = null;
                }
            }
        }
    }


    // metodi di utilità
    isSquare() {
        return this.width == this.height;
    }

    rank() {
        let res = 0;
        try {
            if (this.isSquare())
                res = this.height;
            else throw new MatrixShapeError('not a square matrix!');
        } catch (e) {
            if (e instanceof MatrixShapeError) {
                res = -1;
                console.log(`unable to compute rank(): ${e.message}`);
            }
        } finally {
            return res;
        }
    }

    dim() {
        return [this.height, this.width];
    }

    minor(i, j) {
        let res = null;

        try {
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

                res = new Matrix(height, width, content);

            } else
                throw new MatrixShapeError('not a square matrix!');
        } catch (e) {
            if (e instanceof MatrixShapeError) {
                res = NaN;
                console.log(`unable to compute minor(${Object.values(arguments).toString()}): ${e.message}`);
            }
        } finally {
            return res;
        }


    }

    get(x, y) {
        let res = 0;
        try {
            let idx = x * this.width + y;
            if (idx < this.size)
                res = this.content[idx];
            else throw new OutOfRangeError('requested location is out of range')
        } catch (e) {
            if (e instanceof OutOfRangeError) {
                res = NaN;
                console.log(`Unable to perform get(${Object.values(arguments).toString()}): ${e.message}`);
            }
        } finally {
            return res;
        }
    }

    set(x, y, value) {
        try {
            let idx = x * this.width + y;
            if (idx < this.size)
                this.content[idx] = value;
            else throw new OutOfRangeError('requested location is out of range');
        } catch (e) {
            if (e instanceof OutOfRangeError)
                console.log(`Unable to perform set(${Object.values(arguments).toString()}): ${e.message}`);
        }
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
        return out;
    }

    // c = a.sum(m) --> c = a+m
    sum(m) {
        let res = null;
        try {

            if (this.width == m.width && this.height == m.height) {
                let content = new Array(this.size);

                for (let x = 0; x < this.size; x++)
                    content[x] = this.content[x] + m.content[x];

                res = new Matrix(this.height, this.width, content);
            } else
                throw new InvalidDimensionError('dimensions do not agree');
        } catch (e) {
            if (e instanceof InvalidDimensionError)
                console.log(`Unable to perform sum(.): ${e.message}`);
        } finally {
            return res;
        }
    }

    // c = a.sub(m) --> c = a-m
    sub(m) {
        let res = null;
        try {

            if (this.width == m.width && this.height == m.height) {
                let content = new Array(this.size);

                for (let x = 0; x < this.size; x++)
                    content[x] = this.content[x] - m.content[x];

                res = new Matrix(this.height, this.width, content);
            } else throw new InvalidDimensionError('dimensions do not agree');

        } catch (e) {
            if (e instanceof InvalidDimensionError)
                console.log(`Unable to perform sub(.): ${e.message}`);
        } finally {
            return res;
        }
    }

    // b = a.transpose() --> b = aT
    transpose() {
        let swap = 0;
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
        let res = null;
        try {

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

                res = new Matrix(height, width, content);
            } else throw new InvalidDimensionError('dimensions do not agree');
        } catch (e) {
            if (e instanceof InvalidDimensionError)
                console.log(`Unable to perform mult(.): ${e.message}`);
        } finally {
            return res;
        }

    }

    // c = a.reshape(h,k) --> a(m,n) ==> c(h,k)
    reshape(h, k) {
        let res = null;
        try {

            if (h * k >= this.size) {
                let height = h;
                let width = k;
                let size = h * k;
                let content = new Array(size);

                for (let s = 0; s < size; s++)
                    content[s] = this.content[s] ? this.content[s] : 0;

                res = new Matrix(height, width, content);

            } else throw new MatrixShapeError('target shape is too small');
        } catch (e) {
            if (e instanceof MatrixShapeError)
                console.log(`Unable to perform reshape(${Object.values(arguments).toString()}): ${e.message}`);
        } finally {
            return res;
        }
    }

    det() {
        let res = 0;
        try {
            if (this.isSquare()) {
                if (this.rank() == 2)
                    res = this.content[0] * this.content[3] -
                    this.content[1] * this.content[2];

                else if (this.rank() == 3)
                    res = this.content[0] * this.content[4] * this.content[8] +
                    this.content[1] * this.content[5] * this.content[6] +
                    this.content[2] * this.content[3] * this.content[7] -
                    this.content[2] * this.content[4] * this.content[6] -
                    this.content[1] * this.content[3] * this.content[8] -
                    this.content[0] * this.content[5] * this.content[7];

                else {
                    for (let s = 0; s < this.width; s++)
                        res += (-1) ** (1 + s + 1) * this.minor(0, s).det() * this.content[s];

                    return res;
                }

            } else throw new MatrixShapeError('not a square matrix.');
        } catch (e) {
            if (e instanceof MatrixShapeError) {
                res = NaN;
                console.log(`Unable to compute det(): ${e.message}`);
            }
        } finally {
            return res;
        }
    }

    inv() {
        let res = null;
        try {
            if (this.isSquare()) {
                let content = new Array(this.size);
                let invdet = 1 / this.det();

                if (this.rank() == 2)
                    res = new Matrix(2, [invdet * this.content[3], -invdet * this.content[2], -invdet * this.content[1], invdet * this.content[0]]);
                else {
                    for (let row = 0, s = 0; row < this.height; row++)
                        for (let col = 0; col < this.width; col++, s++)
                            content[s] = (-1) ** (row + col + 2) * this.minor(row, col).det() * invdet;

                    res = new Matrix(this.height, content).transpose();
                }

            } else throw new MatrixShapeError('not a square matrix.');
        } catch (e) {
            if (e instanceof MatrixShapeError)
                console.log(`Unable to compute inv(): ${e.message}`);
        } finally {
            return res;
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

onmessage = function(event) {
    let myMartix;

    if (event.data.magic)
        myMartix = new Matrix('magic');
    else
        myMartix = new Matrix(
            event.data.height,
            event.data.width,
            event.data.data
        );

    postMessage(myMartix.toString());
}