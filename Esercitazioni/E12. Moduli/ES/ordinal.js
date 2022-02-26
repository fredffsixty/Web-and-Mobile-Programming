// Uso export per esportare

export default function ordinal(num) {
    switch (num) {
        case 1:
        case 31:
            return num + 'st';
        case 2:
        case 22:
            return num + 'nd';
        case 3:
        case 23:
            return num + 'rd';
        default:
            return num + 'th';
    }
}