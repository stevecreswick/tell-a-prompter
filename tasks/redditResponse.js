const parseResponse = function( response ) {
  return JSON.parse( response.data.children );
};

const responseCount = function( posts ) {
  return posts.length || -1;
};

// ---------------------------------------------
// Determine Prompts to Write
const promptTag = function( postTitle ) {
  return postTitle.substring(0, 4);
};

const isWritingPrompt = function( post ) {
  switch ( promptTag( post.data.title ) ) {
    case '[WP]':
      return true;
      break;
    default:
      return false;
  }
};

const recordsToWrite = function( posts ) {
  return posts.filter( post => isWritingPrompt( post ) );
};

// ---------------------------------------------
// Format Data to Write
const cleanTitle = function( title ) {
  return removeLeadingSpaces( title.substring( 4, title.length ) );
};

const removeLeadingSpaces = function( text ) {
  while ( text.charAt(0) === ' ' ) {
    text = text.substring( 1, text.length );
  }

  return text;
};

const definePrompt = function( post ) {
  return {
    title: cleanTitle( post.data.title ),
    // author_id: 1,
    provider: 'Reddit',
    providerAuthor: post.data.author,
    providerDate: post.data.created, 
    providerId: post.data.id,
    providerUrl: post.data.url
  };
};

// ---------------------------------------------
// redditResponse
module.exports = function redditResponse( response ) {
  const posts = parseResponse( response );

  if ( responseCount( posts ) ) {
    return recordsToWrite( posts ).map( post => definePrompt( post ) );
  }
};
