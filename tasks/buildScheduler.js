const uuidv1 = require('uuid/v1');
var Q = require( 'q' );

const queuedPost = function( post ) {
  return {
    uuid: uuidv1(),
    date: new Date().getTime(),
    post: post
  }
};

const writePost = function( queuedPost ) {
  var deferred = Q.defer();

  console.log( queuedPost );
  // Before this step we need to have a database up that can
  // can store these writing prompts.
      // Elixir BackEnd
      // Creation and Storing of Prompts
  // Post Request
    // If Post Request Fails, Try Again
      // If not, do not schedule.

  deferred.promise;
};

module.exports = {
  writeQueue: [],

  queuePost: function( prompt ) {
    this.writeQueue.push( queuedPost( prompt ) );
  },

  writePosts: function() {
    const deferred = Q.defer();
    const writeQueue = this.writeQueue.splice( 0, 20 ) || [];
    const postPromises = writeQueue.map( post => writePost( post ) );

    Q.all( postPromises ).then( function() { deferred.resolve() } );

    return deferred.promise;
  }
};
