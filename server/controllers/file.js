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

        var width = 800;
        var img_big = '';
        var img = '';
        
        cloudinary.uploader.upload(req.files.file.path, function(result) { 

          if(req.body.width){

              width = req.body.width;

              img_big = cloudinary.url(result.public_id , { format: result.format, height: width, crop: 'scale'});

              img  = cloudinary.url(result.public_id , { format: result.format,                                                            
                                                          transformation:[{
                                                              height: width, crop: 'scale'
                                                          },{
                                                              width: 0, height: 0, x: 0, y: 0, crop: 'crop'
                                                          },
                                                          {
                                                            width:160, crop:'scale'
                                                          }]
                                                        });
          
          }else{

              img_big = cloudinary.url(result.public_id , { format: result.format, width: 800, crop: 'scale'});

              img = cloudinary.image(result.public_id , { format: result.format, width: 100, height: 100, crop: 'fill'});

          }

          res.json({public_id:result.public_id , image_th:img, image_big:img_big});

        });

        
    },

    destroy: function(req, res){
      cloudinary.uploader.destroy(req.body.public_id, function(result) { 
          res.json(result);
        }, 
        { 
          invalidate: true 
        }
      );
    }

};