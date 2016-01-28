(function () {
    'use strict';
    angular.module('underscore', [])
        .factory('_', function () {
            return window._; // assumes underscore has already been loaded on the page
        });

    angular
        .module('IndieWise', [
            'ngMaterial',
            'ngMessages',
            'underscore',
            'angularMoment',
            'satellizer',
            'videosharing-embed',
            'LocalForageModule',
            'parse-angular',
            'ui.router',
            'flow',
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
        .config(function ($mdThemingProvider, $mdIconProvider) {

            $mdIconProvider
                .defaultIconSet("./assets/svg/avatars.svg", 128)
                .icon("home", "./assets/svg/home.svg", 24)
                .icon("avatar1", "./assets/svg/avatar-1.svg", 24)
                .icon("style", "./assets/svg/style.svg", 24)
                .icon("video_library", "./assets/svg/video_library.svg", 24)
                .icon("arrow_back", "./assets/svg/arrow_back.svg", 24)
                .icon("chevron-right", "./assets/svg/chevron-right.svg", 24)
                .icon("view_module", "./assets/svg/view_module.svg", 24)
                .icon("invisibility", "./assets/svg/invisibility.svg", 24)
                .icon("visibility", "./assets/svg/visibility.svg", 24)
                .icon("more_horiz", "./assets/svg/more_horiz.svg", 24)
                .icon("more_vert", "./assets/svg/dots-vertical.svg", 24)
                .icon("more_vert_white", "./assets/svg/more_vert_white.svg", 24)
                .icon("mode_edit", "./assets/svg/mode_edit.svg", 24)
                .icon("add_circle", "./assets/svg/add_circle.svg", 24)
                .icon("eye", "./assets/svg/eye.svg", 24)
                .icon("thumb_up", "./assets/svg/thumb_up.svg", 24)
                .icon("two_thumbs_up", "./assets/svg/two_thumbs_up.svg", 24)
                .icon("thumb_down", "./assets/svg/thumb_down.svg", 24)
                .icon("two_thumbs_down", "./assets/svg/two_thumbs_down.svg", 24)
                .icon("close", "./assets/svg/close.svg", 24)
                .icon("settings", "./assets/svg/settings.svg", 24)
                .icon("grade", "./assets/svg/grade.svg", 24)
                .icon("trophy", "./assets/svg/trophy.svg", 24)
                .icon("stars", "./assets/svg/stars.svg", 24)
                .icon("email", "./assets/svg/email.svg", 24)
                .icon("security", "./assets/svg/security.svg", 24)
                .icon("comment", "./assets/svg/comment.svg", 24)
                .icon("menu", "./assets/svg/menu.svg", 24)
                .icon("message-outline", "./assets/svg/message-outline.svg", 24)
                .icon("message-processing", "./assets/svg/message-processing.svg", 24)
                .icon("message-text", "./assets/svg/message-text.svg", 24)
                .icon("notifications", "./assets/svg/notifications.svg", 24)
                .icon("notifications_active", "./assets/svg/notifications_active.svg", 24)
                .icon("notifications_off", "./assets/svg/notifications_off.svg", 24)
                .icon("notifications_none", "./assets/svg/notifications_none.svg", 24)
                .icon("filter", "./assets/svg/filter_list.svg", 24)
                .icon("favorite", "./assets/svg/favorite.svg", 24)
                .icon("access_time", "./assets/svg/access_time.svg", 24)
                .icon("share", "./assets/svg/share.svg", 24)
                .icon("google_plus", "./assets/svg/google_plus.svg", 512)
                .icon("hangouts", "./assets/svg/hangouts.svg", 512)
                .icon("twitter", "./assets/svg/twitter.svg", 512)
                .icon("phone", "./assets/svg/phone.svg", 512)
                .icon("file_upload", "./assets/svg/file_upload.svg", 24)
                .icon("help_circle", "./assets/svg/help_circle.svg", 24)
                .icon("watch_later", "./assets/svg/watch_later.svg", 24)
                .icon("refresh", "./assets/svg/refresh.svg", 24)

                // Emoticons
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
                .icon("woah", "./assets/svg/emoticons/woah.svg", 120)

                // Social
                .icon("facebook", "./assets/svg/social/facebook.svg", 24)
                .icon("google-plus", "./assets/svg/social/google-plus.svg", 24)
                .icon("twitter", "./assets/svg/social/twitter.svg", 24)
                .icon("reddit", "./assets/svg/social/reddit.svg", 24)
                .icon("vimeo", "./assets/svg/social/vimeo.svg", 24)
                .icon("youtube", "./assets/svg/social/youtube-play.svg", 24)
                .icon("instagram", "./assets/svg/social/instagram.svg", 24)
                .icon("pinterest", "./assets/svg/social/pinterest.svg", 24)

            $mdThemingProvider.theme('default')
                .primaryPalette('indigo')
                .accentPalette('orange');

        })

        // hack to disable auto scrolling on hashchange because we're using ui-router to manage states, instead of the core angular router which cannot handle states
        // discussion on this here: https://github.com/angular-ui/ui-router/issues/110
        .value('$anchorScroll', angular.noop)

        .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {

            $stateProvider
                .state('home', {
                    url: '/home',
                    authenticate: false,
                    templateUrl: './src/home/view/index.html',
                    controller: 'HomeCtrl as Home'
                })
                .state('video', {
                    url: '/screen/{id}',
                    authenticate: false,
                    templateUrl: './src/common/video.html',
                    controller: 'VideoCtrl as VC',
                    resolve: {
                        Project: ['$stateParams', '$q', function ($stateParams, $q) {
                            var deferred = $q.defer();
                            var filmQuery = new Parse.Query("Film");
                            filmQuery.include(["owner", "type", "filmingCountry", "language"]);
                            //filmQuery.notEqualTo("disableProject", true);
                            //filmQuery.notEqualTo("unlist", true);
                            filmQuery.get($stateParams.id).then(function (result) {
                                deferred.resolve(result);
                            });
                            return deferred.promise;
                        }]
                    }
                })
                .state('video-edit', {
                    url: '/screen/{id}/edit',
                    authenticate: true,
                    templateUrl: './src/common/video-edit.html',
                    controller: 'VideoEditCtrl as VEC',
                    resolve: {
                        Project: ['$stateParams', '$q', function ($stateParams, $q) {
                            var deferred = $q.defer();
                            var filmQuery = new Parse.Query("Film");
                            filmQuery.include(["owner", "type"]);
                            filmQuery.get($stateParams.id).then(function (result) {
                                if (result.attributes.owner.id === Parse.User.current().id) {
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
                    url: '/screen/{video_id}/critique/{id}',
                    authenticate: false,
                    templateUrl: './src/common/critique.html',
                    controller: 'VideoCritiqueCtrl as VCC'
                })
                .state('video_critique-edit', {
                    url: '/screen/{video_id}/critique/{id}/edit',
                    authenticate: true,
                    templateUrl: './src/common/critique-edit.html',
                    controller: 'VideoCritiqueEditCtrl as VCEC',
                    resolve: {
                        Critique: ['$stateParams', '$q', function ($stateParams, $q) {
                            var deferred = $q.defer();
                            var critiqueQuery = new Parse.Query("Critique");
                            critiqueQuery.include(["author", "parent.owner"]);
                            critiqueQuery.get($stateParams.id).then(function (result) {
                                if (result.attributes.author.id === Parse.User.current().id) {
                                    deferred.resolve(result);
                                } else {
                                    deferred.reject('Not Owner');
                                }
                            });
                            return deferred.promise;
                        }]
                    }
                })
                .state('browse', {
                    url: '/browse?q&sort&genres&types',
                    authenticate: false,
                    templateUrl: './src/browse/view/index.html',
                    controller: 'BrowseCtrl as Browse'
                })
                .state('results', {
                    url: '/results?q',
                    authenticate: false,
                    templateUrl: './src/common/search-results.html',
                    controller: 'ResultsCtrl as Results'
                })

                // Authenticated Pages
                .state('upload', {
                    url: '/upload',
                    authenticate: true,
                    templateUrl: './src/auth/upload.html',
                    controller: 'UploadCtrl as UC'
                })
                .state('user', {
                    url: '/user/{id}',
                    authenticate: true,
                    templateUrl: './src/auth/user.html',
                    controller: 'UserCtrl as UserC'
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
                    templateUrl: './src/auth/profile.html',
                    controller: 'ProfileCtrl as Profile'
                })
                .state('profile_critique', {
                    url: '/profile/{profile_id}/critique/{id}',
                    authenticate: false,
                    templateUrl: './src/common/critique.html',
                    controller: 'VideoCritiqueCtrl as VCC'
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
                                if (result.attributes.author.id === Parse.User.current().id) {
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
                .state('feedback', {
                    url: '/feedback',
                    authenticate: false,
                    templateUrl: './src/static/feedback.html',
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
            ;

            $urlRouterProvider.otherwise('/home');

            $locationProvider.html5Mode(true);

        }])
        .config(['$authProvider', function ($authProvider) {
            $authProvider.google({
                clientId: '322274582930-4m1dueb708gvdic28n12e5dhqq121a6b.apps.googleusercontent.com',
                url: 'alpha/auth/google.php',
                redirectUri: window.location.origin,
            });
            $authProvider.twitter({
                clientId: 'nnSvvHd86gBpxPwJaLGvzM2Mm',
                url: 'alpha/auth/twitter.php',
                authorizationEndpoint: 'https://api.twitter.com/oauth/authorize',
                redirectUri: window.location.origin,
                type: '1.0',
                popupOptions: {width: 495, height: 645}
            });
            $authProvider.instagram({
                clientId: '7b1d007ff12644d6a9804af4f0a2e18c',
                name: 'instagram',
                url: 'alpha/auth/instagram.php',
                authorizationEndpoint: 'https://api.instagram.com/oauth/authorize',
                redirectUri: window.location.origin,
                requiredUrlParams: ['scope'],
                scope: ['basic'],
                scopeDelimiter: '+',
                //responseType: 'token',
                type: '2.0'
            });
        }])
        .constant('Config', {
            streamApiKey: 'pftnxtwf4yuz',
            streamApiSecret: 'k563yw7srhjeubw6xbx26def8xta47ume75uqaaewh6k4qyzj4mr3cfcmbts6cf3',
            streamApp: '6408'
        })
        .run(['ParseSDK', '$rootScope', '$state', '$stateParams', 'AuthService', 'UtilsService', 'Config', '$http', '$timeout', '$window', function (ParseSDK, $rootScope, $state, $stateParams, AuthService, UtilsService, Config, $http, $timeout, $window) {
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
                User: Parse.User.current(),
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

            // setup our models
            window.Activity = Parse.Object.extend("Activity");
            window.Follow = Activity.extend("Follow");
            window.Tweet = Activity.extend("Tweet");
            window.Picture = Activity.extend("Picture");
            window.Like = Activity.extend("Like");

            // initialize stream
            window.StreamClient = stream.connect(Config.streamApiKey, null, Config.streamApp, {location: 'us-east'});

            $rootScope.getNewToken = function (type, id) {
                return $http.get('utils/token.php?type=' + type + '&id=' + id).then(function (res) {
                    return res.data;
                });
            };

            $rootScope.subscribeUserFeeds = function () {
                // Notifications Feed
                $rootScope.getNewToken('notification', $rootScope.AppData.User.id).then(function (token) {
                    var feed = window.StreamClient.feed('notification', $rootScope.AppData.User.id, token);
                    feed.subscribe(function (obj) {
                        console.log('Notification: ', obj);
                        $rootScope.getNotificationsFeed(feed);
                    }).then(function () {
                        $rootScope.getNotificationsFeed(feed);
                    });
                });
                // Messages Feed
                $rootScope.getNewToken('message', $rootScope.AppData.User.id).then(function (token) {
                    var feed = window.StreamClient.feed('message', $rootScope.AppData.User.id, token);
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
                $rootScope.getNewToken('notification', $rootScope.AppData.User.id).then(function (token) {
                    var feed = window.StreamClient.feed('notification', $rootScope.AppData.User.id, token);
                    $rootScope.getNotificationsFeed(feed);
                });
            };

            $rootScope.getNotificationsFeed = function (feed) {
                feed.get({limit: 10}, function (error, response, body) {
                    console.log('Raw Notifications: ', body);
                    try {
                        var data = UtilsService.enrichRawNotifications(body.results);
                        console.log(data);
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
                    console.log('Messages: ', body);
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
                Parse.Cloud.run("feed", {feed: "flat_notifications:" + $rootScope.AppData.User.id, limit: 10}, {
                    success: function (data) {
                        try {
                            var dataObj = UtilsService.enrichNotifications(data);
                            console.log(dataObj);
                            $rootScope.AppData.NotificationsFeed =  {
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
                AuthService.currentUser()
                    .then(function (res) {
                        console.log(from);
                        console.log(to);
                        if (_.contains(['sign_in', 'register'], to.name)) {
                            $state.go('home');
                        }
                        //if (_.contains(['sign_in', 'register'], from.name) && !$rootScope.isViewLoading) {
                        //if (!to.authenticate) {
                        //$state.go('home');
                        //}
                        //}
                    }, function (err) {
                        if (to.authenticate) {
                            //debugger;
                            $rootScope.returnToState = to.url;
                            $rootScope.returnToStateParams = toParams.Id;
                            $state.go('sign_in');
                        }
                    }).finally(function (user) {
                        //var loggedIn = !!(angular.isObject(user) && angular.isString(user.id));
                        $rootScope.setLoading();
                    });
            });

            $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
                $rootScope.unsetLoading();
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
                new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$')
            ]);
        }]);
})();
