var mongoose = require('mongoose'),
    userRoles =       require('../../client/js/routingConfig').userRoles,
    User = mongoose.model('User'),
    Firebase = require('../models/Firebase.js'),
    AccessTokenTwilio = require('twilio').AccessToken,
    ConversationsGrant = AccessTokenTwilio.ConversationsGrant,
    Infosocial = mongoose.model('Infosocial');

    //config = require('../../config.json');

module.exports = {

  twilio : function(request, response) {

    var identity = request.body.nameUser;
    
    // Create an access token which we will sign and return to the client,
    // containing the grant we just created
    var token = new AccessTokenTwilio(
        config.twilio.TWILIO_ACCOUNT_SID,
        config.twilio.TWILIO_API_KEY,
        config.twilio.TWILIO_API_SECRET
    );

    //assign the generated identity to the token
    token.identity = identity;
        
    //grant the access token Twilio Video capabilities
    var grant = new ConversationsGrant();
    grant.configurationProfileSid = config.twilio.TWILIO_CONFIGURATION_SID;
    token.addGrant(grant);

    // Serialize the token to a JWT string and include it in a JSON response
    response.send({
        identity: identity,
        token: token.toJwt()
    });

  },

  twitter : function(token, tokenSecret, profile, done) {
    User.findOrCreate({
      username: profile.username,
      avatar: profile._json.profile_image_url_https,
      link: 'http://twitter.com/' + profile.username,
      red: 'twitter',
      redId: profile._json.id_str,
      token: token,
      tokenSecret: tokenSecret
    }, done);
    User.update(
      {
        redId: profile._json.id_str
      },
      {
        username: profile.username, 
        link: 'http://twitter.com/' + profile.username,
        avatar: profile._json.profile_image_url_https,
        token: token,
        tokenSecret: tokenSecret
      }, function(err){
        if(err) return done(err);      
    });
  },

  register : function(req, res, next) {

    //console.log("BUSCARRRRRFACEEEEE");
    var profile = req.body;

    User.findOrCreate({
        username: profile.username,
        name : profile.name,
        email : profile.email,
        password: profile.password,
        picture: profile.social != null ? profile.social.picture : 'http://placehold.it/50x50',
        social : profile.social,
        //link: profile.link,
        //redId: profile.id,
        //token: profile.accessToken,
        role : userRoles.user
        //tokenSecret: refreshToken
    }, function(err, user){
              
              if(err) return res.json(err);

              var myRootRef = Firebase.getRef('users/'+ profile.username);

              myRootRef.set(profile, function(err){
                  if(err) done(err)
              });


              req.logIn(user, function(err) {
                  if(err)     { next(err); }
                  else        { res.json(200, { "role": user.role, "username": user.username }); }
              });
          });
  },


  facebook : function(req, res, next) {

    //console.log("BUSCARRRRRFACEEEEE");
    var profile = req.body;
    var uid = profile.uid.split(':');

    /*User.findOne({username:profile.username}, function(err, user){

      if(err) return res.send(500, err);

      if(!user) return res.json(profile);*/

      Infosocial.findOne({providerId:uid[1], provider: uid[0]}, function(err, social){

        if(err) return res.send(500, err);

        if(!social) return res.json(profile);

        User.findOne({username:social.user}, function(err, user){

          if(err) return res.send(500, err);

          if(!user) return res.json(profile);

          req.logIn(user, function(err) {
                    if(err)     { next(err); }
                    else        { res.json(200, { login: 'true', "role": user.role, "username": user.username, email: user.email, name:user.name }); }
                });
        });

      });

    //});

    //return res.json(profile);

   /* User.findOrCreate({
        username: profile.username,
        name : profile.displayName,
        email : profile.email,
        picture: 'https://graph.facebook.com/'+profile.username+'/picture',
        link: profile.link,
        red: 'facebook',
        redId: profile.id,
        token: profile.accessToken,
        role : userRoles.user
        //tokenSecret: refreshToken
    }, function(err, user){
              if(err) return res.send(403, err);

              req.logIn(user, function(err) {
                  if(err)     { next(err); }
                  else        { res.json(200, { "role": user.role, "username": user.username, email: user.email, name:user.name }); }
              });
          });*/
  },

  login : function(req, res, next) {

    //console.log("BUSCARRRRRFACEEEEE");
    var profile = req.body;

    User.findOne({
        username: profile.username,
        password : profile.password
    }, function(err, user){
              if(err) return res.send(403, err);

              if(!user) return res.json({'message' : 'Datos incorrectos. por favor ingrese nuevamente su usuario y/o contraseña.'});

              req.logIn(user, function(err) {
                  if(err)     { next(err); }
                  else        { res.json(200, { "role": user.role, "username": user.username, "email" : user.email, "password" : user.password, name:user.name }); }
              });
          });
  },


  user : function(id, done) {
    User.findById(id, done);
  },

  logout : function(req, res) {
    req.logout();
    res.send(200);
  }

};