var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Article = require('../models/articles');
var User = require('../models/users');

// ==============================
// Busqueda por colección
// ==============================
app.get('/collection/:table/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var table = req.params.table;
    var regex = new RegExp(busqueda, 'i');
    var dataName = table;

    var promesa;

    switch (table) {

        case 'users':
            dataName = "usuarios";
            promesa = searchUsers(busqueda, regex);
            break;

        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;

        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;

        case 'articles':
            promesa = searchArticles(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda sólo son: usuarios y articulos',
                error: { message: 'Tipo de tabla/coleccion no válida' }
            });

    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [dataName]: data
        });

    })

});


// ==============================
// Busqueda general
// ==============================
app.get('/all/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');


    Promise.all([
        //buscarHospitales(busqueda, regex),
        //buscarMedicos(busqueda, regex),
        searchUsers(busqueda, regex),
        searchArticles(busqueda, regex)
    ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                //hospitales: respuestas[0],
                //medicos: respuestas[1],
                usuarios: respuestas[0],
                articles: respuestas[1]
            });
        })


});


/* function buscarHospitales(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .exec((err, hospitales) => {

                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales)
                }
            });
    });
} */

/* function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .populate('hospital')
            .exec((err, medicos) => {

                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicos)
                }
            });
    });
}
 */
function searchUsers(busqueda, regex) {

    return new Promise((resolve, reject) => {

        User.find({}, 'nombre email role img')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Erro al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }


            })


    });
}

function searchArticles(busqueda, regex) {
    console.log(busqueda);

    return new Promise((resolve, reject) => {

        Article.find({}, 'Name Description PartNumber SerialNumber Status')
            .or([{ 'Name': regex },
            { 'Description': regex },
            { 'PartNumber': regex },
            { 'SerialNumber': regex },
            { 'Status': regex }])
            .exec((err, articles) => {

                if (err) {
                    reject('Error al cargar articulos', err);
                } else {
                    resolve(articles);
                }


            })


    });
}



module.exports = app;