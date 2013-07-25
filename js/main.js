/*globals $:true, _:true, _trackEvent:true*/

var CONGRESS_URL = 'http://congress.api.sunlightfoundation.com';
var API_KEY = '8d0caa0295254038a5b61878a06d80ec';

var TWEET_MESSAGE = 'I\'m one of your constituents. Please support the Amash ' +
  'amendment to curtail unconstitutional NSA surveillance. #defundnsa';

var BAD_TWITTER_HANDLES = [
  'S000510',
  'P000598',
  'O000170',
  'J000294'
];

function getLegislators(zip, cb) {
  $.getJSON(CONGRESS_URL + '/legislators/locate?apikey=' + API_KEY + '&zip=' +
    zip, function (legislators) {
    cb(legislators.results);
  });
}

function submitZipcode() {

  getLegislators($('#zipcode').val(), function (legislators) {

    $('[data-bio-id]').hide();
    legislators.filter(function (legislator) {
      return legislator.chamber === 'house';
    }).forEach(function (legislator) {
      console.log(legislator)
    $('[data-bio-id="'+legislator.bioguide_id+'"]').show();

    });

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
    var contactTemplate = $('#contact-template').html();

  $('body').on('click', '.contact-button', function (ev) {
    var twitter = $(ev.currentTarget).attr('data-twitter-id');
    var phone = $(ev.currentTarget).attr('data-phone-number');
    $(ev.currentTarget).hide();
    $('.number-and-twitter', $(ev.currentTarget).parents('.leg-contact')).show();
    $('.number-and-twitter', $(ev.currentTarget).parents('.leg-contact')).html(_.template(contactTemplate, {twitter: twitter, phone: phone}));
     $.getScript("http://platform.twitter.com/widgets.js");
  });
  $('body').on('submit', 'form.zipcodeform', function () {
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
    console.log(yes, no.length);
  });
});
