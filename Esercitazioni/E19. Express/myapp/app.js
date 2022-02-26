const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/pippo/', (req, res) => {
    res.send('hai richiesto la cartella pippo')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})