/*globals $:true*/

var CONGRESS_URL = 'http://congress.api.sunlightfoundation.com';
var API_KEY = '8d0caa0295254038a5b61878a06d80ec';

var TWEET_MESSAGE = 'Lorem ipsum, etc., etc.,';

function getLegislators(zip, cb) {
  $.getJSON(CONGRESS_URL + '/legislators/locate?apikey=' + API_KEY + '&zip=' +
    zip, function (legislators) {
    cb(legislators.results);
  });
}

function submitZipcode() {
  $('#tweets').html('').addClass('loading');
  getLegislators($('#zipcode').val(), function (legislators) {
    $('#tweets').removeClass('loading');

    var htmlFragment = '';
    var tweet_template = $('#tweet-template').html();
    legislators.filter(function (legislator) {
      // Filter to legislators who have Twitter handles and are house
      // representatives
      return legislator.twitter_id !== '' &&
        legislator.chamber === 'house';
    }).forEach(function (legislator) {
      htmlFragment += _.template(tweet_template, {legislator: legislator, message: TWEET_MESSAGE})

    });

    $('#tweets').html(htmlFragment);

    $.getScript("http://platform.twitter.com/widgets.js");
  });
}

$(function () {
  $('form').submit(function () {
    submitZipcode();

    return false;
  });
});
