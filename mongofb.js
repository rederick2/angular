var Firebase, FirebaseTokenGenerator, LRU, crypto, express, merge, mongodb, wrap;

crypto = require('crypto');

express = require('express');

Firebase = require('firebase');

FirebaseTokenGenerator = require('firebase-token-generator');

LRU = require('lru-cache');

merge = require('deepmerge');

mongodb = require('mongodb');

wrap = require('asset-wrap');

exports.client = require('./mongofbClient.js');

exports.server = function(cfg) {
  var connect, db, fb;
  cfg = merge({
    root: '/api',
    cache: {
      enabled: true,
      max: 100,
      maxAge: 1000 * 60 * 5
    },
    firebase: {
      url: 'https://vn42xl9zsez.firebaseio-demo.com/',
      secret: null
    },
    mongodb: {
      db: 'test',
      host: 'localhost',
      pass: '',
      port: 27017,
      user: 'admin',
      options: {
        db: {
          native_parser: false
        },
        server: {
          auto_reconnect: true,
          poolSize: 1,
          socketOptions: {
            keepAlive: 120
          }
        }
      }
    }
  }, cfg);
  exports.db = null;
  exports.fb = null;
  db = null;
  fb = null;
  connect = function(next) {
    var m, url;
    if (db && fb) {
      return typeof next === "function" ? next() : void 0;
    }
    m = cfg.mongodb;
    url = "mongodb://" + m.user + ":" + m.pass + "@" + m.host + ":" + m.port + "/" + m.db;
    url = url.replace(':@', '@');
    return mongodb.MongoClient.connect(url, m.options, function(err, database) {
      var token, token_generator;
      if (err) {
        return typeof next === "function" ? next(err) : void 0;
      }
      db = database;
      db.ObjectID = mongodb.ObjectID;
      exports.db = db;
      fb = new Firebase(cfg.firebase.url);
      if (cfg.firebase.secret) {
        token_generator = new FirebaseTokenGenerator(cfg.firebase.secret);
        token = token_generator.createToken({}, {
          expires: Date.now() + 1000 * 60 * 60 * 24 * 30,
          admin: true
        });
        return fb.auth(token, function(err) {
          fb.admin_token = token;
          if (typeof next === "function") {
            next(err);
          }
          return exports.fb = fb;
        });
      } else {
        return typeof next === "function" ? next() : void 0;
      }
    });
  };
  connect();
  return function(req, res, next) {
    return connect(function(err) {
      var auth, cache, contentType, hook, router, url, _cache;
      if (err) {
        return next(err);
      }
      req.db = db;
      req.fb = fb;
      req.mongofb = new exports.client.Database({
        server: "http://" + (req.get('host')) + cfg.root,
        firebase: cfg.firebase.url
      });
      auth = function(req, res, next) {
        var TOKEN_SEP, claims, encoded_claims, encoded_header, hash_bytes, header, hmac, original_sig, secure_bits, sig, token, _ref;
        if (req.query.token) {
          token = req.query.token;
          delete req.query.token;
          TOKEN_SEP = '.';
          _ref = token.split(TOKEN_SEP), encoded_header = _ref[0], encoded_claims = _ref[1], original_sig = _ref[2];
          claims = JSON.parse(new Buffer(encoded_claims, 'base64').toString());
          header = JSON.parse(new Buffer(encoded_header, 'base64').toString());
          secure_bits = encoded_header + TOKEN_SEP + encoded_claims;
          hmac = crypto.createHmac('sha256', cfg.firebase.secret);
          hmac.update(secure_bits);
          hash_bytes = hmac.digest('binary');
          sig = FirebaseTokenGenerator.prototype.noPadWebsafeBase64Encode_(hash_bytes, 'binary');
          if (sig === original_sig) {
            req.user = claims.d;
            req.admin = claims.admin;
          }
        }
        return next();
      };
      _cache = new LRU(cfg.cache);
      cache = function(fn) {
        var key, max_age, val;
        max_age = cfg.cache.maxAge / 1000;
        if (req.query.bust === '1') {
          max_age = 0;
        }
        val = 'private, max-age=0, no-cache, no-store, must-revalidate';
        if (cfg.cache.enabled && max_age > 0) {
          val = "public, max-age=" + max_age + ", must-revalidate";
        }
        res.set('Cache-Control', val);
        key = req.url.replace('&bust=1', '');
        if (req.query.bust === '1') {
          _cache.del(key);
          delete req.query.bust;
        }
        if (cfg.cache.enabled && _cache.has(key)) {
          return res.send(_cache.get(key));
        }
        delete req.query._;
        return fn(function(data) {
          _cache.set(key, data);
          return res.send(data);
        });
      };
      contentType = function(type) {
        return res.set('Content-Type', type);
      };
      hook = function(time, method, arg) {
        var fn, _ref, _ref1, _ref2;
        fn = (_ref = cfg.hooks) != null ? (_ref1 = _ref[req.params.collection]) != null ? (_ref2 = _ref1[time]) != null ? _ref2[method] : void 0 : void 0 : void 0;
        if (fn) {
          return fn.apply(req, [arg]);
        } else {
          return arg;
        }
      };
      router = new express.Router();
      router.route('GET', "" + cfg.root + "/*", function(req, res, next) {
        var k, map, v, _ref;
        map = {
          'false': false,
          'true': true,
          'null': null
        };
        _ref = req.query;
        for (k in _ref) {
          v = _ref[k];
          if (v in map) {
            req.query[k] = map[v];
          }
        }
        return next();
      });
      router.route('GET', "" + cfg.root + "/mongofb.js", function(req, res, next) {
        contentType('text/javascript');
        return cache(function(next) {
          var asset;
          return asset = new wrap.Snockets({
            src: "" + __dirname + "/client.coffee"
          }, function(err) {
            if (err) {
              return res.send(500, err);
            }
            return next(asset.data);
          });
        });
      });
      router.route('GET', "" + cfg.root + "/Firebase", function(req, res, next) {
        return res.send(cfg.firebase.url);
      });
      router.route('GET', "" + cfg.root + "/ObjectID", function(req, res, next) {
        return res.send(mongodb.ObjectID().toString());
      });
      url = "" + cfg.root + "/sync/:collection/:id*";
      router.route('GET', url, auth, function(req, res, next) {
        var ref, target;
        if (req.params[1]) {
          target = unescape(req.params[1]);
        }
        ref = fb.child("" + req.params.collection + "/" + req.params.id);
        return ref.once('value', function(snapshot) {
          var collection, doc, opt, qry;
          collection = db.collection(req.params.collection);
          try {
            qry = {
              _id: new mongodb.ObjectID(req.params.id)
            };
          } catch (err) {
            return next(err);
          }
          doc = snapshot.val();
          if (doc) {
            doc._id = qry._id;
            opt = {
              safe: true,
              upsert: true
            };
            return collection.update(qry, doc, opt, function(err) {
              if (err) {
                return res.send(500, err);
              }
              doc = hook('after', 'find', doc);
              return res.send(doc);
            });
          } else {
            return collection.remove(qry, function(err) {
              if (err) {
                return res.end(500, err);
              }
              return res.send(null);
            });
          }
        });
      });
      url = "" + cfg.root + "/:collection/find";
      router.route('GET', url, auth, function(req, res, next) {
        return cache(function(next) {
          var collection, opt, qry, _ref;
          qry = hook('before', 'find', req.query);
          if ((_ref = qry.limit) == null) {
            qry.limit = 1000;
          }
          qry.limit = Math.min(qry.limit, 1000);
          opt = {
            limit: qry.limit
          };
          delete qry.limit;
          collection = db.collection(req.params.collection);
          return collection.find(qry, opt).toArray(function(err, docs) {
            var doc;
            if (err) {
              return res.send(500, err);
            }
            docs = (function() {
              var _i, _len, _results;
              _results = [];
              for (_i = 0, _len = docs.length; _i < _len; _i++) {
                doc = docs[_i];
                _results.push(hook('after', 'find', doc));
              }
              return _results;
            })();
            return next(docs);
          });
        });
      });
      url = "" + cfg.root + "/:collection/findOne";
      router.route('GET', url, auth, function(req, res, next) {
        return cache(function(next) {
          var collection, qry;
          if (req.params._id) {
            req.params._id = new mongodb.ObjectID(req.params._id);
          }
          qry = hook('before', 'find', req.query);
          collection = db.collection(req.params.collection);
          return collection.findOne(qry, function(err, doc) {
            if (err) {
              return res.send(500, err);
            }
            if (!doc) {
              return res.send(404);
            }
            doc = hook('after', 'find', doc);
            return next(doc);
          });
        });
      });
      url = "" + cfg.root + "/:collection/:id*";
      router.route('GET', url, auth, function(req, res, next) {
        return cache(function(next) {
          var collection, prj, qry, target;
          if (req.params[1]) {
            target = unescape(req.params[1]).replace(/\//g, '.');
          }
          try {
            qry = {
              _id: new mongodb.ObjectID(req.params.id)
            };
          } catch (err) {
            return next(err);
          }
          prj = {};
          if (target) {
            prj[target] = 1;
          }
          collection = db.collection(req.params.collection);
          return collection.findOne(qry, prj, function(err, doc) {
            var key, _i, _len, _ref;
            if (err) {
              return res.send(500, err);
            }
            if (!doc) {
              return res.send(404);
            }
            doc = hook('after', 'find', doc);
            if (target) {
              _ref = target.split('.');
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                key = _ref[_i];
                doc = doc != null ? doc[key] : void 0;
              }
            }
            return next(doc);
          });
        });
      });
      return router._dispatch(req, res, next);
    });
  };
};
