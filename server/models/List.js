var q = require('q');

var Firebase = require('firebase');
var listRef = new Firebase('https://rederick2.firebaseio.com/');

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