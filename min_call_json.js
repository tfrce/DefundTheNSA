var fs = require('fs');
var _ = require('lodash');
fs.readFile('call.json', 'utf8', function(err, data) {
  var data = JSON.parse(data);
  var legislators = [];
  _.each(data.votes, function(leg){
  	var newLeg = {details:{}};
  	newLeg.vote = [leg.vote[0]];
  	newLeg.details.bioguide_id = leg.details.bioguide_id;
  	newLeg.details.first_name = leg.details.first_name;
  	newLeg.details.last_name = leg.details.last_name;
  	newLeg.details.facebook_id = leg.details.facebook_id;
  	newLeg.details.bioguide_id = leg.details.bioguide_id;
  	newLeg.details.twitter_id = leg.details.twitter_id;
  	newLeg.details.phone = leg.details.phone;
  	legislators.push(newLeg);
  });
  data.votes = legislators;
  console.log(data);
  fs.writeFile('call.min.json', JSON.stringify(data, null), function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("JSON saved to ");
      }
  }); 
});/*
"legislator": [
                {
                    "_": "Young (IN)",
                    "$": {
                        "name-id": "Y000064",
                        "sort-field": "Young (IN)",
                        "unaccented-name": "Young (IN)",
                        "party": "R",
                        "state": "IN",
                        "role": "legislator"
                    }
                }
            ],
            "vote": [
                "No"
            ],
            "details": {
                "bioguide_id": "Y000064",
                "birthday": "1972-08-24",
                "chamber": "house",
                "contact_form": "http://toddyoung.house.gov/contact-us/",
                "crp_id": "N00030670",
                "district": 9,
                "facebook_id": "186203844738421",
                "fax": "202-226-6866",
                "fec_ids": [
                    "H0IN09070"
                ],
                "first_name": "Todd",
                "gender": "M",
                "govtrack_id": "412428",
                "in_office": true,
                "last_name": "Young",
                "middle_name": "C.",
                "name_suffix": null,
                "nickname": null,
                "office": "1007 Longworth House Office Building",
                "party": "R",
                "phone": "202-225-5315",
                "state": "IN",
                "state_name": "Indiana",
                "thomas_id": "02019",
                "title": "Rep",
                "twitter_id": "RepToddYoung",
                "votesmart_id": 120345,
                "website": "http://toddyoung.house.gov",
                "youtube_id": "RepToddYoung"
            }
            */