import Matrix from './Matrix.js';

export default class SymmetricMatrix extends Matrix {
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