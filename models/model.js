var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modelSchema = new Schema({
    Model_id:{ type: String, required: false },
    PartNumber: { type: String, required: false },
    Barcode: { type: String, required: false },
    QRCode: { type: String, required: false },
    ScanPending: { type: Boolean, required: false },
    EditPending: { type: Boolean, required: false },
    Images: { type: String, required: false },
    Name: { type: String, required: [true, 'El nombre es necesario'] },
    Description: { type: String, required: false },
}, { collection: 'model' });

module.exports = mongoose.model('Model', modelSchema);