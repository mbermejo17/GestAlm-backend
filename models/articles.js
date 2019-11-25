var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
    Name: { type: String, required: [true, 'El nombre es necesario'] },
    Description: { type: String, required: false },
    PartNumber: { type: String, required: false },
    SerialNumber: { type: String, required: false },
    Barcode: { type: String, required: false },
    QRCode: { type: String, required: false },
    Location: { type: String, required: false },
    Status: { type: String, required: false },
    ScanPending: { type: Boolean, required: false },
    EditPending: { type: Boolean, required: false },
    Images: { type: String, required: false },
    Manufacturer: { type: String, required: false },
    Comment: { type: String, required: false },
    LastUpdated: { type: Date, required: false }
}, { collection: 'articles' });

module.exports = mongoose.model('Article', articleSchema);