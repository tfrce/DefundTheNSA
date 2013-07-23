/*globals $:true*/

var CONGRESS_URL = 'http://congress.api.sunlightfoundation.com';
var API_KEY = '8d0caa0295254038a5b61878a06d80ec';

function getLegislators(zip, cb) {
  $.getJSON(CONGRESS_URL + '/legislators/locate?apikey=' + API_KEY + '&zip=' +
    zip, function (legislators) {
    cb(legislators);
  });
}

function submitZipcode() {
  getLegislators($('#zipcode').val(), function (legislators) {
    console.log(legislators);
  });

  /*
  for (var i = 0; i < a.length; i++) {
    if (a[i].legislator['twitter_id'] != '') {
      handles_avail = 1;
      message = "";
      messagef = '';
      urlmessage = encodeURIComponent(messagef);

      html_fragment = html_fragment + '<div class="legtweet clearfix" style="margin-top:20px;font-size:14px;"><div class="">' +
        message + '</div><div class="span2" id="'+
        a[i].legislator['twitter_id'] +
        '"><a href="https://twitter.com/intent/tweet?screen_name=' +
        a[i].legislator['twitter_id'] +
        '" class="twitter-mention-button legislatortweet" url="http://defundthensa.com" data-lang="en" data-count="none" data-size="large" data-counturl="http://defundthensa.com">Tweet to @' +
        a[i].legislator['twitter_id']+'</a></div></div>';
    }
  }

  if (handles_avail == 1) {
    $('div#legtweets').removeClass('hide');
    $('.get-legislators').parent().removeClass("error");
  }

  if (handles_avail == 0) {
    $('div#legtweets').addClass('hide');
    $('.get-legislators').parent().addClass("error");
  }

  $("#legtweets").html(html_fragment);
  */

  $.getScript("http://platform.twitter.com/widgets.js");
}

$(function () {
  $('#submit-zipcode').click(function (e) {
    e.preventDefault();

    submitZipcode();
  });

  $('#zipcode').keypress(function (e) {
    if (e.which === 13) {
      e.preventDefault();

      submitZipcode();
    }
  });
});
