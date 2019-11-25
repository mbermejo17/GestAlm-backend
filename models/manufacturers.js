var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var statusSchema = new Schema({
    Factory_id: { type: String, required: False, },
    Factory_Name: { type: String, required: [true, 'El nombre es necesario'] }
}, { collection: 'manufacturers' });

module.exports = mongoose.model('Manufacturer', statusSchema);