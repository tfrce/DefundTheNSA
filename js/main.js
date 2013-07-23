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
  getLegislators($('#zipcode').val(), function (legislators) {
    console.log(legislators);
    var htmlFragment = '';

    legislators.filter(function (legislator) {
      return legislator.twitter_id !== '';
    }).forEach(function (legislator) {
      htmlFragment += '<div class="legtweet clearfix" style="margin-top: 20px; font-size: 14px;"><div class="">' +
        TWEET_MESSAGE + '</div><div class="span2" id="' +
        legislator.twitter_id +
        '"><a href="https://twitter.com/intent/tweet?screen_name=' +
        legislator.twitter_id +
        '" class="twitter-mention-button legislatortweet" url="http://defundthensa.com" data-lang="en" data-count="none" data-size="large" data-counturl="http://defundthensa.com">Tweet to @' +
        legislator.twitter_id + '</a></div></div>';
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
