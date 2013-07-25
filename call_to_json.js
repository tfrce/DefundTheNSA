var request = require('superagent');
var _ = require('lodash');
var fs = require('fs');
var parseString = require('xml2js').parseString;
// Request XML
var votes = [];
var fullVoteData = {votes:[]};
request.get('http://clerk.house.gov/evs/2013/roll412.xml', function(res){
	// Parse XML to JSON
	parseString(res.text, function (err, result) {
		var call = {};
		var meta = result['rollcall-vote']['vote-metadata'];
    fullVoteData.meta = meta;
		
    var votes = result['rollcall-vote']['vote-data'][0]['recorded-vote']; // Recorded votes
    findLegislatorsDetails(votes);
	});
});

var CONGRESS_URL = 'http://congress.api.sunlightfoundation.com';
var API_KEY = '8d0caa0295254038a5b61878a06d80ec';
var findLegislatorsDetails = function (votes) {
  var vote = votes.pop();
  console.log(vote.legislator[0]['$']['name-id']);
  request.get(CONGRESS_URL + '/legislators?apikey=' + API_KEY + '&bioguide_id=' + vote.legislator[0]['$']['name-id'], function(res){
    vote.details = res.body.results[0];
    console.log('Next');
    fullVoteData.votes.push(vote);
    if(votes.length === 0) {
      finalizeResponse();
    } else {
      findLegislatorsDetails(votes);
    }
  })
}

var finalizeResponse = function () {
  console.log(fullVoteData);
  var outputFilename = 'call.json';

  fs.writeFile(outputFilename, JSON.stringify(fullVoteData, null, 4), function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("JSON saved to ");
      }
  }); 
}