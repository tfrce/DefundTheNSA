/*globals $:true, _:true*/

var CONGRESS_URL = 'http://congress.api.sunlightfoundation.com';
var API_KEY = '8d0caa0295254038a5b61878a06d80ec';

var TWEET_MESSAGE = 'I\'m one of your constituents. Please support the Amash ' +
  'amendment to curtail unconstitutional NSA surveillance. #defundnsa';

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

    var tweetTemplate = $('#tweet-template').html();
    var phoneTemplate = $('#phone-template').html();

    var tweetFragments = '';
    var phoneFragments = '';

    legislators.filter(function (legislator) {
      return legislator.chamber === 'house';
    }).forEach(function (legislator) {
      phoneFragments += _.template(phoneTemplate, {
        name: [
          legislator.first_name,
          legislator.middle_name,
          legislator.last_name
        ].join(' '),
        phone: legislator.phone
      });
    });

    legislators.filter(function (legislator) {
      return legislator.chamber === 'house' &&
        legislator.twitter_id !== '';
    }).forEach(function (legislator) {
      tweetFragments += _.template(tweetTemplate, {
        legislator: legislator,
        message: TWEET_MESSAGE
      });
    });

    $('#phones').html(phoneFragments);
    $('#tweets').html(tweetFragments);

    $.getScript("http://platform.twitter.com/widgets.js");
  });
}

$(function () {
  $('form').submit(function () {
    submitZipcode();

    return false;
  });
});
