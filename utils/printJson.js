var prettyjson = require('prettyjson');

module.exports = function( data ) {
  var options = {
    keysColor: 'magenta',
    dashColor: 'cyan',
    stringColor: 'grey'
  };

  // return console.log(JSON.stringify(data, null, 4));
  return console.log( prettyjson.render( data, options ) );
};
