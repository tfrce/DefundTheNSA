/*globals $:true, _:true, _gaq:true*/

var CONGRESS_URL = 'https://congress.api.sunlightfoundation.com';
var API_KEY = '8d0caa0295254038a5b61878a06d80ec';

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
      console.log(legislator);

      $('[data-bio-id="' + legislator.bioguide_id + '"]').show();
    });
  });
}

$(function () {


  var contactTemplate = $('#contact-template').html();

  $('body').on('click', '.contact-button', function (ev) {
    var twitter = $(ev.currentTarget).attr('data-twitter-id');
    var phone = $(ev.currentTarget).attr('data-phone-number');
    var vote = $(ev.currentTarget).attr('data-vote');
    _gaq.push(['_trackEvent', 'action', 'contact-button-clicked']);

    var message;

    if (vote !== 'Aye') {
      message = "It's shameful that you voted for unconstitutional record " +
        "collection instead of privacy! http://defundthensa.com/ #defundNSA";
    } else {
      message = "Thank you for supporting #privacy! You're earning my vote, " +
        "keep up the good work! http://defundthensa.com/ #defundNSA";
    }

    $(ev.currentTarget).hide();

    $('.number-and-twitter', $(ev.currentTarget).parents('.leg-contact')).show();
    $('.number-and-twitter', $(ev.currentTarget).parents('.leg-contact'))
      .html(_.template(contactTemplate,
        { message: message, twitter: twitter, phone: phone }));

    $.getScript("http://platform.twitter.com/widgets.js");
  });

  $('body').on('submit', 'form.zipcodeform', function () {
    submitZipcode();
    _gaq.push(['_trackEvent', 'action', 'zipcode-lookup']);
    return false;
  });

  var callTemplate = $('#call-template').html();

  $.getJSON('call.min.json', function (legislators) {
    // Some legislators have Twitter handles specified that don't actually
    // exist; here we filter them out.
    BAD_TWITTER_HANDLES.forEach(function (id) {
      var legislator = _.find(legislators.votes,
        { details: { bioguide_id: id } });

      legislator.details.twitter_id = null;
    });

    legislators.votes = _.sortBy(legislators.votes, function (legislator) {
      return legislator.details.last_name + ' ' + legislator.details.first_name;
    });

    var yes = _.filter(legislators.votes, function (vote) {
      return vote.vote[0] === 'Aye';
    });

    var no = _.filter(legislators.votes, function (vote) {
      return vote.vote[0] === 'No';
    });

    $('.vote-table').html(_.template(callTemplate, {votes: {yes: yes, no: no}}));

    console.log(yes, no.length);
  });
});
