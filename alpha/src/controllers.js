(function () {
    'use strict';

    function mysql_real_escape_string(str) {
        return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
            switch (char) {
                case "\0":
                    return "\\0";
                case "\x08":
                    return "\\b";
                case "\x09":
                    return "\\t";
                case "\x1a":
                    return "\\z";
                case "\n":
                    return "\\n";
                case "\r":
                    return "\\r";
                case "\"":
                case "'":
                case "\\":
                case "%":
                    return "\\" + char; // prepends a backslash to backslash, percent,
                                        // and double/single quotes
            }
        });
    }

    angular.module('IndieWise.controllers', [])
        // Auth Controllers
        .controller('SignInCtrl', SignInCtrl)
        .controller('ForgotPasswordCtrl', ForgotPasswordCtrl)
        .controller('RegisterCtrl', RegisterCtrl)

        // Profile Controllers
        .controller('ProfileCtrl', ProfileCtrl)
        .controller('ProfileAboutController', UserAboutController)
        .controller('ProfilePlaylistsController', ProfilePlaylistsController)
        .controller('ProfileVideosController', UserVideosController)
        .controller('ProfileVideoEditCtrl', ProfileVideoEditCtrl)
        .controller('ProfileCritiquesController', UserCritiquesController)
        .controller('ProfileReactionsController', UserReactionsController)
        .controller('ProfileAwardsController', UserAwardsController)
        .controller('ProfileSettingsController', ProfileSettingsController)
        .controller('ProfileUploadController', ProfileUploadController)

        // User Controllers
        .controller('UserCtrl', UserCtrl)
        .controller('UserAboutController', UserAboutController)
        .controller('UserVideosController', UserVideosController)
        .controller('UserCritiquesController', UserCritiquesController)
        .controller('UserReactionsController', UserReactionsController)
        .controller('UserAwardsController', UserAwardsController)
        // .controller('EditProfileCtrl', EditProfileCtrl)
        .controller('MessagesCtrl', MessagesCtrl)
        .controller('NotificationsCtrl', NotificationsCtrl)

        // Other App Controllers
        .controller('BodyCtrl', BodyCtrl)
        .controller('HomeCtrl', HomeCtrl)
        .controller('BrowseCtrl', BrowseCtrl)
        .controller('LatestCtrl', LatestCtrl)
        .controller('AdvancedResultsCtrl', AdvancedResultsCtrl)
        .controller('ResultsCtrl', ResultsCtrl)
        .controller('VideoCtrl', VideoCtrl)
        .controller('VideoCritiqueCtrl', VideoCritiqueCtrl)
        .controller('VideoCritiqueEditCtrl', VideoCritiqueEditCtrl)
    ;

    RegisterCtrl.$inject = ['$rootScope', '$timeout', '$q', '$state', 'AuthService', 'DataService', 'anchorSmoothScroll', '_'];
    function RegisterCtrl($rootScope, $timeout, $q, $state, AuthService, DataService, anchorSmoothScroll, _) {
        $rootScope.metadata.title = 'Register';
        var self = this;
        self.accountCreated = false;
        self.genresArr = [];
        self.typesArr = [];
        self.user = {
            email: '',
            password: '',
            passwordCheck: '',
            firstName: '',
            lastName: '',
            gender: '',
            // genres: [],
            // types: []
            //selected_genres: ''
        };

        self.dobDay = '';
        self.dobMonth = '';
        self.dobYear = '';

        self.errors = {
            email: false,
            gender: false,
            genres: false,
            types: false
        };

        self.thisYear = moment().year();
        self.yearsList = [];
        for (var i = self.thisYear; i > (self.thisYear - 100); i--) {
            self.yearsList.push(i);
        }

        /*$rootScope.generateGenres().then(function (res) {
            $rootScope.genresList = self.genresList = res;
        });
        $rootScope.generateTypes().then(function (res) {
            $rootScope.typesList = self.typesList = res;
        });*/
        $rootScope.generateCountries().then(function (res) {
            $rootScope.countryList = self.countryList = res;
        });

        self.checkEmailUse = function () {
            if (angular.isString(self.user.email) && self.user.email.length) {
                DataService.query('checkEmailUse', {email: mysql_real_escape_string(self.user.email)}).then(function (res) {
                    self.errors.email = res.data.length && res.data[0].verify === 1 ? 1 : 0;
                });
            } else self.errors.email = false;
        };

        self.doRegister = function () {
            self.errors.gender = !self.user.gender;

            /*if (angular.isArray(self.genresArr) && self.genresArr.length) {
                _.each(self.genresArr, function (a) {
                    self.user.genres.push(a);
                });
                self.user.genres = _.uniq(self.user.genres);
                self.errors.genres = false;
            } else {
                self.errors.genres = true;
            }

            if (angular.isArray(self.typesArr) && self.typesArr.length) {
                _.each(self.typesArr, function (a) {
                    self.user.types.push(a);
                });
                self.user.types = _.uniq(self.user.types);
                self.errors.types = false;
            } else {
                self.errors.types = true;
            }*/
            if (self.errors.gender) {
                anchorSmoothScroll.scrollTo('errors');
                return false;
            }

            self.user.dob = moment().set({'year': self.dobYear, 'month': self.dobMonth, 'day': self.dobDay }).format('YYYY-MM-DD');
            AuthService.createUser(self.user)
                .then(function (res) {
                    // console.log('Success', res);
                    //window.location.reload();
                    // self.accountCreated = true;
                }, function (res) {
                    self.error = res.message;
                    // console.log('Failed', res);
                }).then(function () {
                    // window.location.reload();
                })
        };

        self.authenticate = function (provider) {
            self.error = null;
            AuthService.socialLogin(provider, true).then(function (a) {
                $state.go('profile.about', {reload: true});
                // console.log(a);
            });
        };

        /*self.syncGenres = function (bool, item) {
            if (bool) {
                // add item
                self.genresArr.push(item);
            } else {
                // remove item
                for (var i = 0; i < self.genresArr.length; i++) {
                    if (self.genresArr[i].id == item.id) {
                        self.genresArr.splice(i, 1);
                    }
                }
            }
        };

        self.isCheckedGenre = function (id) {
            var match = false;
            for (var i = 0; i < self.genresArr.length; i++) {
                if (self.genresArr[i].id == id) {
                    match = true;
                }
            }
            return match;
        };

        self.syncTypes = function (bool, item) {
            if (bool) {
                // add item
                self.typesArr.push(item);
            } else {
                // remove item
                for (var i = 0; i < self.typesArr.length; i++) {
                    if (self.typesArr[i].id == item.id) {
                        self.typesArr.splice(i, 1);
                    }
                }
            }
        };

        self.isCheckedType = function (id) {
            var match = false;
            for (var i = 0; i < self.typesArr.length; i++) {
                if (self.typesArr[i].id == id) {
                    match = true;
                }
            }
            return match;
        };*/

        $timeout(function () {
            jQuery(document).foundation();
            $timeout(function () {
                jQuery(document).foundation();
            }, 500);
        }, 500);
    }

    SignInCtrl.$inject = ['$rootScope', '$timeout', '$q', '$state', 'AuthService', '$modal', 'Backand'];
    function SignInCtrl($rootScope, $timeout, $q, $state, AuthService, $modal, Backand) {
        $rootScope.metadata.title = 'Sign In';
        var self = this;
        self.providers = Backand.getSocialProviders();
        //// console.log(self.providers);
        self.user = {
            email: '',
            password: ''
        };

        self.doLogin = function (redirect) {
            redirect = redirect || true;
            self.error = false;
            AuthService.login(self.user.email, self.user.password).then(function (res) {
                // console.log('Success', res);
                if ($rootScope.$stateParams.verified) {
                    $state.go('profile.about');
                    return true;
                }
                if (redirect && angular.isDefined(res)) {
                    $state.go('home');
                }
            }, function (res) {
                self.error = res;
                // console.log('Failed', res);
            }).then(function () {
            });
        };

        self.authenticate = function (provider) {
            self.error = null;
            AuthService.socialLogin(provider, false).then(function (a) {
                // console.log(a);
            });
        };

        $timeout(function () {
            jQuery(document).foundation();
            $timeout(function () {
                jQuery(document).foundation();
            }, 500);
        }, 500);
    }

    ForgotPasswordCtrl.$inject = ['$rootScope', '$state', 'AuthService'];
    function ForgotPasswordCtrl($rootScope, $state, AuthService) {
        $rootScope.metadata.title = 'Password Recovery';

        var self = this;
        self.email = '';
        self.reseting = {
            newPassword: null,
            newPasswordCheck: null
        };
        self.hasToken = $rootScope.$stateParams.token||false;

        self.doPasswordResetRequest = function () {
            AuthService.requestPasswordReset(self.email).then(function (res) {
                // console.log(res);
                $rootScope.toastMessage('Check your inbox for our email! Should be there soon.');
                //$state.go('sign_in');
            }, function (error) {
                $rootScope.toastMessage('Error: ' + error.message);
            });
        };

        self.confirmReset = function () {
            if (self.reseting.newPassword === self.reseting.newPasswordCheck && angular.isString(self.hasToken)) {
                AuthService.passwordReset(self.reseting.newPassword, self.hasToken)
                    .then(function (res) {

                    })
            } else return false;
        };

        if (self.hasToken) {

        }
    }

    BodyCtrl.$inject = ['$rootScope', '$localForage', '$q', '$state', 'AuthService', '$mdToast', 'UserActions', '$sce', 'DataService', '_', '$interval'];
    function BodyCtrl($rootScope, $localForage, $q, $state, AuthService, $mdToast, UserActions, $sce, DataService, _, $interval) {
        var self = this;

        self.selected = null;
        $rootScope.AppData.searchText = decodeURIComponent($rootScope.$stateParams.q || '');
        self.selectedItem = '';

        self.notificationsTemplate = $sce.trustAsResourceUrl('src/directives/notification.html');
        self.newsletterRegister = newsletterRegister;


        // Recent Videos Footer Section
        DataService.query('getProjectsBy', {order: "createdAt"}).then(function (result) {
            self.footerRecentVideos = result;
        });

        self.startSearch = function (text) {
            if (text) {
                self.toPage('browse', {q: text});
            }
        };

        $rootScope.generateGenres = function () {
            var deferred = $q.defer();
            // $localForage.removeItem('genres');
            $localForage.getItem('genres', true).then(function (data) {
                if( !_.isNull(data) ) {
                    deferred.resolve(data);
                } else {
                    DataService.collection('genres').then(function (result) {
                        $rootScope.genresList = result.data.Genres;
                        $localForage.setItem('genres', result.data.Genres);
                        deferred.resolve(result.data.Genres);
                    });
                    /*DataService.getList('Genre', [], [], 50).then(function (result) {
                        $rootScope.genresList = result.data.data;
                        $localForage.setItem('genres', result.data.data);
                        deferred.resolve(result.data.data);
                    });*/
                }
            }, function (error) {
                debugger;
            });

            return deferred.promise;
        };

        $rootScope.generateTypes = function () {
            var deferred = $q.defer();
            // $localForage.removeItem('types');
            $localForage.getItem('types', true).then(function (data) {
                if( !_.isNull(data) ) {
                    deferred.resolve(data);
                } else {
                    DataService.collection('types').then(function (result) {
                        $rootScope.typesList = result.data.Types;
                        $localForage.setItem('types', result.data.Types);
                        deferred.resolve(result.data.Types);
                    });

                    /*DataService.getList('Type', [], [], 50).then(function (result) {
                        $rootScope.typesList = result.data.data;
                        $localForage.setItem('types', result.data.data);
                        deferred.resolve(result.data.data);
                    });*/
                }
            }, function (error) {
                debugger;
            });

            return deferred.promise;
        };

        $rootScope.generateCountries = function () {
            var deferred = $q.defer();
            // $localForage.removeItem('countries');
            $localForage.getItem('countries', true).then(function (data) {
                if( !_.isNull(data) ) {
                    deferred.resolve(data);
                } else {
                    DataService.collection('countries').then(function (result) {
                        $rootScope.countryList = result.data.Countries;
                        $localForage.setItem('countries', result.data.Countries);
                        deferred.resolve(result.data.Countries);
                    });
                    /*DataService.getList('Country', [], [], 300).then(function (result) {
                        $rootScope.countryList = result.data.data;
                        $localForage.setItem('countries', result.data.data);
                        deferred.resolve(result.data.data);
                    });*/
                }
            }, function (error) {
                debugger;
            });

            return deferred.promise;
        };

        $rootScope.generateLanguages = function () {
            var deferred = $q.defer();
            // $localForage.removeItem('languages');
            $localForage.getItem('languages', true).then(function (data) {
                if( !_.isNull(data) ) {
                    deferred.resolve(data);
                } else {
                    DataService.collection('languages').then(function (result) {
                        $rootScope.languageList = result.data.Languages;
                        $localForage.setItem('languages', result.data.Languages);
                        deferred.resolve(result.data.Languages);
                    });
                    /*DataService.getList('Language', [], [], 300).then(function (result) {
                        $rootScope.languageList = result.data.data;
                        $localForage.setItem('languages', result.data.data);
                        deferred.resolve(result.data.data);
                    });*/
                }
            }, function (error) {
                debugger;
            });

            return deferred.promise;
        };

        $rootScope.generateReactions = function () {
            return [
                {name: 'Happy', emotion: 'happy', icon: 'happy'},
                {name: 'Sad', emotion: 'sad', icon: 'sad'},
                {name: 'Offended', emotion: 'offended', icon: 'annoyed'},
                {name: 'Amused', emotion: 'amused', icon: 'grinning'},
                {name: 'Mad', emotion: 'mad', icon: 'mad'},
                {name: 'Furious', emotion: 'furious', icon: 'angry'},
                {name: 'Awesome', emotion: 'awesome', icon: 'woah'},
                {name: 'Terrified', emotion: 'terrified', icon: 'shocked'},
                {name: 'Confused', emotion: 'confused', icon: 'confused'},
                {name: 'In-Love', emotion: 'in-love', icon: 'love'},
                {name: 'Amazed', emotion: 'amazed', icon: 'woah'},
                {name: 'Motivated', emotion: 'motivated', icon: 'interested'},
                {name: 'Inspired', emotion: 'inspired', icon: 'interested'},
                {name: 'Bored', emotion: 'bored', icon: 'bored'},
                {name: 'Sleepy', emotion: 'sleepy', icon: 'bored'},
                //{name: 'Determined', emotion: 'determined', icon: 'interested'},
                {name: 'Emotional', emotion: 'emotional', icon: 'emotional'},
                {name: 'Excited', emotion: 'excited', icon: 'big-smile'},
                {name: 'Nostalgic', emotion: 'nostalgic', icon: 'nostalgic'},
                {name: 'Annoyed', emotion: 'annoyed', icon: 'annoyed'},
                {name: 'Sorry', emotion: 'sorry', icon: 'sad-tear'},
                {name: 'Ashamed', emotion: 'ashamed', icon: 'sad-tear'},
                {name: 'Meh', emotion: 'meh', icon: 'meh'},
                {name: 'Special', emotion: 'special', icon: 'wink'},
                {name: 'Sick', emotion: 'sick', icon: 'mute'},
                {name: 'Great', emotion: 'great', icon: 'grinning'},
                //{name: 'Down', emotion: 'down', icon: 'sad'},
                {name: 'Better', emotion: 'better', icon: 'interested'},
                {name: 'Guilty', emotion: 'guilty', icon: 'sympathetic'},
                {name: 'Hopeful', emotion: 'hopeful', icon: 'hopeful'},
                {name: 'Hopeless', emotion: 'hopeless', icon: 'sad'},
                {name: 'Secure', emotion: 'secure', icon: 'nerdy'},
                {name: 'Blessed', emotion: 'blessed', icon: 'grinning'},
                {name: 'Interested', emotion: 'interested', icon: 'interested'},
                {name: 'Comfortable', emotion: 'comfortable', icon: 'hehe'},
                {name: 'Disturbed', emotion: 'disturbed', icon: 'confused'},
                {name: 'Stupid', emotion: 'stupid', icon: 'confused'},
                {name: 'Sexy', emotion: 'sexy', icon: 'sexy'},
                {name: 'Relaxed', emotion: 'relaxed', icon: 'happy'},

                {name: 'Empowered', emotion: 'empowered', icon: 'happy'},
                {name: 'Cool', emotion: 'cool', icon: 'happy'},
                {name: 'Pumped', emotion: 'pumped', icon: 'happy'},
                {name: 'Turned On', emotion: 'turned on', icon: 'happy'},
                {name: 'Proud', emotion: 'Proud', icon: 'happy'},
                {name: 'Disgusted', emotion: 'disgusted', icon: 'annoyed'},
                {name: 'Sympathetic', emotion: 'sympathetic', icon: 'happy'},
                {name: 'Overwhelmed', emotion: 'overwhelmed', icon: 'happy'},
                {name: 'Passionate', emotion: 'passionate', icon: 'happy'},
                {name: 'Thrilled', emotion: 'thrilled', icon: 'happy'},
                {name: 'Loved', emotion: 'loved', icon: 'happy'},
                {name: 'Thankful', emotion: 'thankful', icon: 'happy'},
                {name: 'Appreciated', emotion: 'appreciated', icon: 'happy'},
                {name: 'Romantic', emotion: 'romantic', icon: 'love'},
                {name: 'Chill', emotion: 'chill', icon: 'happy'},
                {name: 'Pissed Off', emotion: 'pissed off', icon: 'annoyed'},
                {name: 'Accomplished', emotion: 'accomplished', icon: 'happy'},
                {name: 'Honored', emotion: 'honored', icon: 'happy'},
                {name: 'Young', emotion: 'young', icon: 'happy'},
                {name: 'Wild', emotion: 'wild', icon: 'happy'},
                {name: 'Old', emotion: 'old', icon: 'happy'},
                {name: 'Free', emotion: 'free', icon: 'happy'},
                {name: 'Epic', emotion: 'epic', icon: 'happy'},
                {name: 'Engaged', emotion: 'engaged', icon: 'happy'},
                {name: 'Fired Up', emotion: 'fired up', icon: 'happy'},
                {name: 'Detached', emotion: 'detached', icon: 'happy'},
                {name: 'Disconnected', emotion: 'disconnected', icon: 'confused'},
                {name: 'Connected', emotion: 'connected', icon: 'happy'},
                {name: 'Distant', emotion: 'distant', icon: 'happy'},
                {name: 'Beautiful', emotion: 'beautiful', icon: 'happy'},

                {name: 'Confident', emotion: 'confident', icon: 'happy'},
                {name: 'Positive', emotion: 'positive', icon: 'happy'},
                {name: 'Negative', emotion: 'negative', icon: 'annoyed'},
                {name: 'Heartbroken', emotion: 'heartbroken', icon: 'emotional'},
                {name: 'Silly', emotion: 'silly', icon: 'hehe'},
                {name: 'Disappointed', emotion: 'disappointed', icon: 'sad'},
                {name: 'Stressed', emotion: 'stressed', icon: 'annoyed'},
                {name: 'Fantastic', emotion: 'fantastic', icon: 'big-smile'},
                {name: 'Hungry', emotion: 'hungry', icon: 'annoyed'},
                {name: 'Shocked', emotion: 'shocked', icon: 'shocked'},
                {name: 'Frustrated', emotion: 'frustrated', icon: 'annoyed'},
                {name: 'Engrossed', emotion: 'engrossed', icon: 'interested'},
                {name: 'Peaceful', emotion: 'peaceful', icon: 'happy'},
                {name: 'Surprised', emotion: 'surprised', icon: 'woah'},
                {name: 'Satisfied', emotion: 'satisfied', icon: 'happy'},
                {name: 'Incomplete', emotion: 'incomplete', icon: 'sad'},
                {name: 'Complete', emotion: 'complete', icon: 'happy'},
                {name: 'Entertained', emotion: 'entertained', icon: 'hehe'},
                {name: 'Enlightened', emotion: 'enlightened', icon: 'interested'},
                {name: 'Relieved', emotion: 'relieved', icon: 'happy'},
                {name: 'Concerned', emotion: 'concerned', icon: 'sympathetic'},
                {name: 'Strong', emotion: 'strong', icon: 'happy'},
                {name: 'Optimistic', emotion: 'optimistic', icon: 'happy'},
                {name: 'Discouraged', emotion: 'discouraged', icon: 'happy'},
                {name: 'Lucky', emotion: 'lucky', icon: 'happy'},
                {name: 'Scared', emotion: 'scared', icon: 'happy'},
                {name: 'Brave', emotion: 'brave', icon: 'happy'},
                {name: 'Naughty', emotion: 'naughty', icon: 'sexy'},
                {name: 'Alert', emotion: 'alert', icon: 'happy'},
                {name: 'Alive', emotion: 'alive', icon: 'happy'},
                {name: 'Perfect', emotion: 'perfect', icon: 'happy'},
                {name: 'Nervous', emotion: 'nervous', icon: 'happy'},
                {name: 'Tense', emotion: 'tense', icon: 'annoyed'},
                {name: 'Eager', emotion: 'eager', icon: 'happy'},
                {name: 'Impatient', emotion: 'impatient', icon: 'annoyed'},
                {name: 'Philosophical', emotion: 'philosophical', icon: 'interested'},
                {name: 'Empty', emotion: 'empty', icon: 'happy'},
                {name: 'Informed', emotion: 'informed', icon: 'nerdy'},
                {name: 'Playful', emotion: 'playful', icon: 'happy'},
                {name: 'Knowledgeable', emotion: 'knowledgeable', icon: 'nerdy'},
                {name: 'Refreshed', emotion: 'refreshed', icon: 'happy'},
                {name: 'Fortunate', emotion: 'fortunate', icon: 'happy'},
                {name: 'Wanted', emotion: 'wanted', icon: 'annoyed'},
                {name: 'Thirsty', emotion: 'thirsty', icon: 'happy'},
                {name: 'Desperate', emotion: 'desperate', icon: 'happy'}
            ];
        };

        $rootScope.generateGenres();
        $rootScope.generateTypes();

        $rootScope.toastMessage = function (msg) {
            var toast = $mdToast.simple()
                .textContent(msg)
                .position('bottom right')
                .parent(jQuery('#alerts'));
            $mdToast.show(toast);
        };

        $rootScope.toastAction = function (msg, action, cb) {
            var toast = $mdToast.simple()
                .textContent(msg)
                .action(action)
                .highlightAction(false)
                .position('bottom right')
                .parent(jQuery('#alerts'));
            $mdToast.show(toast).then(function (response) {
                if (response == 'ok') {
                    cb();
                }
            });
        };

        self.toPage = function (state, args) {
            $state.go(state, args);
        };

        self.notiURL = function (n) {
            if (!n.is_read) {
                self.markAsRead(n);
            }
            self.toPage(n.main_url.state, n.main_url.args);
            jQuery('#NotificationsArea').foundation('close');
        };

        self.markAllAsSeen = function () {
            var unseenList = _.where($rootScope.AppData.Notifications.list, {seen: false});
            var i = 0;

            _.each($rootScope.AppData.Notifications.list, function (a) { if(!a.seen) {a.seen = true;} });
            $interval(function () {
                DataService.update('Action', unseenList[i++].id, { seen:true });
            }, 1000, unseenList.length).then(function (it) {
                // console.log(it);
            });

            /*$rootScope.getNewToken('notification', $rootScope.AppData.User.userId).then(function (token) {
                var feed = window.StreamClient.feed('notification', $rootScope.AppData.User.userId, token);
                feed.get({limit: 5, mark_seen: true}, function (a) {
                    // console.log(a);
                    _.each($rootScope.AppData.RawNotifications.list, function (n) {
                        n.is_seen = true;
                    });
                    $rootScope.AppData.RawNotifications.unseen = 0;
                })
            });*/
        };

        self.markAllAsRead = function () {
            /*$rootScope.getNewToken('notification', $rootScope.AppData.User.userId).then(function (token) {
                var feed = window.StreamClient.feed('notification', $rootScope.AppData.User.userId, token);
                feed.get({limit: 20, mark_read: true}, function (a) {
                    _.each($rootScope.AppData.RawNotifications.list, function (n) {
                        n.is_read = true;
                    });
                    $rootScope.AppData.RawNotifications.unread = 0;
                })
            });*/
        };

        self.markAsRead = function (obj) {
            if (!obj.seen) {
                DataService.update('Action', obj.id, {seen: true}, false, true);
                if ($rootScope.AppData.Notifications.unseen > 0) {
                    $rootScope.AppData.Notifications.unseen--;
                }
                obj.seen = true;
            }
            return obj;
        };

        self.doSignOut = function () {
            AuthService.logout().then(function (res) {
                window.location.reload();
            })
        };

        self.openNotificationsMenu = function () {
            jQuery('#NotificationsArea').foundation('toggle');
            self.markAllAsSeen();
        };

        $rootScope.toFavorites = self.toFavorites = toFavorites;
        $rootScope.toWatchLater = self.toWatchLater = toWatchLater;
        $rootScope.checkContains = self.checkContains = checkContains;
        $rootScope.isSame = self.isSame = isSame;

        function toFavorites(obj) {
            return UserActions.favorite(obj);
        }

        function toWatchLater(obj) {
            return UserActions.watchLater(obj);
        }

        function checkContains(obj, search) {
            return _.contains(obj, search);
        }

        function isSame(a, b) {
            return moment(a).isSame(b, 'hour');
        }

        function newsletterRegister(notifyMe) {
            DataService.notifyMe(notifyMe)
                .then(function (res) {
                    if (res.data.status == 'success') {
                        $rootScope.toastMessage('Thanks for joining our newsletter!');
                        return self.notifyMe = {};
                    }
                }, function (err) {
                    // console.log(err);
                });
        }
    }

    HomeCtrl.$inject = ['$rootScope', 'DataService', '$scope', '$q', '$modal', '$interval'];
    function HomeCtrl($rootScope, DataService, $scope, $q, $modal, $interval) {
        var self = this;
        $rootScope.metadata.title = 'Home';

        self.refresh = function () {
            // Trending Videos
            DataService.query('getProjectsBy', {order: "reactionCount"}).then(function (result) {
                self.trending = result;
            });

            // Highest Rated Videos
            DataService.query('getProjectsBy', {order: "iwRating"}).then(function (result) {
                self.highestRated = result;
            });

            // Highest Awarded Videos
            DataService.query('getProjectsBy', {order: "awardCount"}).then(function (result) {
                self.highestAwarded = result;
            });

            // Recent Videos
            DataService.query('getProjectsBy', {order: "createdAt"}).then(function (result) {
                self.recentFilms = result;
            });
        };
        self.refresh();
        self.refInterval = $interval(self.refresh, 30000);

        $scope.$on('$destroy', function () {
            $interval.cancel(self.refInterval);
        });
    }

    BrowseCtrl.$inject = ['$scope', '$rootScope', '$state', 'DataService', '$q', '$timeout', '$modal', '_'];
    function BrowseCtrl($scope, $rootScope, $state, DataService, $q, $timeout, $modal, _) {
        $rootScope.metadata.title = 'Browse';
        var self = this;
        self.isOpen = false;
        self.initializing = true;
        self.selectedGenres = [];
        self.selectedTypes = [];
        self.films = [];
        self.arrs = {
            genres: [],
            types: []
        };
        self.filters = {
            sort: $rootScope.$stateParams.sort||'createdAt',
            genres: $rootScope.$stateParams.genres||[],
            type: $rootScope.$stateParams.types||[],
            search: $rootScope.$stateParams.q||null
        };

        $rootScope.generateTypes().then(function (types) {
            var d = $q.defer();
            self.arrs.types = angular.isArray(self.selectedTypes) && self.selectedTypes.length ? self.selectedTypes : types;
            /*if($rootScope.$stateParams.genres) {
                self.selectedGenres.push(_.findWhere(self.arrs.genres, {name: $rootScope.$stateParams.genres}));
            }*/
            return d.promise;
        });

        $rootScope.generateGenres().then(function (genres) {
            var d = $q.defer();
            self.arrs.genres = angular.isArray(self.selectedGenres) && self.selectedGenres.length ? self.selectedGenres : genres;
            if($rootScope.$stateParams.genres && self.initializing) {
                self.selectedGenres.push(_.findWhere(self.arrs.genres, {name: $rootScope.$stateParams.genres}));
            }
            return d.promise;
        });

        self.refresh = function () {
            $q.all([$rootScope.generateTypes(), $rootScope.generateGenres()]).then(function (values) {
                self.filters.sort = $rootScope.$stateParams.sort || 'recent';
                self.search();
            });
        };

        self.search = function () {
            var filterField = '';
            switch (self.filters.sort) {
                case 'trending':
                    filterField = "reactionCount";
                    break;
                case 'rating':
                    filterField = "iwRating";
                    break;
                case 'awards':
                    filterField = "awardCount";
                    break;
                case 'recent':
                default:
                    filterField = "createdAt";
                    break;
            }

            //filmQuery.containedIn('genres', genres);
            //filmQuery.containedIn('type', types);


            DataService.query('getBrowseResults', {
                sort: filterField,
                order: 'DESC',
                types: _.pluck(self.selectedTypes, 'id').toString(),
                genres: _.pluck(self.selectedGenres, 'id').toString(),
                search: self.filters.search||''
            }).then(function (res) {
                return self.films = res.data;
            });

            /*DataService.getList("Project"/!*"Project"*!/, [{fieldName: filterField, order: 'desc'}],
             [{fieldName: 'unlist', operator: 'equals', value: false}], 30, true, true, 1, self.filters.search)
             .then(function (res) {
             return self.films = res.data;
             });*/

            $scope.$broadcast('scroll.refreshComplete');
            self.initializing = false;
        };

        self.selectGenres = function (genre) {
            var exists = _.findWhere(self.selectedGenres, {id: genre.id});
            !!exists ? self.selectedGenres = _.reject(self.selectedGenres, genre) : self.selectedGenres.push(genre);
            self.search();
        };

        self.selectTypes = function (type) {
            var exists = _.find(self.selectedTypes, {id: type.id});
            !!exists ? self.selectedTypes = _.reject(self.selectedTypes, type) : self.selectedTypes.push(type);
            self.search();
        };

        self.filterBy = function (filter) {
            self.search();
        };

        $scope.$watch('', function (newValue, oldValue) {

        });

        self.refresh();
    }

    LatestCtrl.$inject = ['$rootScope', '$scope', 'DataService', '$timeout', '$interval'];
    function LatestCtrl($rootScope, $scope, DataService, $timeout, $interval) {
        $rootScope.metadata.title = 'Latest';
        var self = this;

        self.init = function () {
            DataService.query('getLatestReactions').then(function (res) {
                self.reactions = res.data;
            });
            DataService.query('getLatestNominations').then(function (res) {
                self.nominations = res.data;
            });
            DataService.query('getLatestCritiques').then(function (res) {
                self.critiques = res.data;
            });
        };

        self.init();
        self.refInterval = $interval(self.init, 30000);

        $scope.$on('$destroy', function () {
            $interval.cancel(self.refInterval);
        });

        $timeout(jQuery(document).foundation(), 0);
    }

    ResultsCtrl.$inject = ['$scope', '$rootScope', '$state', 'DataService', '$q', '$timeout', '$modal', '_'];
    function ResultsCtrl($scope, $rootScope, $state, DataService, $q, $timeout, $modal, _) {
        $rootScope.metadata.title = 'Search';
        var self = this;
        self.isOpen = false;
        self.selectedGenres = [];
        self.selectedTypes = [];
        self.results = [];
        self.filters = {
            sort: '',
            genres: [],
            types: []
        };
        self.arrs = {
            genres: [],
            types: []
        };

        self.searchParams = {
            obj: 'Project',
            filters: {
                sort: 'recent',
                genres: [],
                types: []
            }
        };

        $rootScope.generateTypes().then(function (types) {
            var d = $q.defer();
            self.arrs.types = angular.isArray(self.selectedTypes) && self.selectedTypes.length ? self.selectedTypes : types;
            return d.promise;
        });
        $rootScope.generateGenres().then(function (genres) {
            var d = $q.defer();
            self.arrs.genres = angular.isArray(self.selectedGenres) && self.selectedGenres.length ? self.selectedGenres : genres;
            return d.promise;
        });

        self.refresh = function () {
            $q.all([$rootScope.generateTypes(), $rootScope.generateGenres()]).then(function (values) {
                self.search(values[1], values[0]);
                //// console.log(self);
            })
        };

        self.search = function (genres, types) {
            if (genres && !genres.length)
                genres = self.arrs.genres;
            if (types && !types.length)
                types = self.arrs.types;

            var deferred = $q.defer();
            var decodedURI = decodeURIComponent($rootScope.$stateParams.q || '');

            // Search Films
            var p1 = DataService.getList('Project', [{fieldName: 'createdAt', order: 'desc'}],
                [{fieldName: 'unlist', operator: 'notEquals', value: true}], 50, true, true, 1, decodedURI)
                .then(function (res) {
                    return self.results = res.data;
                });

            ////Search user
            //var searchUsersFirstName = new Parse.Query('User');
            //_.each(decodedURI.split(' '), function (a) {
            //    searchUsersFirstName.matches('first_name', a);
            //});
            //var searchUsersLastName = new Parse.Query('User');
            //_.each(decodedURI.split(' '), function (a) {
            //    searchUsersLastName.matches('last_name', decodedURI);
            //});
            //var searchUsers = new Parse.Query.or(searchUsersFirstName, searchUsersLastName);
            //var p2 = searchUsers.find().then(function (data) {
            //    return data;
            //});
            //
            //$q.all([p1, p2]).then(function (values) {
            //    self.results = _.flatten(values, true);
            //    $scope.$broadcast('scroll.refreshComplete');
            //});
        };

        self.advancedSearch = function (genres, types) {

        };

        self.selectGenres = function (genre) {
            var exists = _.find(self.selectedGenres, function (a) {
                return a && a.id == genre.id;
            });
            !!exists ? self.selectedGenres = _.reject(self.selectedGenres, genre) : self.selectedGenres.push(genre);
            self.search(self.selectedGenres, self.selectedTypes);
        };

        self.selectTypes = function (type) {
            var exists = _.find(self.selectedTypes, function (a) {
                return a && a.id == type.objectId;
            });
            !!exists ? self.selectedGenres = _.reject(self.selectedTypes, type) : self.selectedTypes.push(type);
            self.search(self.selectedGenres, self.selectedTypes);
        };

        $scope.$on('search', function (text) {
            self.refresh();
        });

        self.refresh();
        jQuery(document).foundation();
    }

    AdvancedResultsCtrl.$inject = ['$scope', '$rootScope', '$state', '$localForage', '$q', '$timeout', '$modal', '_'];
    function AdvancedResultsCtrl($scope, $rootScope, $state, $localForage, $q, $timeout, $modal, _) {
        $rootScope.metadata.title = 'Advanced Search';
        $rootScope.AppData.searchText = decodeURIComponent($rootScope.$stateParams.q || '');
        var self = this;
        self.isOpen = false;
        self.selectedGenres = [];
        self.selectedTypes = [];
        self.search = {};
        self.results = [];
        self.arrs = {
            genres: [],
            types: []
        };

        $('.collapsible').collapsible({
            accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });

        $rootScope.generateTypes().then(function (types) {
            var d = $q.defer();
            self.arrs.types = angular.isArray(self.selectedTypes) && self.selectedTypes.length ? self.selectedTypes : types;
            return d.promise;
        });
        $rootScope.generateGenres().then(function (genres) {
            var d = $q.defer();
            self.arrs.genres = angular.isArray(self.selectedGenres) && self.selectedGenres.length ? self.selectedGenres : genres;
            return d.promise;
        });

        $rootScope.generateCountries().then(function (countries) {

        });

        self.refresh = function () {
            $q.all([$rootScope.generateTypes(), $rootScope.generateGenres()]).then(function (values) {
                // console.log($rootScope.$stateParams);
                if ($rootScope.$stateParams) {
                    self.advancedSearch();
                }
                //// console.log(self);
            })
        };

        self.beginSearch = function () {
            /*if (genres && !genres.length)
             genres = self.arrs.genres;
             if (types && !types.length)
             types = self.arrs.types;*/

            var deferred = $q.defer();
            var decodedURI = decodeURIComponent($rootScope.$stateParams.q || '');

            // Search Films
            var filmQuery = new Parse.Query("Project");
            //innerQuery.notEqualTo("disableProject", true);
            filmQuery.notEqualTo("unlist", true);
            filmQuery.contains("name_lowercase", decodedURI);
            //filmQuery.containsAll("tags", decodedURI.spl);
            //var joinQuery = new Parse.Query("Film_Genre");
            //joinQuery.matchesQuery("film", innerQuery);
            filmQuery.include(["type", "owner"]);
            filmQuery.descending("createdAt");
            //joinQuery.limit(10);
            //filmQuery.containedIn('genres', genres);
            //filmQuery.containedIn('type', types);
            var p1 = filmQuery.find().then(function (data) {
                return data;
                //angular.extend(self.results, data);
            });

            //Search User
            var searchUsersFirstName = new Parse.Query('User');
            _.each(decodedURI.split(' '), function (a) {
                searchUsersFirstName.matches('first_name', a);
            });
            var searchUsersLastName = new Parse.Query('User');
            _.each(decodedURI.split(' '), function (a) {
                searchUsersLastName.matches('last_name', decodedURI);
            });
            var searchUsers = new Parse.Query.or(searchUsersFirstName, searchUsersLastName);
            var p2 = searchUsers.find().then(function (data) {
                return data;
            });

            $q.all([p1, p2]).then(function (values) {
                self.results = _.flatten(values, true);
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        self.advancedSearch = function () {
            // console.log(self.search);

            // Search Films
            var filmQuery = new Parse.Query("Project");
            filmQuery.notEqualTo("unlist", true);
            filmQuery.include(["type", "filmingCountry", "owner"]);
            filmQuery.descending("createdAt");

            if (self.search.director) {
                filmQuery.contains("director", self.search.director);
            }
            if (self.search.producers) {
                filmQuery.contains("producers", self.search.producers);
            }
            if (self.search.writer) {
                filmQuery.contains("writer", self.search.writer);
            }

            if (self.search.type) {
                filmQuery.equalTo("type", self.search.type);
            }
            if (self.search.genre) {
                //filmQuery.contains("writer", self.search.genre);
            }
            if (self.search.country) {
                filmQuery.equalTo("filmingCountry", self.search.country);
            }

            var p1 = filmQuery.find().then(function (data) {
                self.results = data;
                //angular.extend(self.results, data);
            });

            // Search Users

        };

        self.selectGenres = function (genre) {
            var exists = _.find(self.selectedGenres, function (a) {
                return a && a.id == genre.id;
            });
            !!exists ? self.selectedGenres = _.reject(self.selectedGenres, genre) : self.selectedGenres.push(genre);
            self.search(self.selectedGenres, self.selectedTypes);
        };

        self.selectTypes = function (type) {
            var exists = _.find(self.selectedTypes, function (a) {
                return a && a.id == type.objectId;
            });
            !!exists ? self.selectedGenres = _.reject(self.selectedTypes, type) : self.selectedTypes.push(type);
            self.search(self.selectedGenres, self.selectedTypes);
        };

        self.openMenu = function ($mdOpenMenu, ev) {
            var originatorEv = ev;
            $mdOpenMenu(ev);
        };

        /*$scope.$on('search', function (text) {
         self.refresh();
         });*/

        //self.refresh();
    }

    VideoCtrl.$inject = ['$rootScope', '$scope', 'Project', '$modal', 'UserActions', 'UtilsService', 'DataService', '$state', 'Analytics', '$window', '$timeout', 'Backand', '_'];
    function VideoCtrl($rootScope, $scope, Project, $modal, UserActions, UtilsService, DataService, $state, Analytics, $window, $timeout, Backand, _) {
        var self = this;
        self.loaded = false;
        self.displayShare = false;
        self.toggleReactionsList = false;
        self.emotions = $rootScope.generateReactions();
        self.critiqueAverage = 0;
        self.activeTab = 'critiques';
        self.isFaved = false;
        self.isSaved = false;
        self.playerResponsiveMode = $window.localStorage.playerResponsiveMode ? JSON.parse($window.localStorage.playerResponsiveMode) : _.contains(['small', 'medium', 'large'], Foundation.MediaQuery.current);
        self.tagsArray = [];
        self.lightsOff = false;

        self.film = Project.data[0];
        // console.log(Project.data[0]);
        function init(result) {
            $rootScope.currentTitle = result.name;
            //self.film = result;
            //$scope.commentsParent = self.film;

            //get owner
            DataService.getItem('users', result.owner, false).then(function (res) {
                // console.log(res);
                self.film.owner = res.data;
            });

            if (self.film.video_url.indexOf('youtu') != -1) {
                self.type = 'youtube';
            } else if (self.film.video_url.indexOf('vimeo') != -1) {
                self.type = 'vimeo';
            } else if (self.film.hosting_type === 'cdn') {
                self.type = 'HTML5';
            } else {
                self.type = 'other';
            }
            self.loaded = true;

            $rootScope.metadata = {
                title: result.name,
                description: angular.isString(result.description) ? result.description.substr(0, 150) : '',
                image: result.thumbnail_url,
                url: window.location.href
            };

            self.qReactions();

            self.qCritiques();

            self.qNominations();

            self.qWins();

            self.checkUserActions();

            $rootScope.initWatch = function () {
                Analytics.trackEvent('video', 'play', self.film.name);
                UserActions.markAsWatched(self.film)
            };
            //self.activeWatch = UserActions.markAsWatched(self.film);

            $scope.$on('$destroy', function () {
                $rootScope.initWatch = undefined;
            });
            //UserActions.cancelWatched(self.activeWatch);

            self.test = function () {
                // console.log('Clicked');
            };

            //Populate tags array
            if (angular.isString(self.film.tags) && self.film.tags.length) {
                if (self.film.tags.indexOf(',') > -1) {
                    self.tagsArray = self.film.tags.split(',');
                }
            }

            //List Genres
            DataService.query('getProjectGenres', {id: self.film.id})
                .then(function (res) {
                    self.film.genres = res.data;
                });

            // Get related video
            DataService.query('getRelatedVideo', {
                id: self.film.id,
                userId: $rootScope.AppData.User ? $rootScope.AppData.User.userId : null
            })
                .then(function (res) {
                    if (res) {
                        self.relatedvideo = res.data[0];
                    }
                });

            // Register Listener
            // console.log('Listener registered!');
            Backand.on('video_updated_' + self.film.url_id, function (data) {
                //// console.log(self.film);
                // console.log('Listener Triggered!');
                // console.log(data);
                self.updateVideoObj();
                /*_.each(data, function (a) {
                 self.film[a.Key] = a.value;
                 })*/
            });
        }

        self.checkUserActions = function () {
            var loggedIn = $rootScope.AppData.User;
            if (loggedIn) {
                var videoOwner = (angular.isString(self.film.owner) ? self.film.owner : self.film.owner.id) === $rootScope.AppData.User.userId;
                UserActions.canReact(self.film.id).then(function (res) {
                    self.canReact = res;
                }, function (error) {
                    self.canReact = error;
                });

                if (self.film.disableCritique || (videoOwner)) {
                    console.log('owner');
                    self.canCritique = false;
                } else {
                    UserActions.canCritique(self.film.id).then(function (res) {
                        self.canCritique = res;
                    }, function (error) {
                        self.canCritique = error;
                    });
                }


                UserActions.canRate(self.film.id).then(function (res) {
                    self.canRate = res;
                }, function (error) {
                    self.canRate = error;
                });
            } else {
                self.canCritique = true;
            }
        };

        self.qComments = function () {
            // Fetch Comments
            DataService.getList("Comment", [{fieldName: "createdAt", order: "desc"}],
                [
                    {fieldName: "project", operator: "in", value: self.film.id},
                    {fieldName: "parentComment", operator: "in", value: ''}
                ],
                20, false, false, 1).then(function (result) {
                    self.comments = result.data;
                    // console.log("comments: ", result.data);
                });
        };

        self.qReactions = function () {
            // Fetch Reactions
            DataService.getList("Reaction", [{fieldName: "createdAt", order: "desc"}],
                [{fieldName: "project", operator: "in", value: self.film.id}],
                20, false, false, 1).then(function (result) {
                    self.reactions = result.data;
                    self.chartedReactions = _.countBy(self.reactions.data, function (r) {
                        return _.contains(self.reactions.data, r) ? r.emotion : undefined;
                    });
                    self.reactionCountMax = _.max(self.chartedReactions, function (i) {
                        return i;
                    });

                    var sortable = [];
                    for (var r in self.chartedReactions)
                        sortable.push([r, self.chartedReactions[r]])
                    sortable.sort(function (a, b) {
                        return b[1] - a[1]
                    });

                    self.chartedReactions = _.object(sortable);
                });
        };

        self.qCritiques = function () {
            // Fetch Critiques
            DataService.query('getProjectCritiques', {id: self.film.id})
                .then(function (result) {
                    self.critiques = result.data;
                    self.calcIwAverage(self.critiques);
                });
        };

        self.qNominations = function () {
            DataService.getList('Nomination', [{fieldName: "createdAt", order: "desc"}],
                [{fieldName: "project", operator: "in", value: self.film.id}],
                20, true, true, 1).then(function (result) {
                    self.nominations = result.data;
                    //// console.log('Nomination: ', result.data);
                });
        };

        self.qWins = function () {
            DataService.getList('AwardWin', [{fieldName: "createdAt", order: "desc"}],
                [{fieldName: "project", operator: "in", value: self.film.id}],
                20, true, true, 1).then(function (result) {
                    self.wins = result.data;
                    // console.log('AwardWin: ', result.data);
                });
        };

        self.calcIwAverage = function (critiques) {
            var total = 0;
            _.each(critiques, function (a) {
                total += a.overall;
            });
            self.critiqueAverage = total / critiques.length;
        };

        self.getEmoticonByEmotion = function (emotion) {
            var reactions = $rootScope.generateReactions();
            return _.findWhere(reactions, {emotion: emotion});
        };

        self.openMenu = function ($mdOpenMenu, ev) {
            var originatorEv = ev;
            $mdOpenMenu(ev);
        };

        self.showMessageDialog = function () {
            UserActions.checkAuth().then(function (res) {
                if (res) {
                    var params = {
                        templateUrl: './src/common/contactUserDialog.html',
                        resolve: {
                            recipient: function () {
                                return self.film.owner;
                            }
                        },
                        controller: ContactUserDialogController
                    };
                    var msgModal = $modal.open(params);
                }
            }, function (err) {
                UserActions.loginModal();
            });
        };

        self.rateThrottled = false;
        /*self.throttledRate = function (direction) {
            _.throttle(self.rate(direction), 2000);
        };*/

        self.rate = function (direction) {
            if (!!self.rateThrottled) {
                return false;
            }

            UserActions.checkAuth().then(function (res) {
                if (res) {
                    self.rateThrottled = true;
                    var actionVerb = 'like';
                    if (self.canRate === true) {
                        DataService.save('Rating', {
                            author: $rootScope.AppData.User.userId,
                            project: self.film.id,
                            up: direction === 'up',
                            down: direction === 'down'
                        }, false, true).then(function (res) {
                            // console.log(res);
                            switch (direction) {
                                case 'up':
                                    // Increment film rateUpCount
                                    self.film.rateUpCount++;
                                    break;
                                case 'down':
                                    // Increment film rateDownCount
                                    self.film.rateDownCount++;
                                    actionVerb = 'unlike';
                                    break;
                            }

                            self.updateVideoObj();
                            angular.extend(res.data, { projectOwner: angular.isString(self.film.owner) ? self.film.owner : self.film.owner.id});
                            UtilsService.recordActivity(res.data, actionVerb);
                            self.checkUserActions();
                        });

                    } else if (angular.isObject(self.canRate)) {
                        //up is false && down is false
                        if (!self.canRate.up && !self.canRate.down) {
                            DataService.update('Rating', self.canRate.id, {
                                up: direction === 'up' ? true : undefined,
                                down: direction === 'down' ? true : undefined,
                                direction: direction
                            }, false, true, direction)
                                .then(function (res) {
                                    switch (direction) {
                                        case 'up':
                                            // Increment film rateUpCount
                                            self.film.rateUpCount++;
                                            break;
                                        case 'down':
                                            // Increment film rateDownCount
                                            self.film.rateDownCount++;
                                            actionVerb = 'unlike';
                                            break;
                                    }
                                    angular.extend(self.canRate, {up: direction === 'up', down: direction === 'down'});
                                    //self.updateVideoObj();
                                    angular.extend(res.data, { projectOwner: angular.isString(self.film.owner) ? self.film.owner : self.film.owner.id});
                                    UtilsService.recordActivity(res.data, actionVerb);
                                    //self.checkUserActions();
                                });

                            // up is already true && direction is up
                        } else if (!!self.canRate.up && direction === 'up') {
                            //DataService.delete('Rating', self.canRate.id)
                            angular.extend(self.canRate, {up: false});
                            DataService.update('Rating', self.canRate.id, {
                                up: false,
                                direction: direction
                            }, false, true, direction)
                                .then(function (res) {
                                    self.film.rateUpCount--;
                                    //self.updateVideoObj();
                                    angular.extend(res.data, { projectOwner: angular.isString(self.film.owner) ? self.film.owner : self.film.owner.id});
                                    UtilsService.updateActivity(res.data, 'like');
                                    //self.checkUserActions();
                                });

                            // down is already true && direction is down
                        } else if (!!self.canRate.down && direction === 'down') {
                            //DataService.delete('Rating', self.canRate.id)
                            angular.extend(self.canRate, {down: false});
                            DataService.update('Rating', self.canRate.id, {
                                down: false,
                                direction: direction
                            }, false, true, direction)
                                .then(function (res) {
                                    self.film.rateDownCount--;
                                    //self.updateVideoObj();
                                    angular.extend(res.data, { projectOwner: angular.isString(self.film.owner) ? self.film.owner : self.film.owner.id});
                                    UtilsService.updateActivity(res.data, 'unlike');
                                    //self.checkUserActions();
                                });

                            // down is true && direction is up || up is true && direction is down -> reversal
                        } else if ((!!self.canRate.down && direction === 'up') || (!!self.canRate.up && direction === 'down')) {
                            var up = false, down = false;
                            switch (direction) {
                                case 'up':
                                    up = true;
                                    self.film.rateUpCount++;
                                    self.film.rateDownCount--;
                                    angular.extend(self.canRate, {up: up, down: down});
                                    break;
                                case 'down':
                                    down = true;
                                    self.film.rateUpCount--;
                                    self.film.rateDownCount++;
                                    angular.extend(self.canRate, {up: up, down: down});
                                    actionVerb = 'unlike';
                                    break;
                            }
                            DataService.update('Rating', self.canRate.id, {
                                up: up,
                                down: down,
                                direction: direction
                            }, false, true, direction).then(function (res) {
                                //self.updateVideoObj();
                                //self.checkUserActions();
                                angular.extend(res.data, { projectOwner: angular.isString(self.film.owner) ? self.film.owner : self.film.owner.id});
                                UtilsService.updateActivity(res.data, actionVerb);
                            });
                        }
                    }
                    $timeout(function () {
                        self.rateThrottled = false;
                    }, 1000);
                }
            }, function (err) {
                UserActions.loginModal();
            });
        };

        self.react = function (emotion) {
            if (angular.isDefined(emotion)) {
                UserActions.checkAuth().then(function (res) {
                    if (res) {
                        var actionVerb = 'react';
                        if (self.canReact === true) {
                            DataService.save('Reaction', {
                                user: $rootScope.AppData.User.userId,
                                project: self.film.id,
                                emotion: emotion.emotion
                            }, true, true).then(function (resA) {
                                self.film.reactionCount++;
                                self.updateVideoObj();
                                angular.extend(resA.data, { projectOwner: angular.isString(self.film.owner) ? self.film.owner : self.film.owner.id});
                                UtilsService.recordActivity(resA.data, actionVerb);
                                self.checkUserActions();
                                self.qReactions();
                            });
                        } else if (angular.isObject(self.canReact)) {
                            if (self.canReact.emotion !== emotion.emotion) {
                                DataService.update('Reaction', self.canReact.id, {
                                    emotion: emotion.emotion
                                }, false, true).then(function (resA) {
                                    self.canReact = resA.data;
                                    self.updateVideoObj();
                                    self.checkUserActions();
                                    self.qReactions();
                                });
                            }
                        }
                    }
                }, function (err) {
                    UserActions.loginModal();
                });
            }
        };

        self.canReactIcon = function () {
            return angular.isObject(self.canReact) ? _.findWhere(self.emotions, {'emotion': self.canReact.emotion}).icon : false;
        };

        self.deleteCritique = function (c, ev) {
            UserActions.checkAuth().then(function (res) {
                if (res) {
                    var modalInstance = $modal.open({
                        templateUrl: './src/common/confirmDialog.html',
                        controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                            $scope.ok = function () {
                                $modalInstance.close(true);
                            };

                            $scope.cancel = function () {
                                $modalInstance.dismiss('cancel');
                            };
                        }],
                        size: Foundation.MediaQuery.atLeast('large') ? 'tiny' : 'small',
                        keyboard: true
                    });
                    modalInstance.result.then(function () {
                        DataService.getList('Nomination', [], [{
                            critique: c.id
                        }]).then(function (noms) {
                            var nom = noms.data.data[0];
                            DataService.delete('Nomination', nom.id).then(function () {
                                // Decrement film nominationCount
                                self.film.nominationCount--;
                            });

                            DataService.delete('Critique', c.id).then(function () {
                                $rootScope.toastMessage('Your critique was deleted.');
                                // Decrement film critiqueCount
                                self.film.critiqueCount--;
                                self.updateVideoObj();
                                self.checkUserActions();
                                self.critiques = _.reject(self.critiques, function (a) {
                                    return a.id === c.id;
                                });
                            });
                        })
                    }, function () {
                        // console.info('Modal dismissed at: ' + new Date());
                    });
                }
            })
        };

        self.openCritiqueDialog = function ($event) {
            if (self.canCritique !== true && self.canCritique !== false) {
                return $state.go('video_critique-edit', {video_id: self.film.id, id: self.canCritique.id});
            }

            CritiqueDialogController.$inject = ['$scope', '$modalInstance', 'critique', '$q', 'Analytics'];
            function CritiqueDialogController($scope, $modalInstance, critique, $q, Analytics) {
                zIndexPlayer();
                $scope.critique = critique;
                $scope.ratingMax = 10;
                $scope.makePrivateHelp = false;

                DataService.getList('Award', [], [], 50)
                    .then(function (result) {
                        $scope.awardsList = result.data;
                    });

                $scope.dialogModel = {
                    awardId: null
                };

                $scope.nominated = {
                    awardPntr: $scope.dialogModel.awardId,
                    nominator: $rootScope.AppData.User.userId,
                    project: $scope.critique.project,
                    critique: undefined
                };

                $scope.starArray = angular.copy([{"num": 0}, {"num": 1}, {"num": 2}, {"num": 3}, {"num": 4}, {"num": 5}, {"num": 6}, {"num": 7}, {"num": 8}, {"num": 9}, {"num": 10}].reverse());

                $scope.calcOverall = function () {
                    $scope.critique.overall = ($scope.critique.originality + $scope.critique.direction + $scope.critique.writing +
                        $scope.critique.cinematography + $scope.critique.performances + $scope.critique.production +
                        $scope.critique.pacing + $scope.critique.structure + $scope.critique.audio + $scope.critique.music) / 10;
                };

                $scope.$watchCollection('critique', function () {
                    $scope.calcOverall();
                });

                $scope.closeDialog = function () {
                    zIndexPlayer(true);
                    $modalInstance.close(true);
                };

                $scope.cancel = function () {
                    zIndexPlayer(true);
                    $modalInstance.dismiss('cancel');
                };

                $scope.hoveringOver = function (value) {
                    $scope.overStar = value;
                    $scope.percent = 100 * (value / $scope.max);
                };

                $scope.postCritique = function () {
                    $scope.critique.url_id = moment().valueOf();
                    DataService.save('Critique', $scope.critique, true, true).then(function (res) {
                        var obj = res.data;
                        angular.extend(obj, {
                            userFullName: obj.author.firstName + ' ' + obj.author.lastName,
                            userUrlId: obj.author.url_id,
                            userAvatar: obj.author.avatar,
                            projectName: self.film.name,
                            projectId: self.film.url_id,
                            projectUrlId: self.film.url_id,
                            projectThumbnail: self.film.thumbnail_url,
                            projectOwner: angular.isString(self.film.owner) ? self.film.owner : self.film.owner.id
                        });

                        self.critiques.push(obj);
                        self.calcIwAverage(self.critiques);
                        // Increment film critiqueCount
                        self.film.critiqueCount++;

                        // register Action
                        UtilsService.recordActivity(obj, 'judge');
                        Analytics.trackEvent('video', 'critique', self.film.name);

                        // if an award has been selected, create a nomination
                        if (!!$scope.dialogModel.awardId && angular.isString($scope.dialogModel.awardId)) {
                            $scope.nominated.critique = obj.id;
                            $scope.nominated.awardPntr = $scope.dialogModel.awardId;
                            DataService.save('Nomination', $scope.nominated, true, true).then(function (nom) {
                                // Increment film commentCount
                                self.film.nominationCount++;
                                self.updateVideoObj();
                                // register Action
                                self.qNominations();
                                nom.critique = obj;
                                UtilsService.recordActivity(nom, 'nominate');
                                Analytics.trackEvent('video', 'nominate', self.film.name);
                            }, function (error) {
                                alert('Failed to create new nomination, with error code: ' + error.message);
                            })
                        }

                    }, function (error) {
                        alert('Failed to create new critique, with error code: ' + error.message);

                    }).then(function () {
                        self.qCritiques();
                        self.checkUserActions();
                        $scope.closeDialog();
                    });
                };
            }

            UserActions.canCritique(self.film.id).then(function (res) {
                // is logged in
                if (res) {
                    $modal.open({
                        templateUrl: './src/common/critiqueDialog.html',
                        resolve: {
                            critique: function () {
                                return {
                                    originality: 0,
                                    direction: 0,
                                    writing: 0,
                                    cinematography: 0,
                                    performances: 0,
                                    production: 0,
                                    pacing: 0,
                                    structure: 0,
                                    audio: 0,
                                    music: 0,
                                    overall: 0,
                                    private: false,
                                    author: $rootScope.AppData.User.userId,
                                    body: '',
                                    project: self.film.id
                                };
                            }
                        },
                        closeOnClick: false,
                        controller: CritiqueDialogController,
                        keyboard: true
                    });
                }
            }, function (err) {
                if (angular.isObject(err)) {
                    return false;
                } else UserActions.loginModal();
            });
        };

        self.openShareDialog = function () {
            $modal.open({
                templateUrl: './src/common/shareDialog.html',
                resolve: {
                    Video: function () {
                        return self.film;
                    }
                },
                size: Foundation.MediaQuery.atLeast('large') ? 'tiny' : 'small',
                controller: ['$scope', '$modalInstance', 'Video', function ($scope, $modalInstance, Video) {
                    zIndexPlayer();
                    $scope.video = Video;
                    $scope.shareLink = window.location.origin + '/alpha/' + Video.url_id;
                    $scope.cancel = function () {
                        zIndexPlayer(true);
                        $modalInstance.close();
                    };
                }]
            })
        };

        self.openReactionDialog = function () {
            UserActions.checkAuth(self.film.id).then(function (res) {
                // is logged in
                if (res) {
                    var modalInstance = $modal.open({
                        templateUrl: './src/common/reactionDialog.html',
                        resolve: {
                            Video: function () {
                                return self.film;
                            },
                            Reaction: function () {
                                return self.canReact || null;
                            },
                            Emotions: function () {
                                return self.emotions;
                            }
                        },
                        size: Foundation.MediaQuery.atLeast('medium') ? 'tiny' : 'full',
                        controller: ['$scope', '$modalInstance', 'Video', 'Reaction', 'Emotions', function ($scope, $modalInstance, Video, Reaction, Emotions) {
                            zIndexPlayer();
                            $scope.video = Video;
                            $scope.emotions = Emotions;

                            $scope.getEmoticonByEmotion = function (emotion) {
                                return _.findWhere($scope.emotions, {emotion: emotion});
                            };

                            $scope.selectedEmotion = function (e) {
                                zIndexPlayer(true);
                                //$modalInstance.dismiss('cancel');
                                $modalInstance.close(e);
                            };

                            $scope.cancel = function () {
                                zIndexPlayer(true);
                                $modalInstance.dismiss('cancel');
                            };

                            $scope.closeDialog = function () {
                                zIndexPlayer(true);
                                $modalInstance.dismiss('cancel');
                            };

                        }]
                    });

                    modalInstance.result.then(function (reaction) {
                        self.react(reaction);
                    }, function () {
                        // console.info('Modal dismissed at: ' + new Date());
                    }).then(function () {
                        $timeout(function () {
                            // console.log('remove is-reveal-open');
                            jQuery('body').removeClass('is-reveal-open')
                        }, 500);
                    });
                }
            }, function (err) {
                // console.log(err);
                if (angular.isObject(err)) {
                    return false;
                } else UserActions.loginModal();
            });
        };

        self.openAddToDialog = function () {
            $modal.open({
                templateUrl: './src/common/shareDialog.html',
                resolve: {
                    Video: function () {
                        return self.film;
                    }
                },
                size: Foundation.MediaQuery.atLeast('large') ? 'tiny' : 'small',
                controller: ['$scope', '$modalInstance', 'Video', function ($scope, $modalInstance, Video) {
                    zIndexPlayer();
                    $scope.video = Video;
                    $scope.shareLink = window.location.origin + '/alpha/' + Video.url_id;
                    $scope.cancel = function () {
                        zIndexPlayer(true);
                        $modalInstance.close();
                    };
                }]
            })
        };

        self.toFavorites = function () {
            return $rootScope.toFavorites(self.film);
        };

        self.toWatchLater = function () {
            return $rootScope.toWatchLater(self.film);
        };

        self.toggleWidthMode = function () {
            $window.localStorage.playerResponsiveMode = self.playerResponsiveMode = !self.playerResponsiveMode;
            $timeout(function () {
                $window.videoPlayer.resize();
                //fail-safe
                $timeout(function () {
                    $window.videoPlayer.resize();
                }, 500);
            }, 100);
        };

        $scope.$on('$destroy', function (event) {
            //$scope.commentSubscribe.cancel();
        });

        self.updateVideoObj = function () {
            return DataService.query('getProjectById', {id: self.film.id})
                .then(function (a) {
                    console.log('Project Updated: ', a);
                    self.film = a.data[0];
                });
        };

        self.toggleLights = function () {
            self.lightsOff = !self.lightsOff;
            var overlay = jQuery('#overlay');
            overlay.fadeToggle(1000);
            /* Choose desired delay */
            if (!self.lightsOff) {
                $timeout(function () {
                    overlay.removeClass('highlight');
                }, 1000);
                /* Same delay */
            } else {
                overlay.addClass('highlight');
            }
        };

        self.reportDialog = function () {
            var modalInstance = $modal.open({
                templateUrl: './src/common/reportVideoDialog.html',
                resolve: {
                    Video: function () {
                        return self.film;
                    }
                },
                closeOnClick: false,
                size: Foundation.MediaQuery.atLeast('medium') ? 'small' : 'full',
                controller: ['$scope', '$modalInstance', 'DataService', 'Video', function ($scope, $modalInstance, DataService, Video) {
                    zIndexPlayer();
                    $scope.video = Video;
                    $scope.report = {
                        name: '',
                        email: '',
                        body: '',
                        project_id: $scope.video.id,
                        video: $scope.video.url_id
                    };

                    $scope.cancel = function () {
                        zIndexPlayer(true);
                        $modalInstance.dismiss('cancel');
                    };

                    $scope.closeDialog = function () {
                        zIndexPlayer(true);
                        $modalInstance.close($scope.report);
                    };
                }]
            });

            modalInstance.result.then(function (report) {
                DataService.action('Flag', 'Send Flag Email', report).then(function () {
                    $rootScope.toastMessage('Your Report has been Sent');
                });
            }, function () {
                // console.info('Modal dismissed at: ' + new Date());
            }).then(function () {
                $timeout(function () {
                    // console.log('remove is-reveal-open');
                    jQuery('body').removeClass('is-reveal-open')
                }, 500);
            });
        };

        function zIndexPlayer(remove) {
            var vidDiv = jQuery('.flex-video');
            !!remove ? vidDiv.css('z-index', '') : vidDiv.css('z-index', 0);
        }

        //Lets begin
        init(self.film);
    }

    VideoCritiqueCtrl.$inject = ['$rootScope', '$scope', 'Critique', 'UserActions', 'DataService'];
    function VideoCritiqueCtrl($rootScope, $scope, Critique, UserActions, DataService) {
        var self = this;
        // Fetch Critique
        var init = function (critique) {
            self.critique = critique;
            //get project w/ owner
            DataService.query('getProjectById', {id: critique.project}, false).then(function (res) {
                // console.log(res);
                self.project = res.data[0];
            });

            $scope.commentsParent = self.critique;
            // console.log('Critique: ', critique);
            //self.loaded = true;
            //$scope.$broadcast('scroll.refreshComplete');

            // Fetch Comments
            DataService.query('getCritiqueComments', {id: self.critique.id}).then(function (result) {
                // console.log("Comments: ", result.data);
                self.comments = result;
            });

        };
        init(Critique.data[0]);
    }

    VideoCritiqueEditCtrl.$inject = ['$rootScope', '$scope', 'DataService', '$state', 'Critique'];
    function VideoCritiqueEditCtrl($rootScope, $scope, DataService, $state, Critique) {
        $scope.critique = Critique.data[0];
        $scope.ratingMax = 10;
        $scope.makePrivateHelp = false;

        $scope.editedCritique = angular.copy($scope.critique);
        $scope.editedCritique.private = $scope.editedCritique.private === 1 || $scope.editedCritique.private === true ;

        DataService.getList('Award', '', '', 50)
            .then(function (result) {
                $scope.awardsList = result.data;
            });


        $scope.update = function () {
            $scope.editedCritique.editedAt = moment().toDate();
            $scope.editedCritique.private = !!$scope.editedCritique.private;
            DataService.update('Critique', $scope.critique.id, $scope.editedCritique).then(function (res) {
                    $rootScope.toastMessage('Critique Updated');
                    /*if ($state.is('profile_critique-edit'))
                     $state.go('profile_critiqueselfid: self.critique.id});*/
                    if ($state.is('video_critique-edit'))
                        $state.go('video_critique', {
                            video_url_id: $rootScope.$stateParams.video_url_id, url_id: $scope.critique.url_id
                        });
                }, function (err) {
                    // console.log(err);
                    $rootScope.toastMessage('Something went wrong...')
                }
            )
        };

        $scope.starArray = angular.copy([{"num": 0}, {"num": 1}, {"num": 2}, {"num": 3}, {"num": 4}, {"num": 5}, {"num": 6}, {"num": 7}, {"num": 8}, {"num": 9}, {"num": 10}].reverse());

        $scope.hoveringOver = function (value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
        };

        $scope.calcOverall = function () {
            $scope.editedCritique.overall = ($scope.editedCritique.originality + $scope.editedCritique.direction + $scope.editedCritique.writing +
                $scope.editedCritique.cinematography + $scope.editedCritique.performances + $scope.editedCritique.production +
                $scope.editedCritique.pacing + $scope.editedCritique.structure + $scope.editedCritique.audio + $scope.editedCritique.music) / 10;
        };

        $scope.$watchCollection('editedCritique', function () {
            $scope.calcOverall();
        });
    }

    ProfileCtrl.$inject = ['$rootScope', 'DataService', 'User', 'UserStats', 'AuthService', '$modal', '_'];
    function ProfileCtrl($rootScope, DataService, User, UserStats, AuthService, $modal, _) {
        $rootScope.metadata.title = 'Profile';
        var self = this;
        self.user = User.data;
        self.userStats = UserStats.data[0];
        self.updateAvatar = _.throttle(updateAvatar, 1000);
        self.updateCoverPhoto = _.throttle(updateCoverPhoto, 1000);

        self.getEmoticonByEmotion = function (emotion) {
            var reactions = $rootScope.generateReactions();
            return _.findWhere(reactions, {emotion: emotion});
        };

        self.generatePublicId = function (type) {
            return self.user.url_id + '_' + type + '_' + moment().valueOf();
        };

        function updateAvatar(file, message, flow) {
            self.user.avatar = JSON.parse(message).secure_url;
            AuthService.updateUser(self.user).then(function (res) {
                // console.log(res);
                $rootScope.toastMessage('Avatar Updated!');
            });
        }

        function updateCoverPhoto(file, message, flow) {
            self.user.coverPhoto = JSON.parse(message).secure_url;
            AuthService.updateUser(self.user).then(function (res) {
                // console.log(res);
                $rootScope.toastMessage('Cover Photo Updated!');
            });
        }

    }

    ProfileUploadController.$inject = ['$rootScope', '$state', 'User', '$http', 'DataService', 'UtilsService', '$window', 'filepickerService', '_'];
    function ProfileUploadController($rootScope, $state, User, $http, DataService, UtilsService, $window, filepickerService, _) {
        var self = this;
        self.user = User.data;
        self.uploadType = 2;
        self.newVideo = {
            name: '',
            description: '',
            director: '',
            writer: '',
            producers: '',
            keyCast: '',
            language: '00000000-0000-6b6e-4371-305344643451',
            completionDate: '',
            filmingCountry: undefined,
            originCountry: undefined,
            owner: $rootScope.AppData.User.userId,
            genres: [],
            type: undefined,
            runTime: 0,
            thumbnail_url: '',
            hosting_type: undefined,
            video_url: '',
            tags: '',
            unlist: false,
            disableComments: false,
            disableCritique: false,
            nsfw: false,
            copyrightOwner: false
        };
        self.genresArr = [];

        self.runtime = {
            hours: 0,
            mins: 0,
            secs: 0
        };

        self.maxDate = moment().toDate();

        self.selectedGenre = null;

        $rootScope.generateGenres().then(function (res) {
            $rootScope.genresList = self.genresList = res;
        });
        $rootScope.generateTypes().then(function (res) {
            $rootScope.typesList = self.typesList = res;
        });
        $rootScope.generateCountries().then(function (res) {
            $rootScope.countryList = self.countryList = res;
        });
        $rootScope.generateLanguages().then(function (res) {
            $rootScope.languageList = self.languageList = res;
        });

        self.runtimeToSeconds = function () {
            self.newVideo.runTime = (self.runtime.hours * 3600) + (self.runtime.mins * 60) + self.runtime.secs;
        };

        self.isURL = function (str) {
            var urlRegex = '[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)';
            var url = new RegExp(urlRegex, 'i');
            return str.length < 2083 && url.test(str);
        };

        self.getThumbnailUrl = function (url) {
            if (url != null && url != '') {
                if (url.indexOf('youtu') != -1) {
                    var video_id = url.indexOf('v=') != -1 ? url.split('v=')[1].split('&')[0] : url.split('be/')[1];
                    self.newVideo.hosting_type = 'youtube';
                    self.newVideo.hosting_id = video_id;
                    return self.newVideo.thumbnail_url = 'http://img.youtube.com/vi/' + video_id + '/hqdefault.jpg';
                } else if (url.indexOf('vimeo') != -1) {
                    var video_id = url.split('.com/')[1];
                    self.newVideo.hosting_type = 'vimeo';
                    self.newVideo.hosting_id = video_id;
                    $http.jsonp('https://api.vimeo.com/videos/' + video_id + '/pictures.json?callback=JSON_CALLBACK').then(function (res) {
                        //$http.jsonp('http://www.vimeo.com/api/v2/video/' + video_id + '.json?callback=JSON_CALLBACK').then(function (res) {
                        return self.newVideo.thumbnail_url = angular.isDefined(res.data[0].sizes[6])
                            ? res.data[0].sizes[6] : angular.isDefined(res.data[0].sizes[5])
                            ? res.data[0].sizes[5] : angular.isDefined(res.data[0].sizes[4])
                            ? res.data[0].sizes[4] : res.data[0].sizes[3];
                    });
                } else if (url.indexOf('dailymotion') != -1) {
                    var video_id = url.split('video/')[1].split('_')[0];
                    self.newVideo.hosting_type = 'dailymotion';
                    self.newVideo.hosting_id = video_id;
                    $http.get('https://api.dailymotion.com/video/' + video_id + '?fields=thumbnail_large_url').then(function (res) {
                        return self.newVideo.thumbnail_url = res.data.thumbnail_large_url;
                    });
                } else if (url.indexOf('youku') != -1) {
                    self.newVideo.hosting_type = 'youku';
                    self.newVideo.hosting_id = undefined;

                } else if (url.indexOf('vine') != -1) {
                    self.newVideo.hosting_type = 'vine';
                    self.newVideo.hosting_id = undefined;
                    $http.get('/alpha/utils/get-vine-data.php?url=' + url).then(function (res) {
                        return self.newVideo.thumbnail_url = res.data;
                    });
                }
            }
        };

        self.validateNewVideoForm = function () {
            var test = true;
            var msg = 'Your project is missing:';
            if (!self.newVideo.name.length) {
                msg += 'Project Title, ';
                $rootScope.toastMessage();
                test = false;
            }
            if (self.uploadType == 2 && !self.newVideo.video_url.length) {
                msg += 'Video URL, ';
                test = false;
            }
            if (angular.isUndefined(self.genresArr) || (angular.isArray(self.genresArr) && !self.genresArr.length)) {
                msg += 'Genres, ';
                test = false;
            }
            if (angular.isUndefined(self.newVideo.type)) {
                msg += 'Type, ';
                test = false;
            }
            if (angular.isUndefined(self.newVideo.language)) {
                msg += 'Language, ';
                test = false;
            }
            if (self.newVideo.runTime == 0) {
                msg += 'Duration';
                test = false;
            }
            if (!test) {
                $rootScope.toastMessage(msg);
                alert(msg);
            }
            return test;
        };

        self.syncGenres = function (bool, item) {
            if (bool) {
                // add item
                self.genresArr.push(item);
            } else {
                // remove item
                for (var i = 0; i < self.genresArr.length; i++) {
                    if (self.genresArr[i].id == item.id) {
                        self.genresArr.splice(i, 1);
                    }
                }
            }
        };

        self.isCheckedGenre = function (id) {
            var match = false;
            for (var i = 0; i < self.genresArr.length; i++) {
                if (self.genresArr[i].id == id) {
                    match = true;
                }
            }
            return match;
        };

        self.submitNewVideo = function () {
            if (!!self.validateNewVideoForm()) {
                    if (angular.isArray(self.genresArr) && self.genresArr.length) {
                        _.each(self.genresArr, function (a) {
                            self.newVideo.genres.push({genre: a.id});
                        });
                    }

                var filmParams = {
                    urlId: moment().valueOf(),
                    name: self.newVideo.name,
                    description: self.newVideo.description,
                    director: self.newVideo.director,
                    writer: self.newVideo.writer,
                    producers: self.newVideo.producers,
                    keyCast: self.newVideo.keyCast,
                    completionDate: moment(self.newVideo.completionDate).toDate(),
                    owner: self.newVideo.owner,
                    runTime: self.newVideo.runTime,
                    video_url: self.newVideo.video_url,
                    thumbnail_url: self.newVideo.thumbnail_url,
                    hosting_type: self.newVideo.hosting_type,
                    hosting_id: self.newVideo.hosting_id,
                    tags: self.newVideo.tags,
                    disableComments: self.newVideo.disableComments || false,
                    disableCritique: self.newVideo.disableCritique || false,
                    language: self.newVideo.language,
                    filmingCountry: self.newVideo.filmingCountry,
                    originCountry: self.newVideo.originCountry,
                    type: self.newVideo.type,
                    unlist: self.newVideo.unlist,
                    nsfw: self.newVideo.nsfw,
                    copyrightOwner: self.newVideo.copyrightOwner
                };
                DataService.save('Project', filmParams, true, true)
                    .then(function (film) {
                        // add genres after create
                        DataService.update('Project', film.data.id, {genres: self.newVideo.genres}, true);
                        $rootScope.toastMessage('Video Uploaded Successfully');
                        // register Action
                        UtilsService.recordActivity(film, 'upload');
                        $state.go('video', {url_id: film.data.url_id});
                        return film;
                    }, function (err) {
                        // console.log(err);
                        alert('Failed to create new video, with error: ' + err.message);
                    });

            } else {
                $rootScope.toastMessage('Please check the form!');
            }
        };

        self.uploadArtwork = function (message) {
            self.newVideo.thumbnail_url = JSON.parse(message).secure_url;
        };

        self.files = []; //JSON.parse($window.localStorage.getItem('files') || '[]');

        self.pickFile = function (){

            filepickerService.pick(
                {
                    mimetype: 'video/*'
                },
                self.onSuccess
            );
        };

        self.onSuccess = function (Blob){
            self.newVideo.hosting_type = 'cdn';
            self.newVideo.video_url = Blob.url;
            self.files.push(Blob);
            $window.localStorage.setItem('files', JSON.stringify(self.files));
        };
    }

    ProfileVideoEditCtrl.$inject = ['$rootScope', '$state', '$modal', 'UserActions', 'Project', 'DataService', 'anchorSmoothScroll', '_'];
    function ProfileVideoEditCtrl($rootScope, $state, $modal, UserActions, Project, DataService, anchorSmoothScroll, _) {
        var self = this;
        self.project = Project.data;
        self.uploadType = 2;
        self.genresArr = self.project.genres;
        self.saveComplete = false;
        self.editedProject = angular.copy(self.project);
        angular.extend(self.editedProject, {
            type: self.project.type.id,
            language: self.project.language.id,
            filmingCountry: self.project.filmingCountry.id,
            completionDate: moment(self.project.completionDate).year()
        });
        // console.log(self.editedProject);

        if (self.project.runTime) {
            var totalSeconds = self.project.runTime;
            self.runtime = {};
            self.runtime.hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            self.runtime.mins = Math.floor(totalSeconds / 60);
            self.runtime.secs = totalSeconds % 60;
        }

        if (angular.isString(self.project.video_url)) {
            self.uploadType = 2;
        }

        $rootScope.generateGenres().then(function (res) {
            $rootScope.genresList = self.genresList = res;
        });
        $rootScope.generateTypes().then(function (res) {
            $rootScope.typesList = self.typesList = res;
        });
        $rootScope.generateCountries().then(function (res) {
            $rootScope.countryList = self.countryList = res;
        });
        $rootScope.generateLanguages().then(function (res) {
            $rootScope.languageList = self.languageList = res;
        });

        self.syncGenres = function (bool, item) {
            if (bool) {
                // add item
                DataService.save('Genres', {project: self.editedProject.id, genre: item.id}, true, true)
                    .then(function (res) {
                        self.genresArr.push(res.data);
                    });
            } else {
                // remove item
                for (var i = 0; i < self.genresArr.length; i++) {
                    if (self.genresArr[i].genre.id == item.id) {
                        DataService.delete('Genres', self.genresArr[i].id);
                        self.genresArr.splice(i, 1);
                    }
                }
            }
        };

        self.isCheckedGenre = function (id) {
            var match = false;
            for (var i = 0; i < self.genresArr.length; i++) {
                if (self.genresArr[i].genre.id == id) {
                    match = true;
                }
            }
            return match;
        };

        self.runtimeToSeconds = function () {
            self.editedProject.runTime = self.project.runTime = (self.runtime.hours * 3600) + (self.runtime.mins * 60) + self.runtime.secs;
        };

        self.isURL = function (str) {
            var urlRegex = '[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)';
            var url = new RegExp(urlRegex, 'i');
            return str.length < 2083 && url.test(str);
        };

        self.getThumbnailUrl = function (url) {
            if (url != null && url != '') {
                if (url.indexOf('youtu') != -1) {
                    var video_id = url.split('v=')[1].split('&')[0];
                    return self.editedProject.thumbnail_url = self.project.thumbnail_url = 'http://img.youtube.com/vi/' + video_id + '/mqdefault.jpg';
                } else if (url.indexOf('vimeo') != -1) {
                    var video_id = url.split('.com/')[1];
                    $http.jsonp('http://www.vimeo.com/api/v2/video/' + video_id + '.json?callback=JSON_CALLBACK').then(function (res) {
                        return self.editedProject.thumbnail_url = self.project.thumbnail_url = res.data[0].thumbnail_large;
                    });
                } else if (url.indexOf('dailymotion') != -1) {
                    var video_id = url.split('video/')[1].split('_')[0];
                    $http.get('https://api.dailymotion.com/video/' + video_id + '?fields=thumbnail_large_url').then(function (res) {
                        return self.editedProject.thumbnail_url = self.project.thumbnail_url = res.data.thumbnail_large_url;
                    });
                } else if (url.indexOf('youku') != -1) {

                } else if (url.indexOf('vine') != -1) {
                    $http.get('/alpha/utils/get-vine-data.php?url=' + url).then(function (res) {
                        return self.editedProject.thumbnail_url = self.project.thumbnail_url = res.data;
                    });
                }
            }
        };

        self.uploadArtwork = function (message) {
            self.editedProject.thumbnail_url = JSON.parse(message).secure_url;
        };

        self.updateProject = function () {
            self.editedProject.completionDate = moment().year(self.editedProject.completionDate).toDate();
            DataService.update('Project', self.editedProject.id, self.editedProject, false, true)
                .then(function (res) {
                    // console.log(res);
                    self.saveComplete = true;
                    // anchorSmoothScroll.scrollTo('success');
                    $rootScope.toastMessage('Video Updated');
                    $state.go('profile.videos');
                });
        };

        /*self.deleteProject = function (ev) {
         if ($rootScope.AppData.User && ($rootScope.AppData.User.userId === self.project.owner.id)) {
         var confirm = $modal.confirm()
         .title('Would you like to delete your project?')
         //.content('All of the banks have agreed to <span class="debt-be-gone">forgive</span> you your debts.')
         //.ariaLabel('Lucky day')
         .targetEvent(ev)
         .ok('Delete it!')
         .cancel('Never mind');
         $modal.show(confirm).then(function () {
         //self.project.set('disableProject', true);
         self.project.destroy({
         success: function (myObject) {
         // The object was deleted from the Parse Cloud.
         $state.go('profile');
         },
         error: function (myObject, error) {
         // The delete failed.
         // error is a Parse.Error with an error code and message.
         }
         });
         $state.go('profile');
         }, function () {
         //$scope.status = 'You decided to keep your debt.';
         });
         }
         }*/

    }

    ProfilePlaylistsController.$inject = ['$rootScope', 'DataService', 'User', 'Playlists', 'UserActions', '_', '$interval', '$http'];
    function ProfilePlaylistsController($rootScope, DataService, User, Playlists, UserActions, _, $interval, $http) {
        var self = this;
        self.user = User.data;
        self.playlists = Playlists.data;
        self.playlistItems = [];
        var hasFave = _.findWhere(self.playlists, {name: 'Favorites', private: true});
        self.selectedPlaylist = !!hasFave ? hasFave.id : self.playlists.data.length ? self.playlists.data[0].id : null;

        self.loadPlaylistItems = function () {
            DataService.query('getUserPlaylistItems', {id: self.selectedPlaylist, userId: self.user.id})
                .then(function (res) {
                    // console.log(res);
                    self.playlistItems = res.data;
                })
        };

        self.removeItem = function (id) {
            UserActions.checkAuth().then(function (res) {
                if (res) {
                    DataService.delete('PlaylistItem', id).then(function () {
                        return self.playlists = _.reject(self.playlists.data, function (a) {
                            return a.id === id;
                        });
                    })
                }
            });
        };

        // autoload if preselect
        if (angular.isString(self.selectedPlaylist)) {
            self.loadPlaylistItems();
        }

        if (self.user.id = "00000000-0000-6463-7952-633635765552") {
            /*// console.log('Executing function');

             $http.get('utils/allLeft.json').then(function (res) {
             var jsonData = res.data;
             var i = 0;
             $interval(function () {
             if (jsonData[i]) {
             DataService.save('Country', jsonData[i++],false);
             }
             }, 1000, jsonData.length)
             })*/
        }

    }

    ProfileSettingsController.$inject = ['$rootScope', 'AuthService', 'User', 'Genres', 'UserTypes', 'DataService', 'anchorSmoothScroll', '_', '$window'];
    function ProfileSettingsController($rootScope, AuthService, User, Genres, UserTypes, DataService, anchorSmoothScroll, _, $window) {
        var self = this;
        self.countries = [];
        self.genresArr = [];
        self.typesArr = [];
        self.saveComplete = false;
        self.updating = false;
        User.data.dob = moment(User.data.dob).startOf('day').toDate();
        self.user = User.data;
        self.genresArr = Genres.data.data;
        self.typesArr = UserTypes.data.data;
        self.updateUser = _.throttle(updateUser, 1000);
        var pwSetting = $window.localStorage.getItem('pwAllowPushNotifications');
        self.notificationsActive = pwSetting !== 'undefined' && !!JSON.parse(pwSetting);
        self.toggleNotifications = toggleNotifications;


        function toggleNotifications() {
            $window.localStorage.setItem('pwAllowPushNotifications', self.notificationsActive);

            if (!!self.notificationsActive) {
                // subscribe device push notifications
                if ($window.pwCanUseServiceWorkers() || angular.isDefined(window.safari)) {
                    if ($window.chrome && $window.pushwoosh.isBrowserChrome()) {
                        $window.pushwoosh.subscribeAtStart();
                    } else {
                        $window.pushwooshSubscribe();

                        $window.pushwooshSetTags({
                            userId: self.user.id,
                            urlId: self.user.url_id,
                            username: self.user.email,
                            firstName: self.user.firstName,
                            lastName: self.user.lastName
                        });
                    }

                }
            }
        }

        function updateUser() {
            if (!self.updating) {
                self.updating = true;
                AuthService.updateUser(self.user).then(function (res) {
                    // console.log(res);
                    self.saveComplete = true;
                    self.updating = false;
                    anchorSmoothScroll.scrollTo('success');
                    $rootScope.toastMessage('Profile Updated');
                });
            } else {
                $rootScope.toastMessage('Please wait...');
            }
        }

        $rootScope.generateCountries().then(function (res) {
            self.countries = res;
        });

        $rootScope.generateGenres().then(function (res) {
            self.genresList = res;
        });

        $rootScope.generateTypes().then(function (res) {
            self.typesList = res;
        });

        self.syncGenres = function (bool, item) {
            if (bool) {
                // add item
                self.genresArr.push(item);
                DataService.save('Genres', {user: self.user.id, genre: item.id});
            } else {
                // remove item
                for (var i = 0; i < self.genresArr.length; i++) {
                    if (self.genresArr[i].genre == item.id) {
                        DataService.delete('Genres', self.genresArr[i].id);
                        self.genresArr.splice(i, 1);
                    }
                }
            }
        };

        self.isCheckedGenre = function (id) {
            var match = false;
            for (var i = 0; i < self.genresArr.length; i++) {
                if (self.genresArr[i].genre == id) {
                    match = true;
                }
            }
            return match;
        };

        self.syncTypes = function (bool, item) {
            if (bool) {
                // add item
                self.typesArr.push(item);
                DataService.save('UserTypes', {user: self.user.id, type_id: item.id, type_name: item.name});
            } else {
                // remove item
                for (var i = 0; i < self.typesArr.length; i++) {
                    if (self.typesArr[i].type_id == item.id) {
                        DataService.delete('UserTypes', self.typesArr[i].id);
                        self.typesArr.splice(i, 1);
                    }
                }
            }
        };

        self.isCheckedType = function (id) {
            var match = false;
            for (var i = 0; i < self.typesArr.length; i++) {
                if (self.typesArr[i].type_id == id) {
                    match = true;
                }
            }
            return match;
        };

    }

    UserCtrl.$inject = ['$rootScope', 'DataService', 'User', 'UserStats', '$state', 'UserActions', '$modal', '_'];
    function UserCtrl($rootScope, DataService, User, UserStats, $state, UserActions, $modal, _) {
        var self = this;
        self.user = User;
        self.userStats = UserStats.data[0];
        $rootScope.metadata.title = 'Profile: ' + self.user.firstName + ' ' + self.user.lastName;

        self.showMessageDialog = function () {
            ContactUserDialogController.$inject = ['$rootScope', '$scope', '$modalInstance', 'UserActions', 'DataService', 'UtilsService', 'recipient', '$timeout'];
            function ContactUserDialogController($rootScope, $scope, $modalInstance, UserActions, DataService, UtilsService, recipient, $timeout) {


                $scope.recipient = recipient;
                $scope.model = {
                    myMessage: null
                };

                $scope.postMessage = function () {
                    UserActions.checkAuth().then(function (res) {
                        if (res) {
                            // create new conversation
                            DataService.save('Conversation', {
                                url_id: moment().valueOf(),
                                subject: $rootScope.AppData.User.fullName + ', ' + $scope.recipient.firstName + ' ' + $scope.recipient.lastName
                            }, true, true).then(function (convo) {
                                    // Add Participants
                                    DataService.save('Participant', {user: $rootScope.AppData.User.userId, conversation: convo.data.id});
                                    DataService.save('Participant', {user: $scope.recipient.id, conversation: convo.data.id});
                                    //Send Message
                                    DataService.save('Message', {body: $scope.model.myMessage, from: $rootScope.AppData.User.userId, conversation: convo.data.id});

                                    $scope.model.myMessage = null;
                                    $rootScope.toastMessage('Message sent!');
                                    // register Action
                                    //result.participants = $scope.recipient;
                                    UtilsService.recordActivity(convo, 'message');
                                    $scope.closeDialog();

                                    // Creates Duplicate entry Error
                                    /*DataService.update('Conversation', convo.data.id, {
                                        id: convo.data.id,
                                        participants: [
                                            {user: $rootScope.AppData.User.userId},
                                            {user: $scope.recipient.id}
                                        ],
                                        messages: [
                                            {body: $scope.model.myMessage, from: $rootScope.AppData.User.userId}
                                        ]
                                    }, true, true).then(function (convo) {

                                    });*/
                            });
                        }
                    }, function (err) {
                        $rootScope.toastMessage('Message failed. Please log in!');
                        //UserActions.loginModal();
                    });
                };

                $scope.closeDialog = function () {
                    $modalInstance.close(true);
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

            }

            UserActions.checkAuth().then(function (res) {
                if (res) {
                    $modal.open({
                        templateUrl: './src/common/contactUserDialog.html',
                        resolve: {
                            recipient: function () {
                                return self.user;
                            }
                        },
                        controller: ContactUserDialogController
                    });
                }
            }, function (err) {
                UserActions.loginModal();
            });
        };
    }

    UserAboutController.$inject = ['$rootScope', 'DataService', 'User', '$state', 'UserActions'];
    function UserAboutController($rootScope, DataService, User, $state, UserActions) {
        var self = this;
        self.user = User;
        // console.log(self.user);
    }

    UserVideosController.$inject = ['$rootScope', 'DataService', 'User', 'Videos', '$modal', 'UserActions', '_'];
    function UserVideosController($rootScope, DataService, User, Videos, $modal, UserActions, _) {
        var self = this;
        self.user = User;
        self.projects = Videos.data;

        self.deleteProject = function (videoId) {
            UserActions.checkAuth().then(function (res) {
                if (res) {
                    var modalInstance = $modal.open({
                        templateUrl: './src/common/confirmDialog.html',
                        controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                            $scope.ok = function () {
                                $modalInstance.close(true);
                            };

                            $scope.cancel = function () {
                                $modalInstance.dismiss('cancel');
                            };
                        }],
                        size: Foundation.MediaQuery.atLeast('large') ? 'tiny' : 'small',
                        keyboard: true
                    });
                    modalInstance.result.then(function () {
                        DataService.delete('Project', videoId).then(function () {
                            self.projects = _.reject(self.projects.data, function (a) {
                                return a.id === videoId;
                            });
                        })

                    }, function () {
                        // console.info('Modal dismissed at: ' + new Date());
                    });
                }
            });
        }
    }

    UserCritiquesController.$inject = ['$rootScope', 'User', 'Critiques', 'Critiqued'];
    function UserCritiquesController($rootScope, User, Critiques, Critiqued) {
        var self = this;
        self.user = User;
        self.critiques = Critiques.data;
        self.critiqued = Critiqued.data;
    }

    UserReactionsController.$inject = ['$rootScope', 'User', 'Reactions', 'Reacted', '_'];
    function UserReactionsController($rootScope, User, Reactions, Reacted, _) {
        var self = this;
        self.user = User;
        self.reactions = Reactions.data;
        self.reacted = Reacted.data;

        self.getEmoticonByEmotion = function (emotion) {
            var reactions = $rootScope.generateReactions();
            return _.findWhere(reactions, {emotion: emotion});
        };

    }

    UserAwardsController.$inject = ['$rootScope', 'DataService', 'User', 'Awards', 'Nominations', 'Nominated'];
    function UserAwardsController($rootScope, DataService, User, Awards, Nominations, Nominated) {
        var self = this;
        self.user = User;
        self.awards = Awards.data;
        self.nominations = Nominations.data;
        self.nominated = Nominated.data;
    }

    EditProfileCtrl.$inject = ['$rootScope', '$scope', 'AuthService', 'DataService'];
    function EditProfileCtrl($rootScope, $scope, AuthService, DataService) {
        $rootScope.metadata.title = 'Edit Profile';

        var self = this;
        self.user = {
            email: $rootScope.AppData.UserData.email,
            usertag: $rootScope.AppData.UserData.usertag,
            first_name: $rootScope.AppData.UserData.first_name,
            last_name: $rootScope.AppData.UserData.last_name,
            bio: $rootScope.AppData.UserData.bio,
            avatar: $rootScope.AppData.UserData.avatar
        };
        self.socials = {
            facebook: false,
            twitter: false,
            google: false,
            instagram: false
        };

        self.getGenres = function () {
            $rootScope.generateGenres();
        };

        self.updateUser = function () {
            AuthService.updateUser(self.user).then(function (res) {
                // console.log(res);
                $rootScope.toastMessage('Profile Updated');
            });
        };

        self.updateAvatar = function (flow) {
            self.user.avatar = 'http://getindiewise.com/alpha/utils/files/' + flow.files[0].file.name;
            self.updateUser();
        }

    }

    MessagesCtrl.$inject = ['$rootScope', 'Conversations', 'DataService', '$modal', 'UserActions', 'UtilsService', '$q', '_'];
    function MessagesCtrl($rootScope, Conversations, DataService, $modal, UserActions, UtilsService, $q, _) {
        $rootScope.metadata.title = 'Messages';
        var self = this;
        self.conversations = Conversations.data;
        self.newMode = false;
        self.newConversation = newConversation;
        self.fetchConvos = fetchConvos;
        self.querySearch = querySearch;
        self.deleteConvo = deleteConvo;
        self.postReply = postReply;
        self.selectConvo = selectConvo;
        self.myReply = null;

        function selectConvo(convo) {
            self.newMode = false;
            self.selectedConvo = convo;
            self.currentParticipants = convo.participants;
            DataService.getList('Message', [{fieldName: 'createdAt', order: 'desc'}], [{
                fieldName: 'conversation', operator: 'in', value: convo.id
            }], 30, false, true).then(function (msgs) {
                // console.log('Messages: ', msgs.data);
                self.messages = msgs.data;
            });
        }

        function postReply() {
            UserActions.checkAuth().then(function (res) {
                if (res) {
                    DataService.save('Message', {
                        body: self.myReply,
                        conversation: self.selectedConvo.id,
                        from: $rootScope.AppData.User.userId
                    }, true, true).then(function (result) {
                        self.myReply = null;
                        // set relatedObjects users data
                        self.messages.relatedObjects.users[result.data.from.id] = result.data.from;
                        result.data.from = result.data.from.id;

                        self.messages.data.push(result.data);
                        // TODO: Send email notification
                        //result.participants
                        UtilsService.recordActivity(result.data, 'message');
                    });
                }
            }, function (err) {
                UserActions.loginModal();
            });
        }

        function newConversation() {
            self.newMode = true;
            self.newConvo = {
                participants: [],
                body: ''
            };

            self.postNewMsg = postNewMsg;

            function postNewMsg() {
                var newConvoObj = new Parse.Object("Conversation");
                // Create Conversation
                newConvoObj.save().then(function (convo) {

                    // Set Participants
                    self.newConvo.participants.push($rootScope.AppData.User.userId);
                    var relParticipants = convo.relation("participants");
                    relParticipants.add(self.newConvo.participants);
                    newConvoObj.save();

                    // Create Message
                    var message = new Parse.Object("Message");
                    message.set('body', self.newConvo.body);
                    message.set('parent', convo);
                    message.set('from', $rootScope.AppData.User.userId);
                    message.save().then(function (result) {
                        // Clear forms
                        self.myReply = null;
                        self.newConvo.body = null;

                        // Clear Conversation
                        self.selectedConvo = convo;
                        self.currentParticipants = self.newConvo.participants;
                        self.messages = [result];

                        // TODO: Send email notification
                        UtilsService.recordActivity(result);
                    }).then(function () {
                        // Update Conversations List
                        var convoDup = angular.copy(convo);
                        convoDup.participants = self.newConvo.participants;
                        convoDup.latest = self.messages;
                        self.convos.push(convoDup);

                        // Switch view to conversation
                        self.newMode = false;

                    });

                });
            }
        }

        /**
         * Search for contacts.
         */
        function querySearch(query) {
            var deferred = $q.defer();

            //Search user
            var searchUsersFirstName = new Parse.Query('User');
            searchUsersFirstName.notEqualTo("objectId", $rootScope.AppData.User.userId);
            _.each(query.split(' '), function (a) {
                searchUsersFirstName.startsWith('first_name', a);
                //searchUsersFirstName.matches('first_name', a);
            });
            var searchUsersLastName = new Parse.Query('User');
            searchUsersLastName.notEqualTo("objectId", $rootScope.AppData.User.userId);
            _.each(query.split(' '), function (a) {
                searchUsersLastName.startsWith('last_name', a);
                //searchUsersLastName.matches('last_name', a);
            });
            var searchUsers = new Parse.Query.or(searchUsersFirstName, searchUsersLastName);
            searchUsers.find().then(function (data) {
                _.each(data, function (a) {
                    a.name = a.first_name + ' ' + a.last_name;
                    a.image = a.avatar || './assets/img/avatar-1.png';
                    a.email = '     ';
                });
                // console.log(data);
                deferred.resolve(data);
            });

            return deferred.promise;
        }

        function fetchConvos() {
            DataService.query('getConversations', {
                userId: $rootScope.AppData.User.userId
            }).then(function (result) {
                self.conversations = result.data;
            });
        }

        function deleteConvo() {
            // TODO replacve confirm dialog
            var confirm = $modal.confirm()
                .title('Delete Conversation?')
                //.textContent('Are you sure you want to delete this conversation?')
                //.ariaLabel('Lucky day')
                //.targetEvent(ev)
                .ok('Yes')
                .cancel('No');
            $modal.show(confirm).then(function () {
                var me = $rootScope.AppData.User.userId;
                var message = new Parse.Object("Message");
                message.set('body', me.first_name + ' ' + me.last_name + " left the conversation...");
                message.set('parent', {
                    __type: "Pointer",
                    className: "Conversation",
                    objectId: self.selectedConvo.id
                });
                message.set('from', $rootScope.AppData.User.userId);
                message.save().then(function (result) {
                    var relParticipants = self.selectedConvo.relation("participants");
                    relParticipants.remove(me);

                    self.selectedConvo.set('updatedAt', moment().toDate());
                    self.selectedConvo.save().then(function () {
                        self.myReply = null;
                        self.messages = [];
                        self.newMode = false;
                        self.selectedConvo = null;
                        self.currentParticipants = null;

                        // Refresh List
                        fetchConvos()
                    });
                });
            }, function () {
            });
        }

        // Fetch Conversations, Participants, and Messages
    }

    NotificationsCtrl.$inject = ['$rootScope', 'UserActions', 'UtilsService', '_'];
    function NotificationsCtrl($rootScope, UserActions, UtilsService, _) {
        var self = this;
        self.refresh = function () {
            //$rootScope.getFlatNotificationsFeed();
        };

        self.markAllAsRead = function () {
            /*$rootScope.getNewToken('flat', $rootScope.AppData.User.userId).then(function (token) {
                var feed = window.StreamClient.feed('flat_notifications', $rootScope.AppData.User.userId, token);
                feed.get({limit: 20, mark_read: true}, function (a) {
                    _.each($rootScope.AppData.NotificationsFeed.list, function (n) {
                        n.is_read = true;
                    });
                    $rootScope.AppData.NotificationsFeed.unread = 0;
                })
            });*/
        };

        self.markAsRead = function (n) {
            /*$rootScope.getNewToken('flat', $rootScope.AppData.User.userId).then(function (token) {
                var feed = window.StreamClient.feed('flat_notifications', $rootScope.AppData.User.userId, token);
                feed.get({limit: 5, mark_read: [n.id]}, function (a) {
                    n.is_read = true;
                    --$rootScope.AppData.NotificationsFeed.unseen;
                    --$rootScope.AppData.NotificationsFeed.unread;
                    return n;
                })
            });*/
        };

        self.refresh();
    }

})
();