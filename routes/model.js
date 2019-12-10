var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Model = require('../models/model');
var Article = require('../models/articles');
var tArtByModel = [];



// ==========================================
// Obtener todos los modelos
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Model.find({}, 'Name Description PartNumber Barcode QRCode ScanPending EditPending Images')
        .skip(desde)
        .limit(5)
        .sort(['PartNumber', 1])
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

const getTotalArticulosByModel = (m) => {
    return new Promise((resolve, reject) => {
        Article.find({ "PartNumber": m.Name })
            .count(
                (err, nArticles) => {
                    if (err) {
                        reject('Error cargando articulos')
                    };
                    console.log('Name: ' + m.Name + ', total: ' + nArticles);
                    resolve(nArticles);
                });
    });
}


// ============================================
//   Buscar articulos por modelo 
// ============================================
app.get('/articles/:id', (req, res) => {
    var id = req.params.id;
    console.log(id);
    Article.find({ "PartNumber": id })
        .exec((err, articles) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar articulos por modelo',
                    errors: err
                });
            }
            if (!articles) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No existe un articulos del modelo' + id,
                    errors: { message: 'No existen articulo del modelo ' + id }
                });
            }
            Article.count({ "PartNumber": id }, (err, conteo) => {
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
// Obtener total de Articulos por modelo
// ==========================================

app.get('/total', (req, res, next) => {

    var from = req.query.desde || 0;
    var limit = req.query.limite || 100;
    var listados = 0;
    var totalModel = [];
    from = Number(from);
    limit = Number(limit);

    Model.find({}, 'Name Description PartNumber Barcode QRCode ScanPending EditPending Images')
        .skip(from)
        .limit(limit)
        .sort([['Name',1]])
        .exec(
            (err, models) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando modelos',
                        errors: err
                    });
                }
                let totalModel = [];
                let parseModels = async () => {
                    return Promise.all(models.map(async (m) => {
                        let newObj = {
                            Name: m.Name,
                            ParNumber: m.PartNumber,
                            _id: m._id,
                            Total: 0
                        };
                        await getTotalArticulosByModel(m)
                            .then((n) => {
                                newObj.Total = n;
                                //console.log(newObj.Total);
                                totalModel.push(newObj);
                            }
                            )
                            .catch((e) => console.log(e));
                    })
                    );
                };

                parseModels()
                    .then(() => {
                        //console.log("======================",totalModel);
                        res.status(200).json({
                            ok: true,
                            listados: totalModel.length,
                            models: totalModel,
                        });
                    })

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