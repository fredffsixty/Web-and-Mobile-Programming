exports.config = {
    connectionLimit: 10,
    host: 'localhost',
    // Non usiamo *** mai *** root senza password
    user: 'mysqluser',
    password: 'mysqlpassword',
    database: 'user_registration',
    multipleStatements: true // consente query multiple in un'unica istruzione SQL
}