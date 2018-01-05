var request = require('request');
var Q = require( 'q' );
var redditResponse = require( '../tasks/redditResponse' );


// Headers to  Monitor.  From API Documentation.
  // X-Ratelimit-Used: Approximate number of requests used in this period
  // X-Ratelimit-Remaining: Approximate number of requests left to use
  // X-Ratelimit-Reset

module.exports = function( url ) {
  var deferred = Q.defer();

  request( url , function ( error, response, body ) {
    var headers = response.headers;
    var data = response.body;
    
    deferred.resolve( redditResponse( data ) );
  });

  return deferred.promise;
};

// Build Query That Begins Where the Last One Left Off
