var Firebase = require('firebase');

module.exports = {

	getRef : function(colletion){

	    var ref = new Firebase('https://rederick2.firebaseio.com/' + colletion);

	    ref.auth('2efGhx8RPPDs8WX3Pe1LeVSWu8cycWghFNJ7DR9N', function(error) {
		  if(error) {
		    console.log("Login Firebase Failed!", error);
		     //return null;
		  } else {
		    console.log("Login Firebase Succeeded!");
		     
		  }
		});

		return ref;

	}
	
}