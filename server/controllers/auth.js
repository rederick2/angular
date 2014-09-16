var mongoose = require('mongoose'),
    userRoles =       require('../../client/js/routingConfig').userRoles,
    User = mongoose.model('User'),
    Firebase = require('../models/Firebase.js'),
    Infosocial = mongoose.model('Infosocial');

module.exports = {

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
              
              if(err) return res.send(403, err);

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

    /*User.findOne({username:profile.username}, function(err, user){

      if(err) return res.send(500, err);

      if(!user) return res.json(profile);*/

      Infosocial.findOne({providerId:profile.id, provider:'facebook'}, function(err, social){

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