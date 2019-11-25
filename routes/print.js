var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

//const ThermalPrinter = require("../node-thermal-printer").printer;
//const PrinterTypes = require("../node-thermal-printer").types;

//var printerDevice = new Printer('EPSON_SX510');

// =============================================
// Obtener trabajos en la cola de la impresora
// =============================================
/* app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Article.find({}, 'Name Description PartNumber Barcode QRCode Location Status ScanPending EditPending Images')
        .skip(desde)
        .limit(5)
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
                        articles,
                        total: conteo
                    });

                });
            });
});
 */

// ==============================================
// Reiniciar trabajo en la cola de la impresora
// ==============================================
//app.put('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_o_MismoUsuario], (req, res) => {
/* app.put('/:id', (req, res) => {

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
 */


// ==========================================
// Enviar trabajo a la cola de la impresora
// ==========================================
app.post('/', (req, res) => {

    var body = req.body;

    var printerJob = {
        Name: body.name,
        Data: body.data
    };

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


module.exports = app;