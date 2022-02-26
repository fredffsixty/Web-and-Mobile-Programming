import SymmetricMatrix from './SymmetricMatrix.js';
import Matrix from './Matrix.js';

let sm = new SymmetricMatrix(4, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
let mag = new Matrix('magic');

mag.mult(sm);