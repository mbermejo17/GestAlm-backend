

var express = require('express');
var app = require('../app');
var User = require('../controllers/user');
var mdAutenticacion = require('../middlewares/autenticacion');

var userApi = express.Router();

userApi.get('/', User.getAllUsers);
userApi.post('/', User.addUser);
userApi.put('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_o_MismoUsuario], User.updateUser);
userApi.get('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE], User.findUserById);
userApi.delete('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaADMIN_ROLE], User.deleteUser);


module.exports = userApi;