require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 3000;
const api = require("./api/index");

app.use('/', api);

// app.post('/upload', upload.single('photo'), (req, res) => {
//     if(req.file) {
//         res.json(req.file);
//     }
//     else throw 'error';
// });

app.listen(PORT, () => {
    console.log('Listening at ' + PORT );
});