'use stric'

var mongoose = require('mongoose');
var app = require('./app');
var settings = require('./config/config');

// Conexión a la base de datos
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/GestAlm', { useMongoClient: true })
    .then(() => {
        console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');

        // Arrancar el servidor
        app.listen(settings.PORT, () => {
            console.log('Express server puerto '+ settings.PORT +': \x1b[32m%s\x1b[0m', 'online');
        });
        

    })
    .catch(err => console.log(err));
