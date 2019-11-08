var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var statusSchema = new Schema({
    Name: { type: String, required: [true, 'El nombre es necesario'] }
}, { collection: 'Status' });

module.exports = mongoose.model('Status', statusSchema);