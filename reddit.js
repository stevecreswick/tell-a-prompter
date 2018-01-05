// Load Environment
if ( process.env.NODE_ENV !== 'production' ) {
  require( 'dotenv' ).config();
}

// Imports
// TODO: Transition to import syntax
const request = require( 'request' );
const Q = require( 'q' );
const minimist = require( 'minimist' );
const printJson = require( './utils/printJson' );

// REDDIT CREDENTIALS
const REDDIT_CLIENT  =  process.env.REDDIT_CLIENT;
const REDDIT_SECRET  =  process.env.REDDIT_SECRET;
const USER_AGENT     =  'write-away/0.0.1';

// ACCESS TOKEN
let ACCESS_TOKEN     =  '';

// QUERY PARAMETERS
const options = minimist( process.argv.slice( 2 ) );
const before = options.before || options.b;
const after = options.after || options.a;

const apiOptions = {
  token: '',
  after: '',
  before: '',
  limit: '2',
  count: '',
  show: ''
};

if ( before && after ) {
  console.log( 'WARNING : You can only pass before OR after. ' +
               'Not BOTH. Running without arguments.' );
}
else if ( before ) {
  apiOptions.before = before;
}
else if ( after ) {
  apiOptions.after = after;
}


// Add Parameters
const filtered = function filterParameters( params ) {
  return params.filter( function( param ) {
    if ( param[ 0 ] && param[ 1 ] ) {
      return param;
    }
  } );
};

const combine = function joinParameters( params ) {
  return params.map( function( param ) {
    var field = param[ 0 ];
    var value = param[ 1 ];

    if ( value.length > 0 ) {
      return field + '=' + value;
    }
  } ).join( '&' );
};

const parameters = function formattedParameters( options ) {
  const params = Object.entries( options );
  const queryParams = combine( filtered( params ) );

  return queryParams.length ?
    '?' + queryParams :
    '';
};

// Reddit Access Token
const getToken = function redditAccessTokenRequest() {
  const deferred = Q.defer();
  const urlBase = 'https://www.reddit.com/api/v1/access_token';

  request( {
      method: 'POST',
      uri: urlBase,
      headers: { 'User-Agent': USER_AGENT },
      form: {
        grant_type: 'client_credentials'
      },
      auth: {
        user: REDDIT_CLIENT,
        pass: REDDIT_SECRET
      }
    },
    function( error, response, body ) {
      const responseBody = JSON.parse( body );
      const accessToken = responseBody[ 'access_token' ];

      deferred.resolve( accessToken );
    }
  );

  return deferred.promise;
};

const redditToken = function returnOrRetrieveRedditAccessToken() {
  const deferred = Q.defer();

  if ( ACCESS_TOKEN ) {
    deferred.resolve( ACCESS_TOKEN );
  }
  else {
    getToken().then(
      function( token ) {
        ACCESS_TOKEN = token;
        deferred.resolve( ACCESS_TOKEN );
      }
    );
  }

  return deferred.promise;
};

// Request For Writing Prompts
const redditGet = function redditApiGetRequest( accessToken, options ) {
  const deferred = Q.defer();
  const baseUrl = 'https://oauth.reddit.com';
  const subReddit = '/r/' + 'WritingPrompts';
  const authorizedRoute = baseUrl + subReddit + parameters( options );

  request( {
      method: 'GET',
      uri: authorizedRoute,
      headers: { 'User-Agent': USER_AGENT },
      auth: {
        'bearer': accessToken
      },
    },
    function( error, response, body ) {
      const responseBody = JSON.parse( body );
      deferred.resolve( responseBody );
    }
  );

  return deferred.promise;
};

const redditQuery = function redditTokenAndApiRequest( params ) {
  const deferred = Q.defer();

  redditToken().then(
    function( token ) {
      redditGet( token, params ).then(
        function( response ) {
          const data = response[ 'data' ][ 'children' ];
          const posts = data.map( function( post ) {
            for ( let key in post ) {
              if (  post.hasOwnProperty( key ) && key === 'data' ) {
                return post[ key ];
              }
            }
          } );

          deferred.resolve( posts );
        }
      );
    }
  );

  return deferred.promise;
};

//
const tag = function getPostTitleTag( postTitle ) {
  return postTitle.substring( 0, 4 );
};

const trimFront = function removeLeadingSpaces( text ) {
  while ( text.charAt(0) === ' ' ) {
    text = text.substring( 1, text.length );
  }

  return text;
};

const cleanPost = function removeTagAndLeadingSpaces( title ) {
  return trimFront( title.substring( 4, title.length ) );
};

const extract = function extractPromptSchemaFields( post ) {
  return {
    // App Fields
    type_name: 'writing_prompt',
    provider_author: post.author,
    originated_at: post.created_utc,
    tag: tag( post.title ),
    message: cleanPost( post.title ),
    value: 0,

    // Provider Fields
    provider: 'Reddit',
    provider_locator: post.name,
    provider_id: post.id,
    provider_date: post.created,
    provider_url: post.url,
    provider_rating: post.score,
    provider_comments: post.num_comments
  };
};

const isPrompt = function checkForAcceptedPostTags( post ) {
  const acceptedTags = [ '[WP]' ];
  return acceptedTags.indexOf( tag( post.title ) ) !== -1;
};

const storeFirstName = function( prompt ) {
  console.log( 'First ' );
  printJson( prompt );
};

const storeLastName = function( prompt ) {
  console.log( 'Last ' );
  printJson( prompt );
};

// Initialize
redditQuery( apiOptions ).then(
  function( redditPosts ) {
    const prompts = redditPosts
                      .filter( post => isPrompt( post ) )
                      .map( prompt => extract( prompt ) );

    const firstPrompt = prompts[ 0 ];
    const lastPrompt = prompts[ prompts.length - 1 ];

    // TODO: Use the First and last post as offsets
    storeFirstName( firstPrompt );
    storeLastName( lastPrompt );
    // printJson( prompts );
  }
);
