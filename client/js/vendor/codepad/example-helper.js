function getExampleRef(id) {
  // Get hash from end of URL or generate a random one.

  var id = id;//Math.floor(Math.random() * 9999999999).toString();

  //var ref = new Firebase('https://rederic2013.firebaseio.com/codepad/');
  var hash = window.location.hash.replace(/#/g, '');
  if (hash) {
    ref = new Firebase('https://rederick2.firebaseio.com/codepad/' + hash);//ref.child(hash);
  } else {
    ref = new Firebase('https://rederick2.firebaseio.com/codepad/' + id);//ref.push('123'); // generate unique location.
    window.location = window.location + '#' + ref.name(); // add it as a hash to the URL.
  }

  if (typeof console !== 'undefined')
    console.log('Firebase data: ', ref.toString());

  return ref;
}
