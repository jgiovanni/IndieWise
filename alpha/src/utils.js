/**
 * Utility Functions
 * Created by Jerez on 11/8/2015.
 */
angular.module('IndieWise.utilities', [])
.factory('UtilsService',  ['$rootScope', '$window', 'DataService', function ($rootScope, $window, DataService) {
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
                console.log('Activity Object: ', object);
                console.log('Activity Verb: ', verb);
                switch (verb) {
                    case 'comment':
                    case 'reply':
                        DataService.save('Action', {
                            actor: angular.isString(object.author) ? object.author : object.author.id,
                            verb: verb,
                            comment: object.id,
                            critique: object.parentCritique.id || object.parentCritique,
                            userIds: verb === 'reply' ? [object.parentCritique.author, object.author.id].toString() : object.parentCritique.author
                        });

                        break;
                    case 'react':
                        DataService.save('Action', {
                            actor: object.user.id,
                            verb: verb,
                            reaction: object.id,
                            project: object.project.id,
                            userIds: object.projectOwner
                        });

                        break;
                    case 'like':
                    case 'unlike':
                        DataService.save('Action', {
                            actor: object.author,
                            verb: verb,
                            rating: object.id,
                            project: object.project,
                            userIds: object.projectOwner
                        });

                        break;
                    case 'watch':
                        DataService.save('Action', {
                            actor: $rootScope.AppData.User ? $rootScope.AppData.User.userId : null,
                            verb: verb,
                            project: object.id,
                            userIds: angular.isString(object.owner) ? object.owner : object.owner.id
                        });

                        break;
                    case 'judge':
                        DataService.save('Action', {
                            actor: $rootScope.AppData.User.userId,
                            verb: verb,
                            critique: object.id,
                            project: object.projectId,
                            userIds: object.projectOwner
                        });
                        break;
                    case 'nominate':
                        DataService.save('Action', {
                            actor: $rootScope.AppData.User.userId,
                            verb: verb,
                            critique: object.critique.id,
                            project: object.project.id,
                            nomination: object.id,
                            userIds: object.critique.projectOwner
                        });
                        break;
                    case 'message':
                        //debugger;
                        /*DataService.save('Action', {
                            actor: $rootScope.AppData.User.userId,
                            verb: verb,
                            critique: object.critique.id,
                            project: object.project.id,
                            nomination: object.id,
                            userIds: object.critique.projectOwner
                        });*/
                        break;
                }
            },
            updateActivity: function (object, verb) {
                console.log('Activity Object: ', object);
                console.log('Activity Verb: ', verb);
                switch (verb) {
                    case 'like':
                    case 'unlike':
                        /*DataService.query('findActivity', {
                            actor: $rootScope.AppData.User.userId,
                            verb: verb,
                            project: angular.isObject(object.project) ? object.project.id : object.project
                        }).then(function(result) {
                            console.log(result.data[0]);
                            debugger;
                        });*/
                        break;
                }
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
                        ___.each(res, function (a) {
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
 *  @function String.reverse
 *  @description Reverse a string
 *  @return string
 **/
String.prototype.reverse = function(){
    return this.split('').reverse().join('');
};
