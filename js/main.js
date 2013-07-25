/*globals $:true, _:true, _trackEvent:true*/

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
  $('#legislators').addClass('loading');
  $('#tweets, #phones').hide();
  $('#tweets .list, #phones .list').html('');
  $('#what-to-say').slideDown(300);

  getLegislators($('#zipcode').val(), function (legislators) {
    $('#legislators').removeClass('loading');

    var tweetTemplate = $('#tweet-template').html();
    var phoneTemplate = $('#phone-template').html();

    var notFoundTemplate = $('#not-found-template').html();

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

    phoneFragments = phoneFragments || notFoundTemplate;
    tweetFragments = tweetFragments || notFoundTemplate;
    $('.called').show();
    $('#thankyou').hide(300);
    $('#phones .list').html(phoneFragments);
    $('#tweets .list').html(tweetFragments);
    $('#phones').show();

    $.getScript("http://platform.twitter.com/widgets.js");
  });
}

$(function () {
  $('.called').on('click', function () {
    $('#tweets').fadeIn(300);
    $('#thankyou').fadeIn(300);
    $('.called').hide();
    $('#what-to-say').slideUp(300);
    $('#phones').slideUp(300);
    _gaq.push(['_trackEvent', 'action', 'called']);

  })
  $('form.zipcodeform').submit(function () {
    submitZipcode();
    _gaq.push(['_trackEvent', 'action', 'zipcode-lookup']);
    return false;
  });
    var callTemplate = $('#call-template').html();

  $.getJSON('call.json', function (legislators) {
    var yes = _.filter(legislators.votes, function (vote){
      return vote.vote[0] === 'Aye';
    });
    var no = _.filter(legislators.votes, function (vote){
      return vote.vote[0] === 'No';
    });
    $('.vote-table').html(_.template(callTemplate, {votes: {yes:yes, no:no}}));

    console.log(yes.length, no.length);
  });
});
