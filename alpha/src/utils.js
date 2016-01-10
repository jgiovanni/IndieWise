/**
 * Utility Functions
 * Created by Jerez on 11/8/2015.
 */
angular.module('IndieWise.utilities', [])
.factory('UtilsService',  ['$rootScope', '$window', '$sce', function ($rootScope, $window, $sce) {
        'use strict';

        return {
            compressArray: function (original) {
                var compressed = [];
                // make a copy of the input array
                var copy = original.slice(0);

                // first loop goes over every element
                for (var i = 0; i < original.length; i++) {

                    var myCount = 0;
                    // loop over every element in the copy and see if it's the same
                    for (var w = 0; w < copy.length; w++) {
                        if (original[i] == copy[w]) {
                            // increase amount of times duplicate is found
                            myCount++;
                            // sets item to undefined
                            delete copy[w];
                        }
                    }

                    if (myCount > 0) {
                        var a = new Object();
                        a.value = original[i];
                        a.count = myCount;
                        compressed.push(a);
                    }
                }

                return compressed;
            },
            recordActivity: function (object, verb) {
                var action = new Parse.Object("Action");
                var me = Parse.User.current()||null;
                var objectOwner = undefined;
                var objData = {
                    targets:{}
                };

                // Handle verb
                verb = verb || undefined;
                switch (object.className) {
                    case 'Comment':
                        verb = verb || 'comment';
                        objectOwner = object.attributes.author;
                        if ( angular.isDefined(object.attributes.parentComment)) { // if reply, notify original comment author
                            verb = 'reply';
                            action.addUnique('to', 'notification:' + object.attributes.parentComment.attributes.author.id);
                            action.addUnique('to', 'aggregated:' + object.attributes.parentComment.attributes.author.id);
                            objData.targets.comment = {
                                id: object.attributes.parentComment.id,
                                owner: {
                                    id: object.attributes.parentComment.attributes.author.id,
                                    name: object.attributes.parentComment.attributes.author.attributes.first_name + ' ' + object.attributes.parentComment.attributes.author.attributes.last_name
                                },
                                body: object.attributes.parentComment.attributes.body
                            };
                        }
                        if ( angular.isDefined(object.attributes.parentFilm)) { // if comment to film, notify original film owner
                            action.addUnique('to', 'notification:' + object.attributes.parentFilm.attributes.owner.id);
                            action.addUnique('to', 'aggregated:' + object.attributes.parentFilm.attributes.owner.id);
                            objData.targets.film = {
                                id: object.attributes.parentFilm.attributes.owner.id,
                                owner: {
                                    id: object.attributes.parentFilm.attributes.owner.id,
                                    name: object.attributes.parentFilm.attributes.owner.attributes.first_name+' '+object.attributes.parentFilm.attributes.owner.attributes.last_name
                                },
                                name: object.attributes.parentFilm.attributes.name
                            };
                        }
                        if ( angular.isDefined(object.attributes.parentCritique)) { // if comment to film, notify original critique author
                            action.addUnique('to', 'notification:' + object.attributes.parentCritique.attributes.author.id);
                            action.addUnique('to', 'aggregated:' + object.attributes.parentCritique.attributes.author.id);
                            objData.targets.critique = {
                                id: object.attributes.parentCritique.id,
                                owner: {
                                    id: object.attributes.parentCritique.attributes.author.id,
                                    name: object.attributes.parentCritique.attributes.author.attributes.first_name+' '+object.attributes.parentCritique.attributes.author.attributes.last_name
                                }
                            };
                        }
                        objData.body = object.attributes.body;
                        break;
                    case 'Film':
                        verb = verb || 'watch';
                        objectOwner = object.attributes.owner;
                        objData.id = object.id;
                        objData.name = object.attributes.name;
                        objData.watcher = {
                            id: me.id,
                            name: me.attributes.first_name+' '+me.attributes.last_name
                        };
                        if (verb === 'watch')
                            action.addUnique('to', 'watched:all');

                            var query = new Parse.Query("Watched");
                            query.equalTo("film", {__type: "Pointer", className: "Film", objectId: object.id});
                            query.first().then(function (res) {
                                if (res) {
                                    res.increment("count");
                                    res.save();
                                } else {
                                    var watched = new Parse.Object("Watched");
                                    watched.set('film', {__type: "Pointer", className: "Film", objectId: object.id});
                                    watched.increment("count");
                                    watched.save();
                                }
                            });
                        break;
                    case 'Critique':
                    case 'Nomination':
                        verb = verb || 'judge';
                        objData.id = object.id;
                        objData.targets.film = {
                            id: object.attributes.parent.id,
                            name: object.attributes.parent.attributes.name
                        };
                        objectOwner = object.attributes.author;
                        action.addUnique('to', 'notification:' + object.attributes.parent.attributes.owner.id);
                        action.addUnique('to', 'aggregated:' + object.attributes.parent.attributes.owner.id);
                        break;
                    case 'Message':
                        verb = verb || 'message';
                        objectOwner = object.attributes.from;
                        _.each(object.participants, function (a) {
                            if (a.id !== me.id)
                                action.addUnique('to', 'notification:'+a.id);
                                action.addUnique('to', 'aggregated:'+a.id);
                        });
                        objData.body = object.attributes.body;
                        break;
                    case 'Rating':
                        verb = verb || 'like';
                        objectOwner = object.attributes.author;
                        objData.id = object.id;
                        objData.body = object.attributes.down || object.attributes.up;
                        objData.targets.film = {
                            id: object.attributes.parent.id,
                            name: object.attributes.parent.attributes.name
                        };
                        action.addUnique('to', 'notification:' + object.attributes.parent.attributes.owner.id);
                        break;
                    case 'Reaction':
                        verb = verb || 'react';
                        objectOwner = object.attributes.user;
                        objData.id = object.id;
                        objData.body = object.attributes.emotion;
                        objData.targets.film = {
                            id: object.attributes.parent.id,
                            name: object.attributes.parent.attributes.name
                        };
                        action.addUnique('to', 'notification:' + object.attributes.parent.attributes.owner.id);
                        action.addUnique('to', 'aggregated:' + object.attributes.parent.attributes.owner.id);
                        break;
                }
                objData.owner = {
                    id: objectOwner.id,
                    name: objectOwner.attributes.first_name+' '+objectOwner.attributes.last_name
                };
                // we write to the user feed
                action.set('actor', me);
                action.set('verb', verb);
                action.set('feedSlug', 'user');
                action.set('feedUserId', me ? me.id : null);
                var objString = object.className+':'+object.id;
                action.set('object', objString);
                /*action.set('object', {
                 className: object.className,
                 id: object.id
                 });*/

                // Notify Object Owner
                if (angular.isDefined(objectOwner) && (!me || objectOwner.id !== me.id)) {
                    action.addUnique('to', 'notification:'+objectOwner.id);
                    action.addUnique('to', 'aggregated:'+objectOwner.id);
                }

                if(_.contains(['Comment', 'Film', 'Critique', 'Message', 'Nomination'], object.className)) {
                    // the feed data
                    action.set('foreign_id', objString);
                    //action.set('activity_type', 'Film');
                    action.set('likes', 0);
                    // to is also often used for things such as @mentions
                    // see the docs https://getstream.io/docs/#targetting
                    // think of it as ccing an email
                    action.addUnique('to', 'user:all');
                } else {
                    // polymorphism is weird with parse
                    var parseActivity = 'Film';
                    var activityType = 'Film';
                    var activityField = 'activity_' + activityType;
                    action.set(activityField, parseActivity);
                    var streamActivityId = object.attributes.parent.id;
                    action.set('activityId', streamActivityId);
                    action.addUnique('to', 'user:all');

                    // the activity you like
                    action.set('activity_type', activityType);
                }
                action.set('object_data', objData);
                action.save().then(function (res) {
                    console.log('Action: ', res);
                });
            },
            enrichNotifications: function (data) {
                // TODO rule out the need to query Parse for additional data
                var unseen = 0,unread = 0;
                _.each(data.activities, function (n) {
                    n.actors = [], n.actiList = [], n.summary = {
                        names: ''
                    };
                    var actorIds = [];
                    _.each(n.activities, function (a, i) {
                        if(angular.isDefined(a.actor_parse)) {
                            var actor = {
                                id: a.actor_parse.id || null,
                                name: a.actor_parse.attributes.first_name + ' ' + a.actor_parse.attributes.last_name
                            };
                            if (!_.contains(actorIds, actor.id)) {
                                n.actors.push(actor);
                                actorIds.push(actor.id);
                            }
                        }
                        if (angular.isDefined(a.object_parse)) {
                            var obj = {id: a.object_parse.id, name: a.object_parse.attributes.name, class: a.object_parse.className};

                            n.icon = 'notifications';

                            switch (n.verb) {
                                case 'watch':
                                    n.icon = 'video_library';
                                    obj.url = {state: 'video', args: {id: a.object_parse.id}};
                                    break;
                                case 'judge':
                                    n.icon = 'grade';
                                    obj.url = {state: 'video_critique', args: {id: a.object_data.targets.film.id}};
                                    obj.name = a.object_data.targets.film.name;
                                    break;
                                case 'comment':
                                    n.icon = 'comment';
                                    if (angular.isDefined(a.object_parse.attributes.parentComment)) {
                                        n.verb = 'reply';
                                    }
                                    if (angular.isDefined(a.object_data.targets.film)) {
                                        obj.url = {state: 'video', args: {id: a.object_data.targets.film.id}};
                                        obj.name = a.object_data.targets.film.name;
                                    }
                                    if (angular.isDefined(a.object_data.targets.critique)) {
                                        obj.url = {state: 'video_critique', args: {id: a.object_data.targets.critique.id}};
                                        obj.name = a.object_data.owner.name.endsWith('s') ? a.object_data.owner.name + '\' critique.' : a.object_data.owner.name + '\'s critique.';
                                    }
                                    break;
                                case 'message':
                                    n.icon = 'comment';
                                    obj.url = {state: 'messages', args: {id: a.object_parse.attributes.parent.id}};
                                    break;
                            }
                            obj.timestamp = a.object_parse.createdAt;
                            obj.data = a.object_data;
                            n.actiList.push(obj);
                        } else {
                            //var obj = {id: a.object.split(':')[2].id, name: '', class: a.object.split(':')[1].className};
                        }

                        if (obj && obj.name) {
                            n.summary.names += i == 0 ? '<a ui-sref="video({id: '+obj.id+'})">'+obj.name+'</a>' : ', <a ui-sref="video({id: '+obj.id+'})">'+obj.name+'</a>';
                        } /*else {
                            n.summary.names += i == 0 ? '<a ui-sref="video({id: '+obj.id+'})">'+obj.name+'</a>' : ', <a ui-sref="video({id: '+obj.id+'})">'+obj.name+'</a>';
                        }*/
                    });
                    if (!n.is_seen) {
                        unseen++;
                    }
                    if (!n.is_read) {
                        unread++;
                    }
                    n.summary.names = $sce.trustAsHtml(n.summary.names);
                    n.actiList = _.uniq(n.actiList, 'id');
                });

                return {
                    data: data,
                    unseen: unseen,
                    unread: unread
                };
            },
            enrichRawNotifications: function (data) {
                var unseen = 0,unread = 0;
                _.each(data, function (n) {
                    n.test = _.pluck(n.activities, 'object_data');
                    n.actors = [], n.objects = [], n.summary = {
                        names: ''
                    };
                    var actorIds = [];
                    _.each(n.activities, function (a, i) {
                        if (angular.isDefined(a.object_data)) {
                            n.icon = 'notifications';
                            var obj = {};

                            switch (n.verb) {
                                case 'like':
                                    n.icon = 'thumb_up';
                                    obj.url = {state: 'video', args: {id: a.object_data.targets.film.id}};
                                    break;
                                case 'unlike':
                                    n.icon = 'thumb_down';
                                    obj.url = {state: 'video', args: {id: a.object_data.targets.film.id}};
                                    break;
                                case 'watch':
                                    n.icon = 'video_library';
                                    obj.url = {state: 'video', args: {id: a.object_data.id}};
                                    break;
                                case 'react':
                                    n.icon = 'emotion';
                                    obj.url = {state: 'video', args: {id: a.object_data.targets.film.id}};
                                    break;
                                case 'judge':
                                    n.icon = 'grade';
                                    obj.url = {state: 'video_critique', args: {video_id: a.object_data.targets.film.id ,id: a.object_data.id}};
                                    obj.name = a.object_data.targets.film.name;
                                    break;
                                case 'comment':
                                    n.icon = 'comment';
                                    if (angular.isDefined(a.object_data.targets.comment)) {
                                        n.verb = 'reply';
                                    }
                                    if (angular.isDefined(a.object_data.targets.film)) {
                                        obj.url = {state: 'video', args: {id: a.object_data.targets.film.id}};
                                        obj.name = a.object_data.targets.film.name;
                                    }
                                    if (angular.isDefined(a.object_data.targets.critique)) {
                                        obj.url = {state: 'video_critique', args: {id: a.object_data.targets.critique.id}};
                                        obj.name = a.object_data.owner.name.endsWith('s') ? a.object_data.owner.name + '\' critique.' : a.object_data.owner.name + '\'s critique.';
                                    }
                                    break;
                                case 'message':
                                    n.icon = 'comment';
                                    //obj.url = {state: 'messages', args: {id: a.object_data.targets.parent.id}};
                                    break;
                            }
                            obj.timestamp = a.time;
                            obj.data = a.object_data;
                            n.objects.push(obj);
                        } else {
                            //var obj = {id: a.object.split(':')[2].id, name: '', class: a.object.split(':')[1].className};
                        }

                    });
                    if (!n.is_seen) {
                        unseen++;
                    }
                    if (!n.is_read) {
                        unread++;
                    }
                    n.main_url = n.objects[0].url;
                    //n.summary.names = $sce.trustAsHtml(n.summary.names);
                    //n.objects = _.uniq(n.objects, 'id');
                });

                return {
                    data: data,
                    unseen: unseen,
                    unread: unread
                };
            },
            deleteActivity: function(object) {
                var objectOwner = object.attributes.author || object.attributes.owner;

                var ownerQuery = new Parse.Query("Action");
                ownerQuery.equalTo('feedUserId', objectOwner.id);
                ownerQuery.equalTo('object', object.className+':'+object.id);

                var notificationQuery = new Parse.Query("Action");
                notificationQuery.equalTo('to', 'notification:'+objectOwner.id);
                notificationQuery.equalTo('object', object.className+':'+object.id);

                $rootScope.getNewToken('user', 'all').then(function (token) {
                    var feed = window.StreamClient.feed('user', 'all', token);

                    var mainQuery = Parse.Query.or(ownerQuery, notificationQuery);
                    mainQuery.find().then(function (res) {
                        _.each(res, function (a) {
                            var fID = 'ref:Action:'+ a.id;
                            console.log(fID);
                            feed.removeActivity({foreignId: fID});
                            a.destroy();
                        });
                    });
                });
            },
            parseJwt: function(token) {
                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace('-', '+').replace('_', '/');
                return JSON.parse($window.atob(base64));
            }
        }
    }]);

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(searchString, position) {
        var subjectString = this.toString();
        if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
}
