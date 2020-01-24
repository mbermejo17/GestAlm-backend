/*jshint esversion: 8 */
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var MobileDetect = require('mobile-detect');

var SEED = require('../config/config').SEED;

var app = express();
var User = require('../models/users');


// ==========================================
//  Renovar Token
// ==========================================
var tokenRenew = (req, res) =>{

    var token = jwt.sign({ usuario: req.usuario }, SEED, { expiresIn: 14400 }); // 4 horas

    res.status(200).json({
        result: 'ok',
        ok: true,
        token: token
    });

};

// =================================================
//  Autenticación de Google
// =================================================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    };
}


// ==========================================
//  Autenticación normal
// ==========================================
var userLogin = (req,res) =>{

    var body = req.body;
    var md = new MobileDetect(req.headers['user-agent']);
    var platform = md.os();
    console.log(platform);

    User.findOne({ email: body.email }, (err, userDB) => {

        if (err) {
            return res.status(500).json({
                result: 'fail',
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!userDB) {
            return res.status(400).json({
                result: 'fail',
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                result: 'fail',
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        // Crear un token!!!
        userDB.password = ':)';

        var token = jwt.sign({ usuario: userDB }, SEED, { expiresIn: 14400 }); // 4 horas

        res.status(200).json({
            result: 'ok',
            ok: true,
            usuario: userDB,
            token: token,
            id: userDB._id,
            menu: getUserMenu(userDB.role, platform)
        });

    })


};



var getUserMenu = (ROLE, platform)=> {

    if (platform == 'AndroidOS' || platform == 'iOS') {
        return [];
    }

    var menu = [{
            titulo: 'Principal',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Dashboard', url: '/dashboard' },
                { titulo: 'ProgressBar', url: '/progress' },
                { titulo: 'Gráficas', url: '/graficas1' }
            ]
        },
        {
            titulo: 'Almacenes',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
                { titulo: 'Altas', url: '/hospitales' },
                { titulo: 'Bajas', url: '/medicos' },
                { titulo: 'Entradas', url: '/medicos' },
                { titulo: 'Salidas', url: '/medicos' },
                { titulo: 'Historico', url: '/medicos' }
            ]
        }
    ];

    console.log('ROLE', ROLE);

    if (ROLE === 'ADMIN_ROLE') {
        menu[0].submenu.unshift({ titulo: 'Usuarios', url: '/usuarios' });
    }



    return menu;

};



module.exports = {
    userLogin,
    tokenRenew    
};