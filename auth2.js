var mongoose = require('mongoose'),
    User = mongoose.model('User');

exports.twitter = function(token, tokenSecret, profile, done) {
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
};


exports.facebook = function(accessToken, refreshToken, profile, done) {

  console.log("BUSCARRRRRFACEEEEE");

  User.findOrCreate({
      username: profile.username,
      email : profile.email,
      picture: 'https://graph.facebook.com/'+profile.username+'/picture',
      link: profile.profileUrl,
      red: 'facebook',
      redId: profile.id,
      token: accessToken,
      tokenSecret: refreshToken
  }, done);
  
  User.update(
  {
    redId: profile.id
  },
  {
    username: profile.username, 
    link: profile.profileUrl,
    picture: 'https://graph.facebook.com/'+profile.username+'/picture',
  }, function(err){
    if(err) return done(err);      
  });
};

exports.user = function(id, done) {
  User.findById(id, done);
};