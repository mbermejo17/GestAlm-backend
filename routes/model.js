var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Model = require('../models/model');

// ==========================================
// Obtener todos los modelos
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Model.find({}, 'Name Description PartNumber Barcode QRCode ScanPending EditPending Images')
        .skip(desde)
        .limit(5)
        .exec(
            (err, models) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando modelos',
                        errors: err
                    });
                }

                Model.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        models,
                        total: conteo
                    });

                });
            });
});


// ==========================================
// Actualizar Modelo
// ==========================================
//app.put('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_o_MismoUsuario], (req, res) => {
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;
    console.log(id);
    Model.findById(id, (err, model) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar modelo',
                errors: err
            });
        }

        if (!model) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El modelo con el id ' + id + ' no existe',
                errors: { message: 'No existe un modelo con ese ID' }
            });
        }


        if (body.name) model.Name = body.name;
        if (body.description) model.Description = body.description;
        if (body.barcode) model.Barcode = body.barcode;
        if (body.qrcode) model.QRCode = body.qrcode;
        if (body.scanpending) model.ScanPending = body.scanpending;
        if (body.editpending) model.EditPending = body.editpending;
        if (body.images) model.Images = body.images;

        model.save((err, modelUpdated) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el modelo',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                model: modelUpdated
            });

        });

    });

});



// ==========================================
// Crear un nuevo Modelo
// ==========================================
app.post('/', (req, res) => {

    var body = req.body;

    var model = new Model({
        Name: body.name,
        Description: body.description,
        Barcode: body.barcode || "",
        QRCode: body.qrcode || "",
        ScanPending: body.scanpending || "",
        EditPending: body.editpending || "",
        Images: body.images || ""
    });

    model.save((err, modelAdded) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear modelo',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            model: modelAdded,
            usuariotoken: req.usuario
        });

    });

});


// ============================================
//   Borrar un modelo por el id
// ============================================
//app.delete('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE], (req, res) => {
app.delete('/:id', (req, res) => {
    var id = req.params.id;

    Model.findByIdAndRemove(id, (err, modelDeleted) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar modelo',
                errors: err
            });
        }

        if (!modelDeleted) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un articulo con ese id',
                errors: { message: 'No existe un articulo con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            model: modelDeleted
        });

    });

});


module.exports = app;