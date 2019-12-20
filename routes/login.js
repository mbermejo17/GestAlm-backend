
var express = require('express');
var app = require('../app');
var login = require('../controllers/login');
var mdAutenticacion = require('../middlewares/autenticacion');

var loginApi = express.Router();


loginApi.get('/tokenrenew', mdAutenticacion.verificaToken, login.tokenRenew);
loginApi.post('/', login.userLogin);

module.exports = loginApi;