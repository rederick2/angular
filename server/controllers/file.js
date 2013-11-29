var _ =           require('underscore')
    , User =      require('../models/User.js')
    , userRoles = require('../../client/js/routingConfig').userRoles;

var cloudinary = require('cloudinary');

cloudinary.config({ 
  cloud_name: 'dfupn8503', 
  api_key: '146899337669494', 
  api_secret: 'mjxMBhNgaHqOWqLZU8OMln7VdgU' 
});

module.exports = {
    index: function(req, res) {

        console.log(req.files.file.path);
        
        cloudinary.uploader.upload(req.files.file.path, function(result) { 
          var img = cloudinary.image(result.public_id , { format: result.format, width: 90, height: 98, crop: 'fill'});

          var img_big = cloudinary.url(result.public_id , { format: result.format, width: 800, crop: 'scale'});

          res.json({image_th:img, image_big:img_big});
        });

        
    },

};