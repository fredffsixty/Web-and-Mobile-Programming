var v = [1, 2, 3, 4];

var mat = [
    [1, 2, 3],
    [4, 5, 6]
];

var vector = new Array(7);

var vec = new Array(true, 'mamma', 73, [1, 2, 3]);

// Questo è in realtà un oggetto
let weather = {
    Sun: 'cloudy',
    Mon: 'mostly cloudy',
    Tue: 'almost sunny',
    Wed: 'sunny',
    Thu: 'almost sunny',
    Fri: 'windy',
    Sat: 'rain'
};

// Uso di map e reduce
// Calcolo la somma elle radici quadrate pari del mio vettore
var numbers = [4, 9, 16, 25];

var x = numbers.map(Math.sqrt).reduce((sum, n) => n % 2 == 0 ? sum + n : sum);