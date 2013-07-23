window.onload = function () {
  // ie shims
  if (!Object.keys) {
    Object.keys = function(o) {
      if (o !== Object(o))
        throw new TypeError('Object.keys called on a non-object');
      var k=[],p;
      for (p in o) if (Object.prototype.hasOwnProperty.call(o,p)) k.push(p);
      return k;
    }
  }

  function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
  results = regex.exec(location.search);
  return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


function randomize ( myArray ) {
  var i = myArray.length, j, temp;
  if ( i === 0 ) return false;
  while ( --i ) {
    j = Math.floor( Math.random() * ( i + 1 ) );
    temp = myArray[i];
    myArray[i] = myArray[j]; 
    myArray[j] = temp;
  }
}

function makeSocialDynamic(id) {

  var twhandles = ["fightfortheftr", "accessnow", "eff", "freepress", "sinak", "demandprogress"];
  randomize(twhandles);
  var baseurl = "https://www.stopwatching.us";
  var referrer = getParameterByName('r');
  fullurl = referrer ? baseurl + "?r=" + referrer : baseurl;
  if (id != "eff") {
    var facebook = '<a href="" onClick="window.open(\'http://www.facebook.com/sharer/sharer.php?u=' + fullurl + '\', \'sharer\', \'width=626,height=436\');"><img src="/media/images/fb.jpg" /></a><p>Facebook</p>';
    var twitter = '<a href="https://twitter.com/share" class="twitter-share-button" style="float:left;" data-text="Join me in calling on the NSA and the US government to #stopwatchingus.  Sign this now: " data-url="' + fullurl + '" data-related="' + twhandles[0] + ',' + twhandles[1] + ',' + twhandles[2] + ',' + twhandles[3] + ',' + twhandles[4] + '">Tweet</a><br /><p>Twitter</p>';

    !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document,'script','twitter-wjs');

    document.querySelector('.facebook').innerHTML = facebook;
    document.querySelector('.twitter').innerHTML = '<div id="tweet-reps">'+twitter+'</div>';

  }
  else {false}
};
var referenceId = getParameterByName('r')
makeSocialDynamic(referenceId);
};
$(document).ready(function(){
  $('#tweet-reps, #tweet-leg').click(function(){
    $('#tweet-leg').hide();
    $('.tweet-box').slideDown();
  });
});


function submitZip()
{
  $.ajax({
    type: 'GET',
    url: 'http://services.sunlightlabs.com/api/legislators.allForZip.json',
    data: 'zip=' + $('.zip').val() + '&apikey=0268e7d928694dfe85b778415c844a66',
    crossDomain: true,
    dataType: 'jsonp',
    jsonp: 'jsonp'
  }).done(function (xhr) {
    //console.log(xhr.response.legislators);

    var a = xhr.response.legislators;

    var html_fragment = '';
    var handles_avail = 0;

    for (var i = 0; i < a.length; i++) {
      if ( a[i].legislator['twitter_id'] != '')
      {
        handles_avail = 1;
        message = "";
        messagef = '';
        urlmessage = encodeURIComponent(messagef);

        html_fragment = html_fragment + '<div class="legtweet clearfix " style="margin-top:20px;font-size:14px;"><div class="">' + message + '</div><div class="span2" id="'+ a[i].legislator['twitter_id'] +'"><a href="https://twitter.com/intent/tweet?screen_name=' + a[i].legislator['twitter_id'] + '" class="twitter-mention-button legislatortweet" url="http://www.stopwatching.us" data-lang="en" data-count="none" data-size="large" data-counturl="http://stopwatching.us">Tweet to @'+a[i].legislator['twitter_id']+'</a></div></div>';
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
    $.getScript("http://platform.twitter.com/widgets.js");
  });
}
$('.get-legislators').click(function () {
  submitZip();
  window.setTimeout(function(){}, 300);
});
$('input.zip').keypress(function(e) {
  if(e.which == 13) {
    $(this).blur();
    $('.get-legislators').focus().click();
    window.setTimeout(function(){}, 300);
  }
});
