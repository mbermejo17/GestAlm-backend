var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var statusSchema = new Schema({
    Status_id: { type: String, required: False, },
    Name: { type: String, required: [true, 'El nombre es necesario'] },
    Description: { type: String, required: False, }
}, { collection: 'Status' });

module.exports = mongoose.model('Status', statusSchema);