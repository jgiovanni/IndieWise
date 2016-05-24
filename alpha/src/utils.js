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
                /*DataService.save('Action', {
                    actor: $rootScope.AppData.User.userId,
                    verb: verb
                });
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
                        objectOwner = object.author;
                        if ( angular.isDefined(object.parentComment)) { // if reply, notify original comment author
                            verb = 'reply';
                            action.addUnique('to', 'notification:' + object.parentComment.author.id);
                            action.addUnique('to', 'flat_notifications:' + object.parentComment.author.id);
                            objData.targets.comment = {
                                id: object.parentComment.id,
                                owner: {
                                    id: object.parentComment.author.id,
                                    name: object.parentComment.author.first_name + ' ' + object.parentComment.author.last_name
                                },
                                body: object.parentComment.body
                            };
                        }
                        if ( angular.isDefined(object.parentFilm)) { // if comment to film, notify original film owner
                            action.addUnique('to', 'notification:' + object.parentFilm.owner.id);
                            action.addUnique('to', 'flat_notifications:' + object.parentFilm.owner.id);
                            objData.targets.film = {
                                id: object.parentFilm.id,
                                owner: {
                                    id: object.parentFilm.owner.id,
                                    name: object.parentFilm.owner.first_name+' '+object.parentFilm.owner.last_name
                                },
                                name: object.parentFilm.name
                            };
                        }
                        if ( angular.isDefined(object.parentCritique)) { // if comment to film, notify original critique author
                            action.addUnique('to', 'notification:' + object.parentCritique.author.id);
                            action.addUnique('to', 'flat_notifications:' + object.parentCritique.author.id);
                            objData.targets.critique = {
                                id: object.parentCritique.id,
                                owner: {
                                    id: object.parentCritique.author.id,
                                    name: object.parentCritique.author.first_name+' '+object.parentCritique.author.last_name
                                }
                            };
                        }
                        objData.body = object.body;
                        action.addUnique('to', 'comment:all');
                        break;
                    case 'Film':
                        verb = verb || 'watch';
                        objectOwner = object.owner;
                        objData.id = object.id;
                        objData.name = object.name;
                        objData.watcher = {
                            id: me.id,
                            name: me.first_name+' '+me.last_name
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
                            id: object.parent.id,
                            name: object.parent.name
                        };
                        objectOwner = object.author;
                        action.addUnique('to', 'notification:' + object.parent.owner.id);
                        action.addUnique('to', 'flat_notifications:' + object.parent.owner.id);
                        break;
                    case 'Message':
                        verb = verb || 'message';
                        objectOwner = object.from;
                        _.each(object.participants, function (a) {
                            if (a.id !== me.id)
                                action.addUnique('to', 'message:'+a.id);
                        });
                        objData.body = object.body;
                        break;
                    case 'Rating':
                        verb = verb || 'like';
                        objectOwner = object.author;
                        objData.id = object.id;
                        objData.body = object.down || object.up;
                        objData.targets.film = {
                            id: object.parent.id,
                            name: object.parent.name
                        };
                        action.addUnique('to', 'notification:' + object.parent.owner.id);
                        break;
                    case 'Reaction':
                        verb = verb || 'react';
                        objectOwner = object.user;
                        objData.id = object.id;
                        objData.body = object.emotion;
                        objData.targets.film = {
                            id: object.parent.id,
                            name: object.parent.name
                        };
                        action.addUnique('to', 'notification:' + object.parent.owner.id);
                        action.addUnique('to', 'flat_notifications:' + object.parent.owner.id);
                        break;
                }
                objData.owner = {
                    id: objectOwner.id,
                    name: objectOwner.first_name+' '+objectOwner.last_name
                };
                // we write to the user feed
                action.set('actor', me);
                action.set('verb', verb);
                action.set('feedSlug', 'user');
                action.set('feedUserId', me ? me.id : null);
                var objString = object.className+':'+object.id;
                action.set('object', objString);
                /!*action.set('object', {
                 className: object.className,
                 id: object.id
                 });*!/

                // Notify Object Owner
                if (angular.isDefined(objectOwner) && (!me || objectOwner.id !== me.id)) {
                    action.addUnique('to', 'notification:'+objectOwner.id);
                    action.addUnique('to', 'flat_notifications:'+objectOwner.id);
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
                    var streamActivityId = object.parent.id;
                    action.set('activityId', streamActivityId);
                    action.addUnique('to', 'user:all');

                    // the activity you like
                    action.set('activity_type', activityType);
                }
                action.set('object_data', objData);
                action.save().then(function (res) {
                    console.log('Action: ', res);
                });*/
            },
            enrichNotifications: function (data) {
                // TODO rule out the need to query Parse for additional data
                var unseen = 0,unread = 0;
                _.each(data.activities, function (a) {
                    a.actors = [], a.actiList = [];
                    var actorIds = [];
                    if(angular.isDefined(a.actor_parse)) {
                        var actor = {
                            id: a.actor_parse.id || null,
                            name: a.actor_parse.first_name + ' ' + a.actor_parse.last_name
                        };
                        if (!_.contains(actorIds, actor.id)) {
                            a.actors.push(actor);
                            actorIds.push(actor.id);
                        }
                    }
                    if (angular.isDefined(a.object_parse)) {
                        var obj = {id: a.object_parse.id, name: a.object_parse.name, class: a.object_parse.className};

                        a.icon = 'notifications';

                        switch (a.verb) {
                            case 'watch':
                                a.icon = 'video_library';
                                obj.url = {state: 'video', args: {id: a.object_parse.id}};
                                break;
                            case 'judge':
                                a.icon = 'grade';
                                obj.url = {state: 'video_critique', args: {id: a.object_data.targets.film.id}};
                                obj.name = a.object_data.targets.film.name;
                                break;
                            case 'comment':
                            case 'reply':
                                a.icon = 'comment';
                                if (angular.isDefined(a.object_parse.parentComment)) {
                                    a.verb = 'reply';
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
                                a.icon = 'comment';
                                obj.url = {state: 'messages', args: {id: a.object_parse.parent.id}};
                                break;
                        }
                        obj.timestamp = a.object_parse.createdAt;
                        obj.data = a.object_data;
                        a.actiList.push(obj);
                    } else {
                        //var obj = {id: a.object.split(':')[2].id, name: '', class: a.object.split(':')[1].className};
                    }

                    /* if (obj && obj.name) {
                        a.summary.names += i == 0 ? '<a ui-sref="video({id: '+obj.id+'})">'+obj.name+'</a>' : ', <a ui-sref="video({id: '+obj.id+'})">'+obj.name+'</a>';
                    }else {
                     a.summary.names += i == 0 ? '<a ui-sref="video({id: '+obj.id+'})">'+obj.name+'</a>' : ', <a ui-sref="video({id: '+obj.id+'})">'+obj.name+'</a>';
                     }*/
                    if (!a.is_seen) {
                        unseen++;
                    }
                    if (!a.is_read) {
                        unread++;
                    }
                    a.actiList = _.uniq(a.actiList, 'id');
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
                                case 'reply':
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
                var objectOwner = object.author || object.owner;

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

/**
 *  Javascript AlphabeticID class
 *  (based on a script by Kevin van Zonneveld &lt;kevin@vanzonneveld.net>)
 *
 *  Author: Even Simon &lt;even.simon@gmail.com>
 *
 *  Description: Translates a numeric identifier into a short string and backwords.
 *
 *  Usage:
 *    var str = AlphabeticID.encode(9007199254740989); // str = 'fE2XnNGpF'
 *    var id = AlphabeticID.decode('fE2XnNGpF'); // id = 9007199254740989;
 **/

var AlphabeticID = {
    index:'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',

    /**
     *  @function AlphabeticID.encode
     *  @description Encode a number into short string
     *  @param integer
     *  @return string
     **/
    encode:function(_number){
        if('undefined' == typeof _number){
            return null;
        }
        else if('number' != typeof(_number)){
            throw new Error('Wrong parameter type');
        }

        var ret = '';

        for(var i=Math.floor(Math.log(parseInt(_number))/Math.log(AlphabeticID.index.length));i>=0;i--){
            ret = ret + AlphabeticID.index.substr((Math.floor(parseInt(_number) / AlphabeticID.bcpow(AlphabeticID.index.length, i)) % AlphabeticID.index.length),1);
        }

        return ret.reverse();
    },

    /**
     *  @function AlphabeticID.decode
     *  @description Decode a short string and return number
     *  @param string
     *  @return integer
     **/
    decode:function(_string){
        if('undefined' == typeof _string){
            return null;
        }
        else if('string' != typeof _string){
            throw new Error('Wrong parameter type');
        }

        var str = _string.reverse();
        var ret = 0;

        for(var i=0;i<=(str.length - 1);i++){
            ret = ret + AlphabeticID.index.indexOf(str.substr(i,1)) * (AlphabeticID.bcpow(AlphabeticID.index.length, (str.length - 1) - i));
        }

        return ret;
    },

    /**
     *  @function AlphabeticID.bcpow
     *  @description Raise _a to the power _b
     *  @param float _a
     *  @param integer _b
     *  @return string
     **/
    bcpow:function(_a, _b){
        return Math.floor(Math.pow(parseFloat(_a), parseInt(_b)));
    }
};

/**
 *  @function String.reverse
 *  @description Reverse a string
 *  @return string
 **/
String.prototype.reverse = function(){
    return this.split('').reverse().join('');
};
