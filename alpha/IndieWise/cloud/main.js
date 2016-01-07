// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function (request, response) {
    response.success("Hello world!");
});

var stream = require('cloud/getstream.js');
//var github = require('cloud/github.js');
var utils = require('cloud/utils.js');
var settings = require('cloud/settings.js');
var _ = require('cloud/underscore');


// initialize the getstream.io client
var client = stream.connect(settings.streamApiKey, settings.streamApiSecret, settings.streamApp, {location: 'us-east'});

/*
 * Listen to the activityModels afterSave and afterDelete
 * and send the activities to getstream.io
 */
_.each(settings.activityModels, function (model) {
    Parse.Cloud.afterSave(model, function (request) {
        // trigger fanout
        //utils.countWatched();
        var actorCheck = request.object.get('actor');
        if (actorCheck != null) {
            var activity = utils.parseToActivity(request.object);
            var feed = client.feed(activity.feed_slug, activity.feed_user_id);
            feed.addActivity(activity, utils.createHandler());
        }
    });

    Parse.Cloud.afterDelete(model, function (request) {
        // trigger fanout to remove
        var activity = utils.parseToActivity(request.object);
        var feed = client.feed(activity.feed_slug, activity.feed_user_id);
        // remove by foreign id
        feed.removeActivity({
            foreignId: activity.foreign_id
        }, utils.createHandler());
    });
});

/*
 * Sync the follow state to getstream.io
 */
Parse.Cloud.afterSave(settings.followModel, function (request) {
    // trigger fanout & follow
    var parseObject = request.object;
    var activity = utils.parseToActivity(parseObject);
    var feed = client.feed(activity.feed_slug, activity.feed_user_id);
    feed.addActivity(activity, utils.createHandler());
    // flat feed of user will follow user feed of target
    var flat = client.feed('flat', parseObject.get('actor').id);
    flat.follow('user', parseObject.get('object').id, utils.createHandler());
});

Parse.Cloud.afterDelete(settings.followModel, function (request) {
    // trigger fanout & unfollow
    var parseObject = request.object;
    var activity = utils.parseToActivity(parseObject);
    var feed = client.feed(activity.feed_slug, activity.feed_user_id);
    feed.removeActivity({
        foreignId: activity.foreign_id
    }, utils.createHandler());
    // flat feed of user will follow user feed of target
    var flat = client.feed('flat', parseObject.get('actor').id);
    flat.unfollow('user', parseObject.get('object').id, utils.createHandler());
});

Parse.Cloud.afterSave('Critique', function (request) {
    // Re-Calculate IndieWise Rating
    var cQuery = new Parse.Query("Critique");
    cQuery.find(request.object.get("parent").id, {
        success: function(critiques) {
            var total = 0;
            _.each(critiques, function (a) {
                total += a.attributes.overall;
            });
            var critiqueAverage = total/critiques.length;
            var query = new Parse.Query("Film");
            query.get(request.object.get("parent").id, {
                success: function(film) {
                    film.set("iwRating", critiqueAverage);
                    film.save();
                },
                error: function(error) {
                    console.error("Got an error " + error.code + " : " + error.message);
                }
            });
        },
        error: function(error) {
            console.error("Got an error " + error.code + " : " + error.message);
        }
    });
});

Parse.Cloud.afterSave('Nomination', function (request) {
    // Check for other nominations of that type
    var query = new Parse.Query("Nomination");
    query.equalTo("awardPntr", request.object.get("awardPntr"));
    query.equalTo("filmPntr", request.object.get("filmPntr"));
    query.notEqualTo("critique", request.object.get("critique"));
    //query.notEqualTo("nominator", request.object.get("nominator"));
    query.find(null, {
        success: function (noms) {
            if (noms.length > (2)) {
                var win = new Parse.Object("AwardWin");
                win.set("award", request.object.get("awardPntr"));
                win.set("film", request.object.get("filmPntr"));
                win.save();
            }
        },
        error: function (error) {
            console.error("Got an error " + error.code + " : " + error.message);
        }
    })
});

/*
 * Retrieve latest of a specific action (watch, judge, comment, reaction, etc)
 */
Parse.Cloud.define("top", function (request, response) {
     var verb = request.params.verb;
     var promises = [];
     var arr = [];

    var query = new Parse.Query("Action");
    query.equalTo("verb", verb);

});
/*Parse.Cloud.define("latest", function (request, response) {
    var verb = request.params.verb;
    var promises = [];
    var arr = [];
    //var className = request.params.className;

    var query = new Parse.Query("Action");
    query.equalTo("verb", verb);
    query.limit(5);
    query.find({
        success: function(results) {

            _.each(results, function (a) {
                //if (_.isString(a.object)) {
                    var parts = a.get('object').split(':');
                    var q = new Parse.Query(parts[0]);
                    var promise_1 = q.get(parts[1]).then(function (obj) {
                        return obj;
                    });
                    promises.push(promise_1);
                //}
            });


            var all = Parse.Promise.when(promises);

            var promise = all.then(function (data) {

                // create the result hash
                var resultSets = _.toArray(arguments).slice(1);
                var resultHash = {};
                _.each(resultSets, function(results) {
                    if (results.length) {
                        resultHash[results[0].className] = {};
                        _.each(results, function(result) {
                            resultHash[result.className][result.id] = result;
                        });
                    }
                });

                response.success(_.toArray(resultSets));
                //response.success(data);
            });
        },
        error: function() {
            response.error(response);
        }
    });
});*/


/*
 * View to retrieve the feed, expects feed in the format user:1
 * Accepts params
 *
 * feed: the feed id in the format user:1
 * limit: how many activities to get
 * id_lte: filter by activity id less than or equal to (for pagination)
 *
 */
Parse.Cloud.define("feed", function(request, response) {
    var feedIdentifier = request.params.feed;
    var feedParts = feedIdentifier.split(':');
    var feedSlug = feedParts[0];
    var userId = feedParts[1];
    var id_lte = request.params.id_lte || undefined;
    var limit = request.params.limit || 100;
    var params = {
        limit : limit
    };
    if (id_lte) {
        params.id_lte = limit;
    }
    // initialize the feed class
    var feed = client.feed(feedSlug, userId);
    feed.get(params, function(httpResponse) {
        var activities = httpResponse.data;
        // enrich the response with the database values where needed
        var promise = utils.enrich(activities.results);
        promise.then(function(activities) {
            response.success({
                activities : activities,
                feed : feedIdentifier,
                token : feed.token
            });
        });
    }, utils.createHandler(response));
});

/*
 * Bit of extra logic for likes
 */

/*
Parse.Cloud.afterSave("Rating", function (request) {
    // trigger fanout
    var activity = utils.parseToActivity(request.object);
    var feed = client.feed(activity.feed_slug, activity.feed_user_id);
    feed.addActivity(activity, utils.createHandler());
    // get the related object
    var like = request.object;
    var activityType = like.get('activity_type');
    var pointer = like.get('activity_' + activityType);
    var query = new Parse.Query(pointer.className);
    query.get(pointer.id, function (activity) {
        // increment the likes
        activity.increment('ratingCount');
        activity.save();
    });
});

Parse.Cloud.afterDelete("Rating", function (request) {
    // trigger fanout to remove
    var activity = utils.parseToActivity(request.object);
    var feed = client.feed(activity.feed_slug, activity.feed_user_id);
    // remove by foreign id
    feed.removeActivity({
        foreignId: activity.foreign_id
    }, utils.createHandler());
    // get the related object
    var like = request.object;
    var activityType = like.get('activity_type');
    var pointer = like.get('activity_' + activityType);
    var query = new Parse.Query(pointer.className);
    query.get(pointer.id, function (activity) {
        // decrement the likes
        activity.increment('ratingCount', -1);
        activity.save();
    });
});*/

var logIn = function(req, onResponse) {
    var twitter = new twitterAPI({
        //set environment variables specific to Twitter application
        consumerKey: 'nnSvvHd86gBpxPwJaLGvzM2Mm',
        consumerSecret: 'TbzbhcsQIDzbNLPrDfyirstXTJXI71WANCISNjf4NImzXACHZq',
        callback: CALLBACK
    });

    if(req.query.oauth_token && req.query.oauth_verifier) { //coming back from successful Twitter log in
        twitter.getAccessToken(req.session.requestToken, req.session.requestTokenSecret, req.query.oauth_verifier, function(error, accessToken, accessTokenSecret, results) {
            if (error) {
                onResponse.error("Error with retrieving access tokens: " + error);
            } else {
                //get credentials and store similarly to parse API.
                twitter.verifyCredentials(accessToken, accessTokenSecret, function(error, data, response){
                    if (error) {
                        onResponse.error("Couldn't verifiy credentials: " + error);
                    } else {
                        //javascript sdk doesn't support logging in manually with authData.
                        //use REST API instead.
                        var authData = {
                            'twitter': {
                                'id': data['id_str'],
                                'screen_name': data['screen_name'],
                                'consumer_key': CONSUMER_KEY,
                                'consumer_secret': CONSUMER_SECRET,
                                'auth_token': accessToken,
                                'auth_token_secret': accessTokenSecret
                            }
                        };

                        request.post({
                                headers: {'X-Parse-Application-Id': process.env.APP_KEY, 'X-Parse-REST-API-Key': process.env.REST_KEY, 'Content-Type': 'application/json'},
                                url: 'https://api.parse.com/1/users',
                                json: {'authData': authData}
                            },
                            function (error, response, body) {
                                if (error) {
                                    onResponse.error("Error authenticating with Parse: " + error);
                                } else {
                                    onResponse.success(body);
                                }
                            }
                        );
                    }
                });
            }
        });
    } else {
        //display sign in forms.
        twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results) {
            if (error) {
                onResponse.error("Error getting OAuth request tokens: " + error);
            } else {
                //store in session
                req.session.requestToken = requestToken;
                req.session.requestTokenSecret = requestTokenSecret;
                var authURL = "https://twitter.com/oauth/authenticate?oauth_token=" + requestToken;

                onResponse.auth_setup(authURL);
            }
        });
    }
}
