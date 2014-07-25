var mongoose = require('mongoose'),
    //config = require('../config'),
    request = require('request');/*,
    qs = require('querystring');*/
/* Recoje datos del mensaje para un schema en mongoose
Contenido, fecha, publicacion. publicacion redes sociales, ip y usuario */
var messageSchema = new mongoose.Schema({
    id : {type:Number, required: true}, 
    from : {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    to: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    content: { type: String, required: true },
    datetime: { type: Date, 'default': Date.now },
    publish: { type: Boolean, 'default': false },
    activado: { type: Boolean, 'default': true },
    ip: String,
    inbox: {type: mongoose.Schema.Types.ObjectId, ref: 'Inbox', required: true}
}, {collection : 'messages'});


var Message = mongoose.model('Message', messageSchema);