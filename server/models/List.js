var q = require('q');

var Firebase = require('../models/Firebase.js');
var listRef = Firebase.getRef('');

module.exports = {

	getUsers : function(){

	    var def = q.defer();          

	    listRef.child('users').once( 'value', function (snap) {
	    	var records = [];
			snap.forEach(function(ss) {
			 	records.push(ss.val());
			});
			def.resolve(records);
	    });

	    return def.promise;
	}
	
}