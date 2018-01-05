var request = require('request');
var Q = require( 'q' );

module.exports = function( post ) {
  console.log( 'CREATING ', post.title );
  console.log( 'LENGTH ', post.title.length );

  // var deferred = Q.defer();
  //
  // request( url , function ( error, response, body ) {
  //   var data = response.body;
  //   deferred.resolve( redditResponse( data ) );
  // });
  //
  // return deferred.promise;
};
