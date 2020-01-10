var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var moment = require('moment');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Article = require('../models/articles');
var Model = require('../models/model');


// ==========================================
// Obtener todos los articulos
// ==========================================
app.get('/', (req, res, next) => {

    var from = req.query.desde || 0;
    var limit = req.query.limite || 5;
    var listados = 0;
    from = Number(from);
    limit = Number(limit);

    Article.find({}, 'Name Description PartNumber Barcode QRCode Location Status ScanPending EditPending Images Manufacturer Comment LastUpdate LastMovement LastOrigin LastDestination')
        .skip(from)
        .limit(limit)
        .exec(
            (err, articles) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando articulos',
                        errors: err
                    });
                }
                Article.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        listados: articles.length,
                        total: conteo,
                        articles
                    });

                });
            });
});




// ==========================================
// Actualizar Articulo
// ==========================================
//app.put('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_o_MismoUsuario], (req, res) => {
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;
    console.log(id);
    Article.findById(id, (err, article) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar articulo',
                errors: err
            });
        }
        if (!article) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El articulo con el id ' + id + ' no existe',
                errors: { message: 'No existe un articulo con ese ID' }
            });
        }
        if (body.name) article.Name = body.name;
        if (body.description) article.Description = body.description;
        if (body.partnumber) article.ParNumber = body.partnumber;
        if (body.serialnumber) article.SerialNumber = body.serialnumber;
        if (body.barcode) article.Barcode = body.barcode;
        if (body.qrcode) article.QRCode = body.qrcode;
        if (body.location) article.Location = body.location;
        if (body.status) article.Status = body.status;
        if (body.scanpending) article.ScanPending = body.scanpending;
        if (body.editpending) article.EditPending = body.editpending;
        if (body.images) article.Images = body.images;
        if (body.manufacturer) article.Manufacturer = body.manufacturer;
        if (body.comment) article.Comment = body.comment;
        article.LastUpdate = moment().format("X");
        console.log(moment(Number(article.LastUpdate)).format("DD-MM-YYYY HH:mm:ss"));
        if (body.lastmovement) article.LastMovement = body.lastmovement;
        if (body.lastoriging) article.LastOriging = body.lastoriging;
        if (body.lastdestination) article.LastDestination = body.lastdestination;

        article.save((err, articleUpdated) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el articulo',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                article: articleUpdated
            });
        });

    });

});

app.get('/location/:id', (req, res, next) => {

    var id = req.params.id;
    var from = req.query.desde || 0;
    var limit = req.query.limite || 0;
    var listados = 0;
    from = Number(from);
    limit = Number(limit);
    console.log(id);

    Article.find({Location: id}, 'Name Description PartNumber Barcode QRCode Location Status ScanPending EditPending Images Manufacturer Comment LastUpdate LastMovement LastOrigin LastDestination')
        .skip(from)
        .limit(limit)
        .exec(
            (err, articles) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando articulos',
                        errors: err
                    });
                }
                Article.count({Location: id}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        listados: articles.length,
                        total: conteo,
                        articles
                    });

                });
            });
});

// ==========================================
// Crear un nuevo Articulo
// ==========================================
app.post('/', (req, res) => {

    var body = req.body;

    var article = new Article({
        Name: body.name,
        Description: body.description,
        PartNumber: body.partnumber || "",
        SerialNumber: body.serialnumber || "",
        Barcode: body.barcode || "",
        QRCode: body.qrcode || "",
        Location: body.location || "",
        Status: body.status,
        ScanPending: body.scanpending || false,
        EditPending: body.editpending || false,
        Images: body.images || "",
        Manufacturer: body.manufacturer || "",
        Comment: body.comment || "",
        LastUpdate: body.lastupdate || moment().format("X"),
        LastMovement: body.lastmovement || "",
        LastOrigin: body.lastorigin || "",
        LastDestination: body.lastdestination || ""
    });
    article.save((err, articleAdded) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear articulo',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            article: articleAdded,
            usuariotoken: req.usuario
        });
    });
});


// ============================================
//   Borrar un usuario por el id
// ============================================
//app.delete('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE], (req, res) => {
app.delete('/:id', (req, res) => {
    var id = req.params.id;

    Article.findByIdAndRemove(id, (err, articleDeleted) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar articulo',
                errors: err
            });
        }

        if (!articleDeleted) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un articulo con ese id',
                errors: { message: 'No existe un articulo con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            article: articleDeleted
        });

    });

});


// ============================================
//   Buscar un articulo por el id
// ============================================
// app.get('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE], (req, res) => {
app.get('/:id', (req, res) => {
    //app.delete('/:id', (req, res) => {    

    var id = req.params.id;

    Article.findById(id, (err, article) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error buscando articulo',
                errors: err
            });
        }

        if (!article) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un articulo con ese id',
                errors: { message: 'No existe un articulo con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            articulo: article
        });

    });

});

module.exports = app;