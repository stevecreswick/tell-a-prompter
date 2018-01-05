const redditRequest = require( './tasks/redditRequest' );
const buildScheduler = require( './tasks/buildScheduler' );
const queryUrl = 'https://www.reddit.com/r/WritingPrompts/top/.json?limit=20';

// We are able to get the first response from Reddit and build an array of prompts
redditRequest( queryUrl ).then(
  function( prompts ) {
    prompts.map( prompt => buildScheduler.queuePost( prompt ) );
  }
);

// Recursive Queries
// Provide Number of Prompts to Find



// Set up Elixir Backend for Prompts
// Make Post Request
