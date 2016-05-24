(function () {
    'use strict';
    angular.module('underscore', [])
        .factory('_', function () {
            return window._; // assumes underscore has already been loaded on the page
        });

    angular
        .module('IndieWise', [
            'ngMaterial',
            'mm.foundation',
            'angucomplete-alt',
            'ngMessages',
            //'cloudinary',
            'underscore',
            'angularMoment',
            'videosharing-embed',
            'LocalForageModule',
            'parse-angular',
            'ui.router',
            'flow',
            'backand',
            '720kb.socialshare',
            'ngAnimate-animate.css',
            'IndieWise.controllers',
            'IndieWise.services',
            'IndieWise.directives',
            'IndieWise.filters',
            'IndieWise.utilities'
        ])
        .config(['flowFactoryProvider', function (flowFactoryProvider) {
            flowFactoryProvider.defaults = {
                target: 'utils/upload.php',
                permanentErrors: [404, 500, 501],
                maxChunkRetries: 1,
                chunkRetryInterval: 5000,
                simultaneousUploads: 4,
                singleFile: true
            };
            flowFactoryProvider.on('catchAll', function (event) {
                console.log('catchAll', arguments);
            })
        }])
        .config(['$compileProvider', function ($compileProvider) {
            // significant performance boost
            $compileProvider.debugInfoEnabled(false);
        }])
        .constant('angularMomentConfig', {
            timezone: 'UTC' // e.g. 'Europe/London'
        })
        .config(function (BackandProvider) {
            BackandProvider.setAppName('indiewise');
            BackandProvider.setSignUpToken('ed37a6ff-ff08-4d3a-b82c-5f29f9a36c05');
            BackandProvider.setAnonymousToken('6ef61886-faa0-4f42-bf4d-d827339accfe');
            //BackandProvider.runSocket(true); //enable the web sockets that makes the database realtime
        })
        .config(function ($mdThemingProvider, $mdIconProvider) {
            // Emoticons
            $mdIconProvider
                .icon("emotion", "./assets/svg/emotion.svg", 120)
                .icon("angry", "./assets/svg/emoticons/angry.svg", 120)
                .icon("annoyed", "./assets/svg/emoticons/annoyed.svg", 120)
                .icon("big-smile", "./assets/svg/emoticons/big-smile.svg", 120)
                .icon("bored", "./assets/svg/emoticons/bored.svg", 120)
                .icon("confused", "./assets/svg/emoticons/confused.svg", 120)
                .icon("crying", "./assets/svg/emoticons/crying.svg", 120)
                .icon("disappointed", "./assets/svg/emoticons/disappointed.svg", 120)
                .icon("emotional", "./assets/svg/emoticons/emotional.svg", 120)
                .icon("grinning", "./assets/svg/emoticons/grinning.svg", 120)
                .icon("happy", "./assets/svg/emoticons/happy.svg", 120)
                .icon("hehe", "./assets/svg/emoticons/hehe.svg", 120)
                .icon("hopeful", "./assets/svg/emoticons/hopeful.svg", 120)
                .icon("interested", "./assets/svg/emoticons/interested.svg", 120)
                .icon("joking", "./assets/svg/emoticons/joking.svg", 120)
                .icon("kiss", "./assets/svg/emoticons/kiss.svg", 120)
                .icon("love", "./assets/svg/emoticons/love.svg", 120)
                .icon("mad", "./assets/svg/emoticons/mad.svg", 120)
                .icon("meh", "./assets/svg/emoticons/meh.svg", 120)
                .icon("mute", "./assets/svg/emoticons/mute.svg", 120)
                .icon("nerdy", "./assets/svg/emoticons/nerdy.svg", 120)
                .icon("neutral", "./assets/svg/emoticons/neutral.svg", 120)
                .icon("ninja", "./assets/svg/emoticons/ninja.svg", 120)
                .icon("nostalgic", "./assets/svg/emoticons/nostalgic.svg", 120)
                .icon("oh-really", "./assets/svg/emoticons/oh-really.svg", 120)
                .icon("sad", "./assets/svg/emoticons/sad.svg", 120)
                .icon("sad-tear", "./assets/svg/emoticons/sad-tear.svg", 120)
                .icon("sarcastic", "./assets/svg/emoticons/sarcastic.svg", 120)
                .icon("sexy", "./assets/svg/emoticons/sexy.svg", 120)
                .icon("shocked", "./assets/svg/emoticons/shocked.svg", 120)
                .icon("silent", "./assets/svg/emoticons/silent.svg", 120)
                .icon("silly", "./assets/svg/emoticons/silly.svg", 120)
                .icon("smile", "./assets/svg/emoticons/smile.svg", 120)
                .icon("sympathetic", "./assets/svg/emoticons/sympathetic.svg", 120)
                .icon("wink", "./assets/svg/emoticons/wink.svg", 120)
                .icon("woah", "./assets/svg/emoticons/woah.svg", 120);
        })
        .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {

            $stateProvider
                .state('home', {
                    url: '/home',
                    authenticate: false,
                    templateUrl: './src/home/view/index.html',
                    controller: 'HomeCtrl as Home'
                })
                .state('browse', {
                    url: '/browse?q&sort&genres&types',
                    authenticate: false,
                    templateUrl: './src/browse/view/index.html',
                    controller: 'BrowseCtrl as Browse'
                })
                .state('latest', {
                    url: '/latest?q&sort&genres&types',
                    authenticate: false,
                    templateUrl: './src/latest/view/index.html',
                    controller: 'LatestCtrl as LC'
                })
                .state('video', {
                    url: '/{id}',
                    authenticate: false,
                    templateUrl: './src/common/video.html',
                    controller: 'VideoCtrl as VC',
                    resolve: {
                        Project: ['$stateParams', 'DataService', '$q', function ($stateParams, DataService, $q) {
                            var deferred = $q.defer();
                            DataService.getItem('Film', $stateParams.id, true, '', 2).then(function (result) {
                                deferred.resolve(result);
                            });
                            return deferred.promise;
                        }]
                    }
                })
                .state('video-edit', {
                    url: '/{id}/edit',
                    authenticate: true,
                    templateUrl: './src/common/video-edit.html',
                    controller: 'VideoEditCtrl as VEC',
                    resolve: {
                        Project: ['$stateParams', 'DataService', '$q', function ($stateParams, DataService, $q) {
                            var deferred = $q.defer();
                            DataService.getItem('Film', $stateParams.id, true, '', 2).then(function (result) {
                                if (result.data.owner.id === $rootScope.AppData.User.userId) {
                                    deferred.resolve(result);
                                } else {
                                    deferred.reject('Not Owner');
                                }
                            });
                            return deferred.promise;
                        }]
                    }
                })
                .state('video_critique', {
                    url: '/{video_id}/critique/{id}',
                    authenticate: false,
                    templateUrl: './src/common/critique.html',
                    controller: 'VideoCritiqueCtrl as VCC',
                    resolve: {
                        Critique: ['$stateParams', 'DataService', '$q', function ($stateParams, DataService, $q) {
                            var deferred = $q.defer();
                            DataService.getItem('Critique', $stateParams.id, true, '', 2).then(function (result) {
                                deferred.resolve(result);
                            });
                            return deferred.promise;
                        }]
                    }
                })
                .state('video_critique-edit', {
                    url: '/{video_id}/critique/{id}/edit',
                    authenticate: true,
                    templateUrl: './src/common/critique-edit.html',
                    controller: 'VideoCritiqueEditCtrl as VCEC',
                    resolve: {
                        Critique: ['$stateParams', 'DataService', '$q', function ($stateParams, DataService, $q) {
                            var deferred = $q.defer();
                            DataService.getItem('Critique', $stateParams.id, true, '', 2).then(function (result) {
                                if (result.data.author.id === $rootScope.AppData.User.userId) {
                                    deferred.resolve(result);
                                } else {
                                    deferred.reject('Not Owner');
                                }
                            });
                            return deferred.promise;
                        }]
                    }
                })
                .state('advanced-search', {
                    url: '/advanced-search?q',
                    authenticate: false,
                    templateUrl: './src/common/search-results-advanced.html',
                    controller: 'AdvancedResultsCtrl as Results'
                })
                .state('results', {
                    url: '/search?q',
                    authenticate: false,
                    templateUrl: './src/common/search-results.html',
                    controller: 'ResultsCtrl as Results'
                })

                // Authenticated Pages
                .state('user', {
                    url: '/user/{id}',
                    authenticate: true,
                    abstract: true,
                    templateUrl: './src/auth/user.html',
                    controller: 'UserCtrl as UserC',
                    resolve: {
                        User: ['$stateParams', 'DataService', '$q', function ($stateParams, DataService, $q) {
                            var deferred = $q.defer();
                            DataService.getItem('users', $stateParams.id, false, '', 1).then(function (result) {
                                deferred.resolve(result);
                            });
                            return deferred.promise;
                        }]
                    }
                })
                .state('user.about', {
                    url: '/about',
                    templateUrl: './src/auth/user-about.html',
                    controller: 'UserAboutController as UserAboutCtrl'
                })
                .state('user.videos', {
                    url: '/videos',
                    templateUrl: './src/auth/user-videos.html',
                    controller: 'UserVideosController as UserVideosCtrl',
                    resolve: {
                        Videos: ['$stateParams', 'DataService', '$q', function ($stateParams, DataService, $q) {
                            var deferred = $q.defer();
                            DataService.getList('Film', [{fieldName: "createdAt", order: "desc"}],
                                [
                                    {fieldName: "owner", operator: "in", value: $stateParams.id},
                                    {fieldName: "unlist", operator: "is", value: false}
                                ], 20, true, true, 1).then(function (result) {
                                    deferred.resolve(result);
                                });
                            return deferred.promise;
                        }]
                    }
                })
                .state('user.critiques', {
                    url: '/critiques',
                    templateUrl: './src/auth/user-critiques.html',
                    controller: 'UserCritiquesController as UserCritiquesCtrl',
                    resolve: {
                        Critiques: ['$stateParams', 'DataService', '$q', function ($stateParams, DataService, $q) {
                            var deferred = $q.defer();
                            DataService.getList('Critique', [{fieldName: "createdAt", order: "desc"}],
                                [{fieldName: "author", operator: "in", value: $stateParams.id}],
                                20, true, true, 1).then(function (result) {
                                    deferred.resolve(result);
                                });
                            return deferred.promise;
                        }]
                    }
                })
                .state('user.reactions', {
                    url: '/reactions',
                    templateUrl: './src/auth/user-reactions.html',
                    controller: 'UserReactionsController as UserReactionsCtrl',
                    resolve: {
                        Reactions: ['$stateParams', 'DataService', '$q', function ($stateParams, DataService, $q) {
                            var deferred = $q.defer();
                            DataService.getList('Reaction', [{fieldName: "createdAt", order: "desc"}],
                                [{fieldName: "user", operator: "in", value: $stateParams.id}],
                                20, true, true, 1).then(function (result) {
                                    deferred.resolve(result);
                                });
                            return deferred.promise;
                        }],
                        Reacted: ['$stateParams', 'DataService', '$q', function ($stateParams, DataService, $q) {
                            //// Fetch My Reacted
                            //var reactedQuery = new Parse.Query("Reaction");
                            //reactedQuery.notEqualTo('user', self.user);
                            //reactedQuery.include(['parent', 'user']);
                            //reactedQuery.matchesQuery("parent", innerQuery);
                            //reactedQuery.find().then(function (result) {
                            //    self.myReacted = result;
                            //});

                            var deferred = $q.defer();
                            DataService.getList('Reaction', [{fieldName: "createdAt", order: "desc"}],
                                [{fieldName: "user", operator: "in", value: $stateParams.id}],
                                20, true, true, 1).then(function (result) {
                                    deferred.resolve(result);
                                });
                            return deferred.promise;
                        }]
                    }
                })
                .state('user.awards', {
                    url: '/awards',
                    templateUrl: './src/auth/user-awards.html',
                    controller: 'UserAwardsController as UserAwardsCtrl',
                    resolve: {
                        Awards: ['$stateParams', 'DataService', '$q', function ($stateParams, DataService, $q) {
                            var deferred = $q.defer();
                            DataService.getList('AwardWin', [{fieldName: "createdAt", order: "desc"}],
                                [{fieldName: "user", operator: "in", value: $stateParams.id}],
                                20, true, true, 1).then(function (result) {
                                    deferred.resolve(result);
                                });
                            return deferred.promise;
                        }],
                        Nominations: ['$stateParams', 'DataService', '$q', function (AuthService, DataService, $q) {
                            var deferred = $q.defer();
                            DataService.query('getNominations', {userId: $stateParams.id})
                                .then(function (result) {
                                    deferred.resolve(result);
                                });
                            return deferred.promise;
                        }]
                    }
                })
                .state('user_critique', {
                    url: '/user/{user_id}/critique/{id}',
                    authenticate: false,
                    templateUrl: './src/common/critique.html',
                    controller: 'VideoCritiqueCtrl as VCC'
                })
                .state('profile', {
                    url: '/profile',
                    authenticate: true,
                    abstract: true,
                    templateUrl: './src/auth/profile.html',
                    controller: 'ProfileCtrl as Profile',
                    resolve: {
                        User: ['AuthService', '$q', function (AuthService, $q) {
                            var deferred = $q.defer();
                            AuthService.getCurrentUserData().then(function (response) {
                                //console.log(response);
                                deferred.resolve(response);
                            });
                            return deferred.promise;
                        }]
                    }
                })
                .state('profile.about', {
                    url: '/about',
                    authenticate: true,
                    templateUrl: './src/auth/profile-about.html',
                    controller: 'ProfileAboutController as ProfileAboutCtrl'
                })
                .state('profile.upload', {
                    url: '/upload',
                    authenticate: true,
                    templateUrl: './src/auth/profile-upload.html',
                    controller: 'ProfileUploadController as UC'
                })
                .state('profile.videos', {
                    url: '/videos',
                    authenticate: true,
                    templateUrl: './src/auth/profile-videos.html',
                    controller: 'ProfileVideosController as ProfileVideosCtrl',
                    resolve: {
                        Videos: ['AuthService', 'DataService', '$q', function (AuthService, DataService, $q) {
                            var deferred = $q.defer();
                            DataService.getList('Film', [{fieldName: "createdAt", order: "desc"}],
                                [{fieldName: "owner", operator: "in", value: AuthService.currentUser.userId}],
                                20, true, true, 1).then(function (result) {
                                    deferred.resolve(result);
                                });
                            return deferred.promise;
                        }]
                    }
                })
                .state('profile.critiques', {
                    url: '/critiques',
                    authenticate: true,
                    templateUrl: './src/auth/profile-critiques.html',
                    controller: 'ProfileCritiquesController as ProfileCritiquesCtrl',
                    resolve: {
                        Critiques: ['AuthService', 'DataService', '$q', function (AuthService, DataService, $q) {
                            var deferred = $q.defer();
                            DataService.getList('Critique', [{fieldName: "createdAt", order: "desc"}],
                                [{fieldName: "author", operator: "in", value: AuthService.currentUser.userId}],
                                20, true, true, 1).then(function (result) {
                                    deferred.resolve(result);
                                });
                            return deferred.promise;
                        }]
                    }
                })
                .state('profile.critique', {
                    url: '/critiques/{id}',
                    authenticate: true,
                    templateUrl: './src/common/critique.html',
                    controller: 'VideoCritiqueCtrl as VCC'
                })
                .state('profile.reactions', {
                    url: '/reactions',
                    authenticate: true,
                    templateUrl: './src/auth/profile-reactions.html',
                    controller: 'ProfileReactionsController as ProfileReactionsCtrl',
                    resolve: {
                        Reactions: ['AuthService', 'DataService', '$q', function (AuthService, DataService, $q) {
                            var deferred = $q.defer();
                            DataService.getList('Reaction', [{fieldName: "createdAt", order: "desc"}],
                                [{fieldName: "user", operator: "in", value: AuthService.currentUser.userId}],
                                20, true, true, 1).then(function (result) {
                                    deferred.resolve(result);
                                });
                            return deferred.promise;
                        }]
                    }
                })
                .state('profile.awards', {
                    url: '/awards',
                    authenticate: true,
                    templateUrl: './src/auth/profile-awards.html',
                    controller: 'ProfileAwardsController as ProfileAwardsCtrl',
                    resolve: {
                        Awards: ['AuthService', 'DataService', '$q', function (AuthService, DataService, $q) {
                            var deferred = $q.defer();
                            DataService.getList('AwardWin', [{fieldName: "createdAt", order: "desc"}],
                                [{fieldName: "user", operator: "in", value: AuthService.currentUser.userId}],
                                20, true, true, 1).then(function (result) {
                                    deferred.resolve(result);
                                });
                            return deferred.promise;
                        }],
                        Nominations: ['AuthService', 'DataService', '$q', function (AuthService, DataService, $q) {
                            var deferred = $q.defer();
                            DataService.query('getNominations', {userId: AuthService.currentUser.userId})
                                .then(function (result) {
                                    deferred.resolve(result);
                                });
                            return deferred.promise;
                        }]
                    }
                })

                .state('profile.favorites', {
                    url: '/favorites',
                    authenticate: true,
                    templateUrl: './src/auth/profile-favorites.html',
                    controller: 'ProfileFavoritesController as ProfileFavoritesCtrl',
                    resolve: {
                        Favorites: ['AuthService', 'DataService', '$q', function (AuthService, DataService, $q) {
                            var deferred = $q.defer();
                            DataService.getList('Favorites', [{fieldName: "createdAt", order: "desc"}],
                                [{fieldName: "user", operator: "in", value: AuthService.currentUser.userId}],
                                20, true, true, 1).then(function (result) {
                                    deferred.resolve(result);
                                });
                            return deferred.promise;
                        }]
                    }
                })
                .state('profile.settings', {
                    url: '/settings',
                    authenticate: true,
                    templateUrl: './src/auth/profile-settings.html',
                    controller: 'ProfileSettingsController as ProfileSettingsCtrl',
                    resolve: {}
                })
                .state('profile_critique-edit', {
                    url: '/profile/{profile_id}/critique/{id}/edit',
                    authenticate: true,
                    templateUrl: './src/common/critique-edit.html',
                    controller: 'VideoCritiqueEditCtrl as VCEC',
                    resolve: {
                        Critique: ['$stateParams', '$q', function ($stateParams, $q) {
                            var deferred = $q.defer();
                            var critiqueQuery = new Parse.Query("Critique");
                            critiqueQuery.include(["author", "parent.owner"]);
                            critiqueQuery.get($stateParams.id).then(function (result) {
                                if (result.author.id === $rootScope.AppData.User.userId) {
                                    deferred.resolve(result);
                                } else {
                                    deferred.reject('Not Owner');
                                }
                            });
                            return deferred.promise;
                        }]
                    }
                })
                .state('profile_edit', {
                    url: '/profile/edit',
                    authenticate: true,
                    templateUrl: './src/auth/profile-edit.html',
                    controller: 'EditProfileCtrl as Edit'
                })
                .state('messages', {
                    url: '/messages/{id}',
                    authenticate: true,
                    templateUrl: './src/auth/messages.html',
                    controller: 'MessagesCtrl as Msgs'
                })
                .state('notifications', {
                    url: '/notifications',
                    authenticate: true,
                    templateUrl: './src/auth/notifications.html',
                    controller: 'NotificationsCtrl as NC'
                })

                // Auth Pages
                .state('register', {
                    url: '/register',
                    authenticate: false,
                    templateUrl: './src/auth/register.html',
                    controller: 'RegisterCtrl as RC'
                })
                .state('sign_in', {
                    url: '/sign-in',
                    authenticate: false,
                    templateUrl: './src/auth/sign-in.html',
                    controller: 'SignInCtrl as SIC'
                })
                .state('reset_password', {
                    url: '/reset-password',
                    authenticate: false,
                    templateUrl: './src/auth/reset-password.html',
                    controller: 'ForgotPasswordCtrl as FPC'
                })

                // Static Pages
                .state('about', {
                    url: '/about',
                    authenticate: false,
                    templateUrl: './src/static/about.html',
                })
                .state('contact', {
                    url: '/contact',
                    authenticate: false,
                    templateUrl: './src/static/contact.html',
                })
                .state('tos', {
                    url: '/terms-of-service',
                    authenticate: false,
                    templateUrl: './src/static/tos.html',
                })
                .state('advertise', {
                    url: '/advertise',
                    authenticate: false,
                    templateUrl: './src/static/advertise.html',
                })
                .state('privacy', {
                    url: '/privacy-policy',
                    authenticate: false,
                    templateUrl: './src/static/privacy.html',
                })
                .state('404', {
                    url: '/404',
                    authenticate: false,
                    templateUrl: './src/static/404.html',
                })
            ;

            $urlRouterProvider.otherwise('/home');

            $locationProvider.html5Mode(true);

        }])
        .constant('Config', {
            streamApiKey: 'pftnxtwf4yuz',
            streamApiSecret: 'k563yw7srhjeubw6xbx26def8xta47ume75uqaaewh6k4qyzj4mr3cfcmbts6cf3',
            streamApp: '6408'
        })
        .run(['ParseSDK', '$rootScope', '$state', '$stateParams', 'AuthService', 'UtilsService', 'Config', '$http', '$timeout', 'DataService', function (ParseSDK, $rootScope, $state, $stateParams, AuthService, UtilsService, Config, $http, $timeout, DataService) {
            $rootScope.$state = window.thisState = $state;
            $rootScope.metadata = {
                title: '',
                description: '',
                image: '',
                url: ''
            };
            $rootScope.$stateParams = $stateParams;
            $rootScope.isViewLoading = false;
            $rootScope.AppData = {
                User: AuthService.currentUser,
                UserData: AuthService.currentUser ? AuthService.getCurrentUserData() : null,
                //Favorites: DataService.query(),
                //WatchLaters:,
                Notifications: {
                    loaded: 'indeterminate',
                },
                NotificationsFeed: {
                    loaded: 'indeterminate',
                },
                MessageNotifications: {
                    loaded: 'indeterminate',
                },
                searchText: ''
            };
            $rootScope.today = moment().toDate();
            // initialize stream
            window.StreamClient = stream.connect(Config.streamApiKey, null, Config.streamApp, {location: 'us-east'});

            $rootScope.getNewToken = function (type, id) {
                return $http.get('utils/token.php?type=' + type + '&id=' + id).then(function (res) {
                    return res.data;
                });
            };

            $rootScope.subscribeUserFeeds = function () {
                // Notifications Feed
                $rootScope.getNewToken('notification', $rootScope.AppData.User.userId).then(function (token) {
                    var feed = window.StreamClient.feed('notification', $rootScope.AppData.User.userId, token);
                    feed.subscribe(function (obj) {
                        console.log('Notification: ', obj);
                        $rootScope.getNotificationsFeed(feed);
                    }).then(function () {
                        $rootScope.getNotificationsFeed(feed);
                    });
                });
                // Messages Feed
                $rootScope.getNewToken('message', $rootScope.AppData.User.userId).then(function (token) {
                    var feed = window.StreamClient.feed('message', $rootScope.AppData.User.userId, token);
                    feed.subscribe(function (obj) {
                        console.log('Messages: ', obj);
                        $rootScope.getMessagesFeed(feed);
                    }).then(function () {
                        $rootScope.getMessagesFeed(feed);
                    });
                });
            };

            $rootScope.refreshNotificationsFeed = function () {
                $rootScope.AppData.RawNotifications.loaded = $rootScope.AppData.Notifications.loaded = 'indeterminate';
                $rootScope.getNewToken('notification', $rootScope.AppData.User.userId).then(function (token) {
                    var feed = window.StreamClient.feed('notification', $rootScope.AppData.User.userId, token);
                    $rootScope.getNotificationsFeed(feed);
                });
            };

            $rootScope.getNotificationsFeed = function (feed) {
                feed.get({limit: 10}, function (error, response, body) {
                    console.log('Raw Notifications: ', body);
                    try {
                        var data = UtilsService.enrichRawNotifications(body.results);
                        $rootScope.AppData.RawNotifications = {
                            loaded: '',
                            list: data.data,
                            unseen: body.unseen,
                            unread: body.unread
                        };
                    } catch (e) {
                        console.log(e);
                    }
                });
            };

            $rootScope.getMessagesFeed = function (feed) {
                feed.get({limit: 10}, function (error, response, body) {
                    console.log('Messages Notifications: ', body);
                    try {
                        //var data = UtilsService.enrichRawNotifications(body.results);
                        //console.log(data);
                        $rootScope.AppData.MessageNotifications = {
                            loaded: '',
                            list: body.results,
                            unseen: body.unseen,
                            unread: body.unread
                        };
                    } catch (e) {
                        console.log(e);
                    }
                });
            };

            $rootScope.getFlatNotificationsFeed = function () {
                Parse.Cloud.run("feed", {feed: "flat_notifications:" + $rootScope.AppData.User.userId, limit: 10}, {
                    success: function (data) {
                        try {
                            var dataObj = UtilsService.enrichNotifications(data);
                            console.log(dataObj);
                            $rootScope.AppData.NotificationsFeed = {
                                loaded: '',
                                list: dataObj.data.activities,
                                unseen: dataObj.unseen,
                                unread: dataObj.unread
                            };
                        } catch (e) {
                            console.log(e);
                            $timeout(function () {
                                $rootScope.getFlatNotificationsFeed(feed);
                            }, 3000);
                        }
                    },
                    error: function (error) {

                    }
                });
            };

            $rootScope.$watch('AppData.User', function (newValue, oldValue) {
                if (newValue && angular.isString(newValue.id)) {
                    console.log('User Logged In');
                    $rootScope.subscribeUserFeeds();
                }
            });

            // loading animation
            $rootScope.setLoading = function () {
                $rootScope.isViewLoading = true;
            };
            $rootScope.unsetLoading = function () {
                $rootScope.isViewLoading = false;
            };

            $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {
                if (AuthService.currentUser) {
                    console.log(from);
                    console.log(to);
                    if (_.contains(['sign_in', 'register'], to.name)) {
                        $timeout(function () {
                            $state.go('home');
                        }, 0);

                    }
                } else {
                    if (to.authenticate) {
                        $rootScope.returnToState = to.url;
                        $rootScope.returnToStateParams = toParams.Id;
                        $timeout(function () {
                            $state.go('sign_in');
                        }, 0);
                    }
                }
                $rootScope.setLoading();
            });

            $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
                $rootScope.unsetLoading();
                jQuery(document).foundation();
            });

            $rootScope.$on('$stateChangeError', function (ev, to, toParams, from, fromParams, err) {
                console.log(err);
            });
        }])
        .value('ParseConfig', {
            applicationId: "KkQqsTBaxOWqkoWjrPjz1CyL1iKmPRikVVG1Hwem",
            javascriptKey: "nw73aGJuOatZrYSNMQpmmFILwOZVA0mTnp4BYbSL"
        })
        .config(['$localForageProvider', function ($localForageProvider) {
            $localForageProvider.config({
                //driver      : 'localStorageWrapper', // if you want to force a driver
                name: 'iw', // name of the database and prefix for your data, it is "lf" by default
                version: 1.0, // version of the database, you shouldn't have to use this
                storeName: 'keyvaluepairs', // name of the table
                description: 'some description'
            });
        }])
        .config(['$sceDelegateProvider', function ($sceDelegateProvider) {
            $sceDelegateProvider.resourceUrlWhitelist([
                'self',
                'http://getindiewise.com/**',
                'http://www.getindiewise.com/**',
                'https://api.backand.com/**',
                new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$')
            ]);
        }]);
})
();
