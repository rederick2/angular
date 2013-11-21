var Firebase, exports, extend, fetch, request,
  __slice = [].slice,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

if (typeof window !== 'undefined') {
  exports = window.mongofb = {};
  extend = function(target, object) {
    return $.extend(true, target, object);
  };
  Firebase = window.Firebase;
  fetch = function(args) {
    var async, error, result, success;
    result = null;
    if (args.next) {
      success = function(data) {
        return args.next(null, data);
      };
      error = function(jqXHR, textStatus, err) {
        return args.next(jqXHR, null);
      };
      async = true;
    } else {
      success = function(data) {
        return result = data;
      };
      error = function() {
        return result = null;
      };
      async = false;
    }
    $.ajax({
      url: args.url,
      cache: args.cache,
      type: 'GET',
      data: args.params,
      success: success,
      error: error,
      async: async
    });
    return result;
  };
} else {
  exports = module.exports = {};
  extend = require('node.extend');
  request = require('request');
  Firebase = require('firebase');
  fetch = function(args) {
    var _this = this;
    return request({
      url: args.url,
      qs: args.params,
      method: 'GET'
    }, function(err, resp, body) {
      if (resp.statusCode === 200) {
        if (args.json) {
          body = JSON.parse(body);
        }
        return args.next(err, body);
      } else {
        return args.next(err, null);
      }
    });
  };
}

exports.utils = {
  isEquals: function(a, b) {
    var k;
    if (a && !b) {
      return false;
    }
    if (b && !a) {
      return false;
    }
    for (k in a) {
      if (typeof b[k] === 'undefined') {
        return false;
      }
    }
    for (k in b) {
      if (typeof a[k] === 'undefined') {
        return false;
      }
    }
    for (k in a) {
      switch (typeof a[k]) {
        case 'object':
          if (!exports.utils.isEquals(a[k], b[k])) {
            return false;
          }
          break;
        case 'function':
          if (a[k].toString() !== b[k].toString()) {
            return false;
          }
          break;
        default:
          if (a[k] !== b[k]) {
            return false;
          }
      }
    }
    return true;
  },
  startsWith: function(str, target) {
    return str.slice(0, target.length) === target;
  }
};

exports.EventEmitter = (function() {

  function EventEmitter() {
    this.events = {};
  }

  EventEmitter.prototype.emit = function() {
    var args, callback, event, _i, _len, _ref, _results;
    event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (this.events[event]) {
      _ref = this.events[event];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        callback = _ref[_i];
        _results.push(callback.apply(null, args));
      }
      return _results;
    }
  };

  EventEmitter.prototype.on = function(event, callback) {
    var _base, _ref;
    if ((_ref = (_base = this.events)[event]) == null) {
      _base[event] = [];
    }
    return this.events[event].push(callback);
  };

  EventEmitter.prototype.off = function(event, callback) {
    var _base, _ref;
    if (callback == null) {
      callback = null;
    }
    if ((_ref = (_base = this.events)[event]) == null) {
      _base[event] = [];
    }
    return this.events[event] = this.events[event].filter(function(fn) {
      return callback !== null && fn !== callback;
    });
  };

  return EventEmitter;

})();

exports.Database = (function() {

  function Database(cfg) {
    if (typeof cfg === 'string') {
      this.api = cfg;
      this.request('Firebase', false, function(url) {
        return this.firebase = new Firebase(url);
      });
    } else {
      this.api = cfg.server;
      this.firebase = new Firebase(cfg.firebase);
    }
    this.cache = true;
  }

  Database.prototype.collection = function(name) {
    return new exports.Collection(this, name);
  };

  Database.prototype.get = function(path) {
    var collection;
    path = path.split(/[\/\.]/g);
    collection = this.collection(path[0]);
    if (path.length === 1) {
      return collection;
    }
    return collection.get(path.slice(1).join('/'));
  };

  Database.prototype.request = function() {
    var arg, json, next, params, resource, url, _i, _len;
    json = true;
    resource = '';
    next = null;
    params = {};
    for (_i = 0, _len = arguments.length; _i < _len; _i++) {
      arg = arguments[_i];
      switch (typeof arg) {
        case 'boolean':
          json = arg;
          break;
        case 'string':
          resource = arg;
          break;
        case 'function':
          next = arg;
          break;
        case 'object':
          params = arg;
      }
    }
    url = "" + this.api + "/" + resource;
    if (this.token) {
      params.token = this.token;
    }
    return fetch({
      cache: this.cache,
      json: json,
      next: next,
      params: params,
      resource: resource,
      url: url
    });
  };

  Database.prototype.setToken = function(token) {
    return this.token = token;
  };

  return Database;

})();

exports.Collection = (function() {

  function Collection(database, name) {
    this.database = database;
    this.name = name;
    this.ref = new exports.CollectionRef(this);
  }

  Collection.prototype.get = function(path) {
    var doc;
    path = path.split(/[\/\.]/g);
    doc = collection.findById(path[0]);
    if (path.length === 1) {
      return doc;
    }
    return doc.get(path.slice(1).join('/'));
  };

  Collection.prototype.insert = function(doc, priority, next) {
    var _this = this;
    if (typeof priority === 'function') {
      next = priority;
      priority = null;
    }
    return this.database.request('ObjectID', {
      _: "" + (Date.now()) + "-" + (Math.random())
    }, function(err, id) {
      var ref;
      if (err) {
        return typeof next === "function" ? next(err) : void 0;
      }
      doc._id = id;
      ref = _this.database.firebase.child("" + _this.name + "/" + id);
      return ref.set(doc, function(err) {
        if (err) {
          return typeof next === "function" ? next(err) : void 0;
        }
        if (priority) {
          ref.setPriority(priority);
        }
        return _this.database.request("sync/" + _this.name + "/" + id, {
          _: Date.now()
        }, function(err, doc) {
          if (err) {
            return typeof next === "function" ? next(err) : void 0;
          }
          return typeof next === "function" ? next(null, new exports.Document(_this, doc)) : void 0;
        });
      });
    });
  };

  Collection.prototype.find = function(query, next) {
    var doc, docs,
      _this = this;
    if (next) {
      return this.database.request("" + this.name + "/find", query, function(err, docs) {
        var doc;
        if (err) {
          return next(err);
        }
        docs = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = docs.length; _i < _len; _i++) {
            doc = docs[_i];
            _results.push(new exports.Document(this, doc));
          }
          return _results;
        }).call(_this);
        return next(null, docs);
      });
    } else {
      docs = this.database.request("" + this.name + "/find", query);
      if (docs == null) {
        docs = [];
      }
      return (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = docs.length; _i < _len; _i++) {
          doc = docs[_i];
          _results.push(new exports.Document(this, doc));
        }
        return _results;
      }).call(this);
    }
  };

  Collection.prototype.findById = function(id, next) {
    var doc,
      _this = this;
    if (next) {
      return this.database.request("" + this.name + "/" + id, function(err, doc) {
        if (err) {
          return next(err);
        }
        if (!doc) {
          return next(null, null);
        }
        return next(null, new exports.Document(_this, doc));
      });
    } else {
      doc = this.database.request("" + this.name + "/" + id);
      if (!doc) {
        return null;
      }
      return new exports.Document(this, doc);
    }
  };

  Collection.prototype.findOne = function(query, next) {
    var doc,
      _this = this;
    if (next) {
      return this.database.request("" + this.name + "/findOne", query, function(err, doc) {
        if (err) {
          return next(err);
        }
        if (!doc) {
          return next(null, null);
        }
        return next(null, new exports.Document(_this, doc));
      });
    } else {
      doc = this.database.request("" + this.name + "/findOne", query);
      if (!doc) {
        return null;
      }
      return new exports.Document(this, doc);
    }
  };

  Collection.prototype.list = function(priority, limit) {
    if (limit == null) {
      limit = 1;
    }
    this.ref.endAt(priority);
    this.ref.limit(limit);
    return this.ref;
  };

  Collection.prototype.remove = function(_id, next) {
    var ref,
      _this = this;
    ref = this.database.firebase.child("" + this.name + "/" + _id);
    return ref.set(null, function(err) {
      if (err) {
        return typeof next === "function" ? next(err) : void 0;
      }
      return _this.database.request("sync/" + _this.name + "/" + _id, function(err, doc) {
        if (err) {
          return typeof next === "function" ? next(err) : void 0;
        }
        return typeof next === "function" ? next(null) : void 0;
      });
    });
  };

  return Collection;

})();

exports.CollectionRef = (function(_super) {

  __extends(CollectionRef, _super);

  function CollectionRef(collection) {
    this.collection = collection;
    this.database = this.collection.database;
    this.ref = this.database.firebase.child(this.collection.name);
  }

  CollectionRef.prototype.endAt = function(priority) {
    return this.ref = this.ref.endAt(priority);
  };

  CollectionRef.prototype.limit = function(num) {
    return this.ref = this.ref.limit(num);
  };

  CollectionRef.prototype.startAt = function(priority) {
    return this.ref = this.ref.startAt(priority);
  };

  CollectionRef.prototype.on = function(event, callback) {
    var _ref, _ref1,
      _this = this;
    CollectionRef.__super__.on.call(this, event, callback);
    if (((_ref = this.events.insert) != null ? _ref.length : void 0) > 0) {
      this.ref.off('child_added');
      this.ref.on('child_added', function(snapshot) {
        return _this.emit('insert', snapshot.val());
      });
    }
    if (((_ref1 = this.events.remove) != null ? _ref1.length : void 0) > 0) {
      this.ref.off('child_removed');
      return this.ref.on('child_removed', function(snapshot) {
        return _this.emit('remove', snapshot.val());
      });
    }
  };

  CollectionRef.prototype.off = function(event, callback) {
    var _ref, _ref1;
    if (callback == null) {
      callback = null;
    }
    CollectionRef.__super__.off.call(this, event, callback);
    if (((_ref = this.events.insert) != null ? _ref.length : void 0) === 0) {
      this.ref.off('child_added');
    }
    if (((_ref1 = this.events.remove) != null ? _ref1.length : void 0) === 0) {
      return this.ref.off('child_removed');
    }
  };

  return CollectionRef;

})(exports.EventEmitter);

exports.Document = (function() {

  function Document(collection, data) {
    this.collection = collection;
    this.data = data;
    this.database = this.collection.database;
    this.key = "" + this.collection.name + "/" + this.data._id;
    this.ref = new exports.DocumentRef(this);
  }

  Document.prototype.emit = function() {
    var args, event, _ref;
    event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return (_ref = this.ref).emit.apply(_ref, [event].concat(__slice.call(args)));
  };

  Document.prototype.get = function(path) {
    return this.ref.get(path);
  };

  Document.prototype.name = function() {
    return this.ref.name();
  };

  Document.prototype.on = function(event, callback) {
    return this.ref.on(event, callback);
  };

  Document.prototype.off = function(event, callback) {
    return this.ref.off(event, callback);
  };

  Document.prototype.refresh = function(next) {
    return this.ref.refresh(next);
  };

  Document.prototype.remove = function(next) {
    return this.collection.remove(this.data._id, next);
  };

  Document.prototype.save = function(next) {
    return this.ref.set(this.data, next);
  };

  Document.prototype.set = function(value, next) {
    if (next == null) {
      next = null;
    }
    return this.ref.set(value, next);
  };

  Document.prototype.val = function() {
    return this.ref.val();
  };

  return Document;

})();

exports.DocumentRef = (function(_super) {

  __extends(DocumentRef, _super);

  function DocumentRef(document, path) {
    var k, _i, _len, _ref, _ref1;
    this.document = document;
    this.path = path != null ? path : '';
    DocumentRef.__super__.constructor.call(this);
    this.collection = this.document.collection;
    this.database = this.collection.database;
    if (typeof this.path === 'string') {
      if (this.path.slice(0, 1) === '/') {
        this.path = this.path.slice(1);
      }
      if (typeof this.path === 'string') {
        this.path = this.path.split(/[\/\.]/g);
      }
    }
    this.key = ("" + this.document.key + "/" + (this.path.join('/'))).replace(/\/$/, '');
    this.data = this.document.data;
    _ref = this.path;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      k = _ref[_i];
      if (k !== '') {
        this.data = (_ref1 = this.data) != null ? _ref1[k] : void 0;
      }
    }
    this.ref = this.database.firebase.child(this.key);
  }

  DocumentRef.prototype.get = function(path) {
    var temp;
    temp = this.path.slice(0);
    while (exports.utils.startsWith(path, '..')) {
      temp.pop();
      path = path.slice(2);
      if (exports.utils.startsWith(path, '/')) {
        path = path.slice(1);
      }
    }
    return new exports.DocumentRef(this.document, "" + (temp.join('/')) + "/" + path);
  };

  DocumentRef.prototype.name = function() {
    if (this.path.length === 0) {
      return this.data._id;
    } else {
      return this.path[this.path.length - 1];
    }
  };

  DocumentRef.prototype.on = function(event, callback) {
    var _ref, _ref1,
      _this = this;
    DocumentRef.__super__.on.call(this, event, callback);
    if (((_ref = this.events.update) != null ? _ref.length : void 0) > 0 || ((_ref1 = this.events.value) != null ? _ref1.length : void 0) > 0) {
      this.emit('value', this.data);
      this.ref.off('value');
      return this.ref.on('value', function(snapshot) {
        if (exports.utils.isEquals(_this.data, snapshot.val())) {
          return;
        }
        _this.updateData(snapshot.val());
        _this.emit('update', _this.data);
        return _this.emit('value', _this.data);
      });
    }
  };

  DocumentRef.prototype.off = function(event, callback) {
    var _ref, _ref1;
    if (callback == null) {
      callback = null;
    }
    DocumentRef.__super__.off.call(this, event, callback);
    if (!(((_ref = this.events.update) != null ? _ref.length : void 0) && ((_ref1 = this.events.value) != null ? _ref1.length : void 0))) {
      return this.ref.off('value');
    }
  };

  DocumentRef.prototype.parent = function() {
    return new exports.DocumentRef(this.document, this.path.slice(0, this.path.length - 1));
  };

  DocumentRef.prototype.refresh = function(next) {
    var _this = this;
    return this.ref.once('value', function(snapshot) {
      _this.updateData(snapshot.val());
      return typeof next === "function" ? next() : void 0;
    });
  };

  DocumentRef.prototype.set = function(value, next) {
    var ref,
      _this = this;
    ref = this.database.firebase.child(this.key);
    return ref.set(value, function(err) {
      if (err) {
        return typeof next === "function" ? next(err) : void 0;
      }
      return _this.database.request("sync/" + _this.key, function(err, doc) {
        if (err) {
          return typeof next === "function" ? next(err) : void 0;
        }
        _this.updateData(value);
        return typeof next === "function" ? next(null) : void 0;
      });
    });
  };

  DocumentRef.prototype.updateData = function(data) {
    var k, key, keys, target, _i, _j, _len, _ref, _ref1;
    this.data = data;
    if (this.path.length === 0) {
      return this.document.data = data;
    } else {
      _ref = this.path, keys = 2 <= _ref.length ? __slice.call(_ref, 0, _i = _ref.length - 1) : (_i = 0, []), key = _ref[_i++];
      target = this.document.data;
      for (_j = 0, _len = keys.length; _j < _len; _j++) {
        k = keys[_j];
        if ((_ref1 = target[k]) == null) {
          target[k] = {};
        }
        target = target[k];
      }
      return target[key] = data;
    }
  };

  DocumentRef.prototype.val = function() {
    if (Array.isArray(this.data)) {
      return extend([], this.data);
    } else if (typeof this.data === 'object') {
      return extend({}, this.data);
    } else {
      return this.data;
    }
  };

  return DocumentRef;

})(exports.EventEmitter);
