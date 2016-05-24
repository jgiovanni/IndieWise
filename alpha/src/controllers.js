(function () {
    'use strict';
    angular.module('IndieWise.controllers', [])
        // Auth Controllers
        .controller('SignInCtrl', SignInCtrl)
        .controller('ForgotPasswordCtrl', ForgotPasswordCtrl)
        .controller('RegisterCtrl', RegisterCtrl)
        // Profile Controllers
        .controller('ProfileCtrl', ProfileCtrl)
        .controller('ProfileAboutController', UserAboutController)
        .controller('ProfileVideosController', UserVideosController)
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
        .controller('EditProfileCtrl', EditProfileCtrl)
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
        .controller('VideoEditCtrl', VideoEditCtrl)
        .controller('VideoCritiqueCtrl', VideoCritiqueCtrl)
        .controller('VideoCritiqueEditCtrl', VideoCritiqueEditCtrl)
    ;

    RegisterCtrl.$inject = ['$rootScope', '$timeout', '$q', '$state', 'AuthService', 'ParseService'];
    function RegisterCtrl($rootScope, $timeout, $q, $state, AuthService, ParseService) {
        $rootScope.metadata.title = 'Register';
        var self = this;
        self.user = {
            email: '',
            password: '',
            passwordCheck: '',
            firstName: '',
            lastName: '',
            //selected_genres: ''
        };

        self.getGenres = function () {
            ParseService.genres();
        };

        self.getTypes = function () {
            if (!angular.isArray($rootScope.typesList))
                ParseService.types();
        };
        self.getCountries = function () {
            if (!angular.isArray($rootScope.countryList))
                ParseService.countries();
        };

        self.doRegister = function () {
            AuthService.createUser(self.user).then(function (res) {
                console.log('Success', res);
                //window.location.reload();
            }, function (res) {
                $scope.error = res.message;
                console.log('Failed', res);
            }).then(function () {
                // window.location.reload();
            })
        };

        self.authenticate = function (provider) {
            self.error = null;
            AuthService.socialLogin(provider, true).then(function (a) {
                $state.go('home', {reload: true});
                console.log(a);
            });
        };

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
        //console.log(self.providers);
        self.user = {
            email: '',
            password: ''
        };

        self.doLogin = function (redirect) {
            redirect = redirect || true;
            self.error = false;
            AuthService.login(self.user.email, self.user.password).then(function (res) {
                console.log('Success', res);
                if (redirect) {
                    //$state.go('home');
                }
            }, function (res) {
                self.error = res;
                console.log('Failed', res);
            }).then(function () {
            });
        };

        self.authenticate = function (provider) {
            self.error = null;
            AuthService.socialLogin(provider, false).then(function (a) {
                console.log(a);
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

        self.doPasswordReset = function () {
            AuthService.passwordReset(self.email).then(function (res) {
                console.log(res);
                $rootScope.toastMessage('Check your inbox for our email! Should be there soon.');
                //$state.go('sign_in');
            }, function (error) {
                $rootScope.toastMessage('Error: ' + error.message);
            });
        };
    }

    BodyCtrl.$inject = ['$rootScope', '$localForage', '$q', '$state', 'AuthService', '$mdToast', 'UserActions', '$sce', 'DataService'];
    function BodyCtrl($rootScope, $localForage, $q, $state, AuthService, $mdToast, UserActions, $sce, DataService) {
        var self = this;

        self.selected = null;
        //console.log($rootScope.$stateParams);
        $rootScope.AppData.searchText = decodeURIComponent($rootScope.$stateParams.q || '');
        self.selectedItem = '';

        self.notificationsTemplate = $sce.trustAsResourceUrl('src/directives/notification.html');
        self.newsletterRegister = newsletterRegister;

        self.getMatches = function (search) {
            var deferred = $q.defer();

            // Get matching search queries
            var terms = new Parse.Query('Search');
            terms.contains('term', search.toLowerCase());
            terms.find().then(function (res) {
                deferred.resolve(res);
            });

            return deferred.promise;
        };

        self.startSearch = function (text) {
            //console.log(text);
            if (text) {
                if (angular.isString(text)) {
                    // save search
                    DataService.getList('Search', [{fieldName: 'term', order: 'desc'}], [], 20, false, false, 1, text)
                        .then(function (response) {
                            debugger;
                        });
                    var query = new Parse.Query("Search");
                    query.equalTo('term', text.toLowerCase());
                    query.first().then(function (res) {
                        if (res) {
                            res.increment('count');
                            res.save();
                        } else {
                            var term = new Parse.Object("Search");
                            term.set('term', text.toLowerCase());
                            term.set('count', 0);
                            term.save();
                        }
                        // show results
                        self.toPage('results', {q: text});
                        if ($state.is('results')) {
                            $rootScope.$broadcast('search', text);
                        }
                    });
                }
                if (angular.isObject(text)) {
                    switch (text.className) {
                        case 'Film':
                            var term = new Parse.Object("Search");
                            term.set('term', text.name_lowercase);
                            term.set('count', 0);
                            term.save();
                            // show results
                            self.toPage('results', {q: text.name_lowercase});
                            break;
                        case 'Search':
                            // save search
                            text.increment('count');
                            text.save();
                            // show results
                            self.toPage('results', {q: text.term});
                            if ($state.is('results')) {
                                $rootScope.$broadcast('search', text.term);
                            }
                            break;
                    }
                }
            }
        };

        self.checkIfEnterKeyWasPressed = function ($event) {
            var keyCode = $event.which || $event.keyCode;
            if (keyCode === 13) {
                // initiate search
                self.startSearch($rootScope.AppData.searchText);
            }
        };

        $rootScope.generateGenres = function () {
            var deferred = $q.defer();

            DataService.getList('Genre', [], [], 300).then(function (result) {
                $rootScope.genresList = result.data;
                $localForage.setItem('genres', result.data);
                deferred.resolve(result.data);
            });
            return deferred.promise;
        };

        $rootScope.generateTypes = function () {
            var deferred = $q.defer();

            DataService.getList('Type', [], [], 300).then(function (result) {
                $rootScope.typesList = result.data.data;
                $localForage.setItem('types', result.data.data);
                deferred.resolve(result);
            });

            return deferred.promise;
        };

        $rootScope.generateCountries = function () {
            var deferred = $q.defer();

            DataService.getList('Country', [], [], 300).then(function (result) {
                deferred.resolve(result);
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

                {name: 'Empowered', emotion: 'Empowered', icon: 'happy'},
                {name: 'Cool', emotion: 'Cool', icon: 'happy'},
                {name: 'Pumped', emotion: 'Pumped', icon: 'happy'},
                {name: 'Turned On', emotion: 'Turned On', icon: 'happy'},
                {name: 'Proud', emotion: 'Proud', icon: 'happy'},
                {name: 'Disgusted', emotion: 'Disgusted', icon: 'annoyed'},
                {name: 'Sympathetic', emotion: 'Sympathetic', icon: 'happy'},
                {name: 'Overwhelmed', emotion: 'Overwhelmed', icon: 'happy'},
                {name: 'Passionate', emotion: 'Passionate', icon: 'happy'},
                {name: 'Thrilled', emotion: 'Thrilled', icon: 'happy'},
                {name: 'Loved', emotion: 'Loved', icon: 'happy'},
                {name: 'Thankful', emotion: 'Thankful', icon: 'happy'},
                {name: 'Appreciated', emotion: 'Appreciated', icon: 'happy'},
                {name: 'Romantic', emotion: 'Romantic', icon: 'love'},
                {name: 'Chill', emotion: 'Chill', icon: 'happy'},
                {name: 'Pissed Off', emotion: 'Pissed Off', icon: 'annoyed'},
                {name: 'Accomplished', emotion: 'Accomplished', icon: 'happy'},
                {name: 'Honored', emotion: 'Honored', icon: 'happy'},
                {name: 'Relaxed', emotion: 'Relaxed', icon: 'happy'},
                {name: 'Young', emotion: 'Young', icon: 'happy'},
                {name: 'Wild', emotion: 'Wild', icon: 'happy'},
                {name: 'Old', emotion: 'Old', icon: 'happy'},
                {name: 'Free', emotion: 'Free', icon: 'happy'},
                {name: 'Epic', emotion: 'Epic', icon: 'happy'},
                {name: 'Engaged', emotion: 'Engaged', icon: 'happy'},
                {name: 'Fired Up', emotion: 'Fired Up', icon: 'happy'},
                {name: 'Detached', emotion: 'Detached', icon: 'happy'},
                {name: 'Disconnected', emotion: 'Disconnected', icon: 'confused'},
                {name: 'Connected', emotion: 'Connected', icon: 'happy'},
                {name: 'Distant', emotion: 'Distant', icon: 'happy'},
                {name: 'Beautiful', emotion: 'Beautiful', icon: 'happy'},

                {name: 'Confident', emotion: 'confident', icon: 'happy'},
                {name: 'Positive', emotion: 'positive', icon: 'happy'},
                {name: 'Negative', emotion: 'negative', icon: 'annoyed'},
                {name: 'Heartbroken', emotion: 'heartbroken', icon: 'emotional'},
                {name: 'Silly', emotion: 'Silly', icon: 'hehe'},
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
            $mdToast.showSimple(msg);
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
            $rootScope.getNewToken('notification', $rootScope.AppData.User.userId).then(function (token) {
                var feed = window.StreamClient.feed('notification', $rootScope.AppData.User.userId, token);
                feed.get({limit: 5, mark_seen: true}, function (a) {
                    console.log(a);
                    _.each($rootScope.AppData.RawNotifications.list, function (n) {
                        n.is_seen = true;
                    });
                    $rootScope.AppData.RawNotifications.unseen = 0;
                })
            });
        };

        self.markAllAsRead = function () {
            $rootScope.getNewToken('notification', $rootScope.AppData.User.userId).then(function (token) {
                var feed = window.StreamClient.feed('notification', $rootScope.AppData.User.userId, token);
                feed.get({limit: 20, mark_read: true}, function (a) {
                    _.each($rootScope.AppData.RawNotifications.list, function (n) {
                        n.is_read = true;
                    });
                    $rootScope.AppData.RawNotifications.unread = 0;
                })
            });
        };

        self.markAsRead = function (n) {
            $rootScope.getNewToken('notification', $rootScope.AppData.User.userId).then(function (token) {
                var feed = window.StreamClient.feed('notification', $rootScope.AppData.User.userId, token);
                feed.get({limit: 5, mark_read: [n.id]}, function (a) {
                    n.is_read = true;
                    --$rootScope.AppData.RawNotifications.unseen;
                    --$rootScope.AppData.RawNotifications.unread;
                    return n;
                })
            });
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
                        // TODO alert confirmation
                        return self.notifyMe = {};
                    }
                }, function (err) {
                    console.log(err);
                });
        }
    }

    HomeCtrl.$inject = ['$rootScope', 'DataService', '$scope', '$q', '$modal', '$timeout', '$interval'];
    function HomeCtrl($rootScope, DataService, $scope, $q, $modal, $timeout, $interval) {
        var self = this;
        $rootScope.metadata.title = 'Home';

        self.refresh = function () {
            // Trending Videos
            DataService.getList("Film",
                [{fieldName: "reactionCount", order: "desc"}],
                [{fieldName: "unlist", operator: "is", value: false}],
                8, true, true, 1).then(function (result) {
                    self.trending = result.data;
                });

            // Highest Rated Videos
            DataService.getList("Film",
                [{fieldName: "iwRating", order: "desc"}],
                [{fieldName: "unlist", operator: "is", value: false}],
                8, true, true, 1).then(function (result) {
                    self.highestRated = result.data;
                });

            // Highest Awarded Videos
            DataService.getList("Film",
                [{fieldName: "awardCount", order: "desc"}],
                [{fieldName: "unlist", operator: "is", value: false}],
                8, true, true, 1).then(function (result) {
                    self.highestAwarded = result.data;
                });

            // Recent Videos
            DataService.getList("Film",
                [{fieldName: "createdAt", order: "desc"}],
                [{fieldName: "unlist", operator: "is", value: false}],
                8, true, true, 1).then(function (result) {
                    self.recentFilms = result.data;
                });
        };
        self.refresh();
        self.refInterval = $interval(self.refresh, 60000);

        $scope.$on('$destroy', function () {
            $interval.cancel(self.refInterval);
        });
    }

    BrowseCtrl.$inject = ['$scope', '$rootScope', '$state', 'DataService', '$q', '$timeout', '$modal'];
    function BrowseCtrl($scope, $rootScope, $state, DataService, $q, $timeout, $modal) {
        $rootScope.metadata.title = 'Browse';
        var self = this;
        self.isOpen = false;
        self.selectedGenres = [];
        self.selectedTypes = [];
        self.films = [];
        self.arrs = {
            genres: [],
            types: []
        };
        self.filters = {
            sort: '',
            genres: [],
            types: []
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
                self.filters.sort = $rootScope.$stateParams.sort || 'recent';
                self.search(values[1], values[0], self.filters.sort);
            });
        };

        self.search = function (genres, types, filter) {
            if (genres && !genres.length)
                genres = self.arrs.genres;
            if (types && !types.length)
                types = self.arrs.types;

            var filterField = '';
            switch (filter) {
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

            DataService.getList('Film', [{fieldName: filterField, order: 'desc'}],
                [{fieldName: 'unlist', operator: 'equals', value: false}], 30, true, true, 1)
                .then(function (res) {
                    return self.films = res.data;
                });

            $scope.$broadcast('scroll.refreshComplete');
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

        self.filterBy = function (filter) {
            self.filters.sort = filter;
            self.search(self.selectedGenres, self.selectedTypes, filter);
        };

        self.openMenu = function ($mdOpenMenu, ev) {
            var originatorEv = ev;
            $mdOpenMenu(ev);
        };

        $scope.$watch('', function (newValue, oldValue) {

        });

        self.refresh();
    }

    LatestCtrl.$inject = ['$rootScope', 'DataService', '$timeout'];
    function LatestCtrl($rootScope, DataService, $timeout) {
        $rootScope.metadata.title = 'Latest';
        var self = this;

        DataService.getList('Reaction', [{fieldName: 'createdAt', order: 'desc'}], [], 5, true, true)
            .then(function (res) {
                self.reactions = res.data;
            });
        DataService.getList('Nomination', [{fieldName: 'createdAt', order: 'desc'}], [], 5, true, true)
            .then(function (res) {
                self.nominations = res.data;
            });
        DataService.getList('Critique', [{fieldName: 'createdAt', order: 'desc'}], [], 5, true, true)
            .then(function (res) {
                self.critiques = res.data;
            });

        $timeout(jQuery(document).foundation(), 0);
    }

    ResultsCtrl.$inject = ['$scope', '$rootScope', '$state', 'DataService', '$q', '$timeout', '$modal'];
    function ResultsCtrl($scope, $rootScope, $state, DataService, $q, $timeout, $modal) {
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
            obj: 'Film',
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
                //console.log(self);
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
            var p1 = DataService.getList('Film', [{fieldName: 'createdAt', order: 'desc'}],
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

        self.openMenu = function ($mdOpenMenu, ev) {
            var originatorEv = ev;
            $mdOpenMenu(ev);
        };

        $scope.$on('search', function (text) {
            self.refresh();
        });

        self.refresh();
        jQuery(document).foundation();
    }

    AdvancedResultsCtrl.$inject = ['$scope', '$rootScope', '$state', '$localForage', '$q', '$timeout', '$modal'];
    function AdvancedResultsCtrl($scope, $rootScope, $state, $localForage, $q, $timeout, $modal) {
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
                console.log($rootScope.$stateParams);
                if ($rootScope.$stateParams) {
                    self.advancedSearch();
                }
                //console.log(self);
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
            var filmQuery = new Parse.Query("Film");
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
            console.log(self.search);

            // Search Films
            var filmQuery = new Parse.Query("Film");
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

    VideoCtrl.$inject = ['$rootScope', '$scope', 'Project', '$modal', 'UserActions', 'UtilsService', 'DataService'];
    function VideoCtrl($rootScope, $scope, Project, $modal, UserActions, UtilsService, DataService) {
        var self = this;
        self.loaded = false;
        self.displayShare = false;
        self.toggleReactionsList = false;
        self.emotions = $rootScope.generateReactions();
        self.critiqueAverage = 0;
        self.activeTab = 'comments';
        self.isFaved = false;
        self.isSaved = false;
        self.playerResponsiveMode = false;

        self.film = Project.data;
        console.log(Project.data);
        function init(result) {
            $rootScope.currentTitle = result.name;
            //self.film = result;
            $scope.commentsParent = self.film;

            if (self.film.video_url.indexOf('youtu') != -1) {
                self.type = 'youtube';
            } else if (self.film.video_url.indexOf('vimeo') != -1) {
                self.type = 'vimeo';
            } else {
                self.type = 'other';
            }
            self.loaded = true;

            $rootScope.metadata = {
                title: result.name,
                description: result.description.substr(0, 150),
                image: result.thumbnail_url,
                url: window.location.href
            };
            //$scope.$broadcast('scroll.refreshComplete');


            // Fetch Genres
            /*var relGenres = self.film.relation("genres");
             relGenres.query().find().then(function (genres) {
             self.filmGenres = genres;
             });*/

            self.qComments();

            self.qReactions();

            self.qCritiques();

            self.qNominations();

            self.qWins();

            self.checkUserActions();
            // Fetch Awards Won

            // TODO: trigger after clicking play button
            $rootScope.initWatch = function () {
                UserActions.markAsWatched(self.film)
            };
            //self.activeWatch = UserActions.markAsWatched(self.film);

            $scope.$on('$destroy', function () {
                $rootScope.initWatch = undefined;
            });
            //UserActions.cancelWatched(self.activeWatch);

            self.test = function () {
                console.log('Clicked');
            };

            // Check Saved and Faved Status
            UserActions.checkFavorite(self.film).then(function (res) {
                self.isFaved = true;
            }, function (res) {
                self.isFaved = res;
            });
            UserActions.checkWatchLater(self.film).then(function (res) {
                self.isSaved = true;
            }, function (res) {
                self.isSaved = res;
            });
        }

        self.checkUserActions = function () {
            UserActions.canReact(self.film.id).then(function (res) {
                self.canReact = res;
            }, function (error) {
                self.canReact = error;
            });

            UserActions.canCritique(self.film.id).then(function (res) {
                console.log(res);
                self.canCritique = res;
            }, function (error) {
                console.log(error);
                self.canCritique = error;
            });

            UserActions.canRate(self.film.id).then(function (res) {
                console.log();
                self.canRate = res;
            }, function (error) {
                self.canRate = error;
            });
        };

        self.qComments = function () {
            // Fetch Comments
            DataService.getList("Comment", [{fieldName: "createdAt", order: "desc"}],
                [
                    {fieldName: "parentFilm", operator: "in", value: self.film.id},
                    {fieldName: "parentComment", operator: "in", value: ''}
                ],
                20, true, false, 1).then(function (result) {
                    self.comments = result.data;
                    console.log("comments: ", result.data);
                });
        };

        self.qReactions = function () {
            // Fetch Reactions
            DataService.getList("Reaction", [{fieldName: "createdAt", order: "desc"}],
                [{fieldName: "parent", operator: "in", value: self.film.id}],
                20, true, true, 1).then(function (result) {
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
            DataService.getList("Critique", [{fieldName: "createdAt", order: "desc"}],
                [{fieldName: "parent", operator: "in", value: self.film.id}],
                20, true, true, 1).then(function (result) {
                    self.critiques = result.data;
                    console.log('Critique: ', result.data);
                    self.calcIwAverage(self.critiques.data);
                });
        };

        self.qNominations = function () {
            DataService.getList('Nomination', [{fieldName: "createdAt", order: "desc"}],
                [{fieldName: "filmPntr", operator: "in", value: self.film.id}],
                20, true, true, 1).then(function (result) {
                    self.nominations = result.data;
                    console.log('Nomination: ', result.data);
                });
        };

        self.qWins = function () {
            DataService.getList('AwardWin', [{fieldName: "createdAt", order: "desc"}],
                [{fieldName: "film", operator: "in", value: self.film.id}],
                20, true, true, 1).then(function (result) {
                    self.wins = result.data;
                    console.log('AwardWin: ', result.data);
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

        self.rate = function (direction) {
            UserActions.checkAuth().then(function (res) {
                if (res) {
                    var actionVerb = 'like';
                    if (self.canRate === true) {
                        DataService.save('Rating', {
                            author: $rootScope.AppData.User.userId,
                            parent: self.film.id,
                            up: direction === 'up',
                            down: direction === 'down'
                        }, false, true).then(function (res) {
                            console.log(res);
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
                            UtilsService.recordActivity(res, actionVerb);
                            self.checkUserActions();
                        });

                    } else if (angular.isObject(self.canRate)) {
                        if (!!self.canRate.up && direction === 'up') {
                            DataService.delete('Rating', self.canRate.id).then(function (res) {
                                self.film.rateUpCount--;
                                self.updateVideoObj();
                                UtilsService.recordActivity(res, 'like');
                                self.checkUserActions();
                            });
                        } else if (!!self.canRate.down && direction === 'down') {
                            DataService.delete('Rating', self.canRate.id).then(function (res) {
                                self.film.rateDownCount--;
                                self.updateVideoObj();
                                UtilsService.recordActivity(res, 'unlike');
                                self.checkUserActions();
                            });
                        } else if ((!!self.canRate.down && direction === 'up') || (!!self.canRate.up && direction === 'down')) {
                            var up = false, down = false;
                            switch (direction) {
                                case 'up':
                                    up = true;
                                    self.film.rateUpCount++;
                                    self.film.rateDownCount--;
                                    break;
                                case 'down':
                                    down = true;
                                    self.film.rateUpCount--;
                                    self.film.rateDownCount++;
                                    actionVerb = 'unlike';
                                    break;
                            }
                            DataService.update('Rating', self.canRate.id, {
                                up: up,
                                down: down
                            }, false, true).then(function (res) {
                                self.updateVideoObj();
                                self.checkUserActions();
                                UtilsService.recordActivity(res.data, actionVerb);
                            });
                        }
                    }
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
                                parent: self.film.id,
                                emotion: emotion.emotion
                            }).then(function (resA) {
                                DataService.increment('Film', self.film.id, {reactionCount: 1}, true, true)
                                    .then(function (resB) {
                                        self.film = resB;
                                        UtilsService.recordActivity(resA, actionVerb);
                                        self.checkUserActions();
                                        self.qReactions();
                                    });
                            });
                        } else if (angular.isObject(self.canReact)) {
                            if (self.canReact.emotion !== emotion.emotion) {
                                DataService.update('Reaction', self.canReact.id, {
                                    emotion: emotion.emotion
                                }, false, true).then(function (resA) {
                                    self.canReact = resA.data;
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

        self.throttledRate = function (direction) {
            return _.throttle(self.rate(direction), 2000);
        };

        self.postMessage = function () {
            UserActions.checkAuth().then(function (res) {
                if (res) {
                    // create new conversation
                    DataService.save('Conversation', {
                        participants: [
                            {"__metadata": {id: $rootScope.AppData.User.userId}, id: $rootScope.AppData.User.userId},
                            {"__metadata": {id: self.film.owner.id}, id: self.film.owner.id}
                        ],
                        Message_parent: [
                            {
                                body: self.myMessage,
                                from: {
                                    "__metadata": {id: $rootScope.AppData.User.userId},
                                    id: $rootScope.AppData.User.userId
                                }
                            }
                        ]
                    }, true, true).then(function (result) {
                        debugger;
                        self.toggleMessageInput();
                        self.myMessage = null;
                        $rootScope.toastMessage('Message sent!');
                        // register Action
                        result.participants = self.film.owner;
                        UtilsService.recordActivity(result);

                    });

                    //message.set('to', {__type: "Pointer", className: "_User", objectId: self.film.owner.id});
                    //message.set('from', $rootScope.AppData.User.userId;
                }
            }, function (err) {
                UserActions.loginModal();
            });
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
                                // Decrement film critiqueCount
                                DataService.increment('Film', self.film.id, {nominationCount: -1});

                            });

                            DataService.delete('Critique', c.id).then(function () {
                                self.critiques = _.reject(self.critiques, function (a) {
                                    return a.id === c.id;
                                });
                                $rootScope.toastMessage('Your critique was deleted.');

                                // Decrement film critiqueCount
                                DataService.increment('Film', self.film.id, {critiqueCount: -1}, true, true)
                                    .then(function (a) {
                                        self.film = a;
                                    });

                                self.checkUserActions();
                            });
                        })
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    });
                }
            })
        };

        self.openCritiqueDialog = function ($event) {
            CritiqueDialogController.$inject = ['$scope', '$modalInstance', 'critique', '$q'];
            function CritiqueDialogController($scope, $modalInstance, critique, $q) {
                zIndexPlayer();
                $scope.critique = critique;
                $scope.ratingMax = 10;
                $scope.makePrivateHelp = false;

                DataService.getList('Award', '', '', 50)
                    .then(function (result) {
                        $scope.awardsList = result.data;
                    });

                $scope.dialogModel = {
                    awardId: null
                };

                $scope.nominated = {
                    awardPntr: $scope.dialogModel.awardId,
                    nominator: $rootScope.AppData.User.userId,
                    filmPntr: $scope.critique.parent,
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

                    /*if (!!$scope.dialogModel.awardId && angular.isString($scope.dialogModel.awardId)) {
                     // Critique with nomination
                     DataService.save('Critique', $scope.critique, false, true).then(function (res) {
                     var obj = res.data;
                     self.critiques.data.push(obj);

                     } else {
                     // Critique without nomination

                     }*/
                    DataService.save('Critique', $scope.critique, false, true).then(function (res) {
                        var obj = res.data;
                        self.critiques.data.push(obj);
                        self.calcIwAverage(self.critiques.data);
                        // Increment film critiqueCount
                        DataService.increment('Film', $scope.critique.parent, {critiqueCount: 1}, true, true)
                            .then(function (a) {
                                self.film = a;
                            });

                        // if an award has been selected, create a nomination
                        if (!!$scope.dialogModel.awardId && angular.isString($scope.dialogModel.awardId)) {
                            $scope.nominated.critique = obj.id;
                            $scope.nominated.awardPntr = $scope.dialogModel.awardId;
                            DataService.save('Nomination', $scope.nominated, true).then(function (nom) {
                                // Increment film commentCount
                                DataService.increment('Film', $scope.critique.parent, {nominationCount: 1}, true, true)
                                    .then(function (a) {
                                        self.film = a;
                                    });


                                // register Action
                                UtilsService.recordActivity(obj);
                            }, function (error) {
                                alert('Failed to create new nomination, with error code: ' + error.message);

                            })
                        } else {
                            // register Action
                            UtilsService.recordActivity(obj);
                        }
                    }, function (error) {
                        alert('Failed to create new critique, with error code: ' + error.message);

                    }).then(function () {
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
                                    parent: self.film.id
                                };
                            }
                        },
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
                    $scope.shareLink = window.location.origin + '/alpha/screen/' + Video.id;
                    $scope.cancel = function () {
                        zIndexPlayer(true);
                        $modalInstance.close();
                    };
                }]
            })
        };

        self.openReactionDialog = function () {
            UserActions.canReact(self.film.id).then(function (res) {
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
                                $modalInstance.close(e.originalObject);
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
                        console.info('Modal dismissed at: ' + new Date());
                    });
                }
            }, function (err) {
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
                    $scope.shareLink = window.location.origin + '/alpha/screen/' + Video.id;
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
            self.playerResponsiveMode = !self.playerResponsiveMode;
        };

        $rootScope.getNewToken('comment', 'all').then(function (token) {
            var feed2 = window.StreamClient.feed('comment', 'all', token);
            $scope.commentSubscribe = feed2.subscribe(function (obj) {
                var throttledWatch = _.throttle(self.qComments, 3000);
                throttledWatch();
                //console.log(obj);
            }).then(function (obj) {
                console.log(obj);
            }, function (err) {
                console.log(err);
            });
        });

        $scope.$on('$destroy', function (event) {
            //$scope.commentSubscribe.cancel();
        });

        self.updateVideoObj = function () {
            return DataService.getItem('Film', self.film.id, true, '', 2)
                .then(function (a) {
                    console.log('Film Updated: ', a);
                    self.film = a.data;
                });
        };

        function zIndexPlayer(remove) {
            var vidDiv = jQuery('.flex-video');
            !!remove ? vidDiv.css('z-index', '') : vidDiv.css('z-index', 0);
        }

        //Lets begin
        init(self.film);
    }

    VideoEditCtrl.$inject = ['$rootScope', '$state', '$modal', 'UserActions', 'Project', 'ParseService'];
    function VideoEditCtrl($rootScope, $state, $modal, UserActions, Project, ParseService) {
        var self = this;
        self.project = Project;
        self.editedProject = {
            name: self.project.name,
            name_lowercase: self.project.name_lowercase,
            //runTime: self.project.runTime,
            description: self.project.description,
            type: self.project.type,
            language: self.project.language,
            filmingCountry: self.project.filmingCountry,
            director: self.project.director,
            writer: self.project.writer,
            producers: self.project.producers,
            synopsis: self.project.synopsis,
            tags: self.project.tags,
            keyCast: self.project.keyCast,
            pastAwards: self.project.pastAwards,
            completionDate: self.project.completionDate,
            video_url: self.project.video_url,
            thumbnail_url: self.project.thumbnail_url,
            disableComments: self.project.disableComments,
            disableCritique: self.project.disableCritique,
            unlist: self.project.unlist,
            genres: [],
        };
        self.projectGenres = [];
        console.log(self);

        // Fetch Genres
        var relGenres = self.project.relation("genres");
        relGenres.query().find().then(function (genres) {
            self.editedProject.genres = self.projectGenres = _.pluck(genres, 'id');
        });

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

        self.getGenres = function () {
            ParseService.genres();
        };
        self.getTypes = function () {
            ParseService.types();
        };
        self.getCountries = function () {
            if (!angular.isArray($rootScope.countryList))
                ParseService.countries();
        };
        self.getLanguages = function () {
            if (!angular.isArray($rootScope.languageList))
                ParseService.languages();
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

        self.updateProject = function () {
            self.project.set('name', self.editedProject.name);
            self.project.set('name_lowercase', self.editedProject.name.toLowerCase());
            self.project.set('runTime', self.editedProject.runTime);
            self.project.set('description', self.editedProject.description);

            self.project.set('type', {__type: "Pointer", className: "Type", objectId: self.editedProject.type.id});
            self.project.set('language', {
                __type: "Pointer",
                className: "Language",
                objectId: self.editedProject.language.id
            });
            self.project.set('filmingCountry', {
                __type: "Pointer",
                className: "Country",
                objectId: self.editedProject.filmingCountry.id
            });
            self.project.set('director', self.editedProject.director);
            self.project.set('writer', self.editedProject.writer);
            self.project.set('producers', self.editedProject.producers);
            self.project.set('synopsis', self.editedProject.synopsis);
            self.project.set('completionDate', self.editedProject.completionDate);
            self.project.set('video_url', self.editedProject.video_url);
            self.project.set('thumbnail_url', self.editedProject.thumbnailUrl);
            self.project.set('disableComments', self.editedProject.disableComments || false);
            self.project.set('disableCritique', self.editedProject.disableCritique || false);
            self.project.set('unlist', self.editedProject.unlist || false);

            // first remove current genres
            var relation = self.project.relation("genres");
            var relationQ = relation.query().find({
                success: function (list) {
                    // list contains the posts that the current user likes.
                    relation.remove(list);
                    _.each(self.projectGenres, function (a) {
                        var Genre = Parse.Object.extend("Genre");
                        relation.add(new Genre({id: a}));
                    });

                    self.project.save().then(function (res1) {
                        $rootScope.toastMessage('Project Updated');
                        $state.go('video', {id: self.project.id});
                    });
                }
            });
        };

        self.deleteProject = function (ev) {
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
        }

    }

    VideoCritiqueCtrl.$inject = ['$rootScope', '$scope', 'Critique', 'UserActions', 'DataService'];
    function VideoCritiqueCtrl($rootScope, $scope, Critique, UserActions, DataService) {
        var self = this;
        // Fetch Critique
        var init = function (critique) {
            self.critique = critique.data;
            self.film = self.critique.parent;
            $scope.commentsParent = self.critique;
            console.log('Critique: ', critique);
            //self.loaded = true;
            //$scope.$broadcast('scroll.refreshComplete');

            // Fetch Comments
            DataService.getList('Comment', [], [
                {fieldName: 'parentCritique', operator: 'in', value: self.critique.id},
                {fieldName: "parentComment", operator: "in", value: ''}
            ], 20, true, false, 1).then(function (result) {
                console.log("Comments: ", result);
                self.comments = result.data;
            });

        };
        init(Critique);
    }

    VideoCritiqueEditCtrl.$inject = ['$rootScope', '$scope', '$state', 'Critique'];
    function VideoCritiqueEditCtrl($rootScope, $scope, $state, Critique) {
        var self = this;
        self.critique = Critique;
        self.editedCritique = {
            originality: self.critique.originality,
            direction: self.critique.direction,
            writing: self.critique.writing,
            cinematography: self.critique.cinematography,
            performances: self.critique.performances,
            production: self.critique.production,
            pacing: self.critique.pacing,
            structure: self.critique.structure,
            audio: self.critique.audio,
            music: self.critique.music,
            overall: self.critique.overall,
            private: self.critique.private,
            author: self.critique.author,
            body: self.critique.body,
            parent: self.critique.parent
        };

        self.update = function () {
            self.critique.set("originality", self.editedCritique.originality);
            self.critique.set("direction", self.editedCritique.direction);
            self.critique.set("writing", self.editedCritique.writing);
            self.critique.set("cinematography", self.editedCritique.cinematography);
            self.critique.set("performances", self.editedCritique.performances);
            self.critique.set("production", self.editedCritique.production);
            self.critique.set("pacing", self.editedCritique.pacing);
            self.critique.set("structure", self.editedCritique.structure);
            self.critique.set("audio", self.editedCritique.audio);
            self.critique.set("music", self.editedCritique.music);
            self.critique.set("overall", self.editedCritique.overall);
            self.critique.set("private", self.editedCritique.private);
            //self.critique.set("author", self.editedCritique.author);
            self.critique.set("body", self.editedCritique.body);
            self.critique.set("editedAt", new Date());
            //self.critique.set("parent", self.editedCritique.parent);
            self.critique.save().then(function (res) {
                $rootScope.toastMessage('Critique Updated');
                if ($state.is('profile_critique-edit'))
                    $state.go('profile_critique', {id: self.critique.id});
                if ($state.is('video_critique-edit'))
                    $state.go('video_critique', {video_id: $rootScope.$stateParams.video_id, id: self.critique.id});
            }, function (err) {
                console.log(err);
                $rootScope.toastMessage('Something went wrong...')
            })
        };

        self.starArray = angular.copy([{"num": 0}, {"num": 1}, {"num": 2}, {"num": 3}, {"num": 4}, {"num": 5}, {"num": 6}, {"num": 7}, {"num": 8}, {"num": 9}, {"num": 10}].reverse());

        self.cancelled = function () {
            if ($state.is('profile_critique-edit'))
                $state.go('profile_critique', {id: self.critique.id});
            if ($state.is('video_critique-edit'))
                $state.go('video_critique', {video_id: $rootScope.$stateParams.video_id, id: self.critique.id});
        };

        self.calcOverall = function () {
            self.editedCritique.overall = (self.editedCritique.originality + self.editedCritique.direction + self.editedCritique.writing +
                self.editedCritique.cinematography + self.editedCritique.performances + self.editedCritique.production +
                self.editedCritique.pacing + self.editedCritique.structure + self.editedCritique.audio + self.editedCritique.music) / 10;
        };
    }

    ProfileCtrl.$inject = ['$rootScope', 'DataService', 'User', '$state', '$modal'];
    function ProfileCtrl($rootScope, DataService, User, $state, $modal) {
        var self = this;
        self.user = User.data;
        $rootScope.metadata.title = 'Profile';

        //var innerQuery = new Parse.Query("Film");
        //innerQuery.equalTo("owner", $rootScope.AppData.User.userId);
        //innerQuery.notEqualTo("disableProject", true);
        //innerQuery.notEqualTo("unlist", true);

        // Fetch Projects
        /*DataService.getList("Film",
         [{fieldName: "createdAt", order: "desc"}],
         [{fieldName: "owner", operator: "in", value: $rootScope.AppData.User.userId}],
         20, false, false, 1).then(function (result) {
         self.projects = result.data;
         //console.log("projects: ", result.data);
         });*/

        // Fetch Favorites
        /*var favoritesQuery = new Parse.Query("Favorites");
         //query.matchesQuery("film", innerQuery);
         favoritesQuery.equalTo("user", $rootScope.AppData.User.userId);
         favoritesQuery.include(["project.owner", "project.type"]);
         favoritesQuery.descending("createdAt");
         favoritesQuery.find().then(function (result) {
         console.log(result);
         self.favorites = result;
         });*/
        /*DataService.getList("Favorites",
         [{fieldName: "createdAt", order: "desc"}],
         [{fieldName: "user", operator: "in", value: $rootScope.AppData.User.userId}],
         20, true, true, 1).then(function (result) {
         self.favorites = result.data;
         console.log("favorites: ", result.data);
         });


         // Fetch WatchLater
         var watchLaterQuery = new Parse.Query("WatchLater");
         //query.matchesQuery("film", innerQuery);
         watchLaterQuery.equalTo("user", $rootScope.AppData.User.userId);
         watchLaterQuery.include(["project.owner", "project.type"]);
         watchLaterQuery.descending("createdAt");
         watchLaterQuery.find().then(function (result) {
         console.log(result);
         self.watchlaters = result;
         });

         // Fetch My Critiques
         var critiqueQuery = new Parse.Query("Critique");
         critiqueQuery.equalTo('author', $rootScope.AppData.User.userId);
         critiqueQuery.include(['parent', 'author']);
         critiqueQuery.find().then(function (result) {
         self.myCritiques = result;
         });

         // Fetch My Critiqued
         var critiquedQuery = new Parse.Query("Critique");
         critiquedQuery.notEqualTo('author', $rootScope.AppData.User.userId);
         critiquedQuery.include(['parent', 'author']);
         critiquedQuery.matchesQuery("parent", innerQuery);
         critiquedQuery.find().then(function (result) {
         self.myCritiqued = result;
         });

         // Fetch My Reactions
         var reactionQuery = new Parse.Query("Reaction");
         reactionQuery.equalTo('user', $rootScope.AppData.User.userId);
         reactionQuery.include(['parent', 'user']);
         reactionQuery.find().then(function (result) {
         self.myReactions = result;
         });

         // Fetch My Reacted
         var reactedQuery = new Parse.Query("Reaction");
         reactedQuery.notEqualTo('user', $rootScope.AppData.User.userId);
         reactedQuery.include(['parent', 'user']);
         reactedQuery.matchesQuery("parent", innerQuery);
         reactedQuery.find().then(function (result) {
         self.myReacted = result;
         });

         var winQuery = new Parse.Query("AwardWin");
         //winQuery.equalTo('user', self.user);
         winQuery.include(['award', 'film']);
         winQuery.matchesQuery("film", innerQuery);
         winQuery.find().then(function (result) {
         self.myWins = result;
         });*/
        self.getEmoticonByEmotion = function (emotion) {
            var reactions = $rootScope.generateReactions();
            return _.findWhere(reactions, {emotion: emotion});
        };

        self.openMenu = function ($mdOpenMenu, ev) {
            var originatorEv = ev;
            $mdOpenMenu(ev);
        };

        self.toggleFavorite = function (video) {

        };

        self.toggleWatchLater = function (video) {

        };
    }

    ProfileUploadController.$inject = ['$rootScope', 'ParseService', '$state', 'User', '$http', 'DataService', 'UtilsService'];
    function ProfileUploadController($rootScope, ParseService, $state, User, $http, DataService, UtilsService) {
        var self = this;
        self.user = User.data;
        self.uploadType = 2;
        self.newVideo = {
            name: '',
            description: '',
            director: '',
            writer: '',
            producers: '',
            //synopsis: '',
            keyCast: '',
            language: '00000000-0000-6b6e-4371-305344643451',
            completionDate: '',
            filmingCountry: undefined,
            originCountry: undefined,
            owner: $rootScope.AppData.User.userId,
            genres: undefined,
            type: undefined,
            //pastAwards: '',
            runTime: 0,
            thumbnailUrl: '',
            video_file: undefined,
            video_url: '',
            tags: ''
        };

        self.runtime = {
            hours: 0,
            mins: 0,
            secs: 0
        };

        self.maxDate = moment().toDate();

        self.selectedGenre = null;

        DataService.getList('Genre', [], [], 300).then(function (res) {
            $rootScope.genresList = self.genresList = res.data.data;
        });
        DataService.getList('Type', [], [], 300).then(function (res) {
            $rootScope.typesList = self.typesList = res.data.data;
        });
        DataService.getList('Country', [], [], 300).then(function (res) {
            $rootScope.countryList = self.countryList = res.data.data;
        });
        DataService.getList('Language', [], [], 300).then(function (res) {
            $rootScope.languageList = self.languageList = res.data.data;
        });

        /*self.getGenres = function () {
         ParseService.genres();
         };

         self.getTypes = function () {
         ParseService.types();
         };

         self.getCountries = function () {
         if (!angular.isArray($rootScope.countryList))
         ParseService.countries();
         };

         self.getLanguages = function () {
         if (!angular.isArray($rootScope.languageList))
         ParseService.languages();
         };*/

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
                    return self.newVideo.thumbnailUrl = 'http://img.youtube.com/vi/' + video_id + '/mqdefault.jpg';
                } else if (url.indexOf('vimeo') != -1) {
                    var video_id = url.split('.com/')[1];
                    self.newVideo.hosting_type = 'vimeo';
                    self.newVideo.hosting_id = video_id;
                    $http.jsonp('https://api.vimeo.com/videos/' + video_id + '/pictures.json?callback=JSON_CALLBACK').then(function (res) {
                        //$http.jsonp('http://www.vimeo.com/api/v2/video/' + video_id + '.json?callback=JSON_CALLBACK').then(function (res) {
                        return self.newVideo.thumbnailUrl = res.data[0].sizes[3];
                    });
                } else if (url.indexOf('dailymotion') != -1) {
                    var video_id = url.split('video/')[1].split('_')[0];
                    self.newVideo.hosting_type = 'dailymotion';
                    self.newVideo.hosting_id = video_id;
                    $http.get('https://api.dailymotion.com/video/' + video_id + '?fields=thumbnail_large_url').then(function (res) {
                        return self.newVideo.thumbnailUrl = res.data.thumbnail_large_url;
                    });
                } else if (url.indexOf('youku') != -1) {
                    self.newVideo.hosting_type = 'youku';
                    self.newVideo.hosting_id = undefined;

                } else if (url.indexOf('vine') != -1) {
                    self.newVideo.hosting_type = 'vine';
                    self.newVideo.hosting_id = undefined;
                    $http.get('/alpha/utils/get-vine-data.php?url=' + url).then(function (res) {
                        return self.newVideo.thumbnailUrl = res.data;
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
            /*if (angular.isUndefined(self.newVideo.genres) || (angular.isArray(self.newVideo.genres) && !self.newVideo.genres.length)) {
             msg += 'Genres, ';
             test = false;
             }*/
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

        self.submitNewVideo = function () {
            if (!!self.validateNewVideoForm()) {
                var genresArr = [];
                if (angular.isArray(self.newVideo.genres) && self.newVideo.genres.length) {
                    _.each(self.newVideo.genres, function (a) {
                        genresArr.push(_.findWhere(self.genresList, {id: a})/*{__metadata: {id: a}}*/);
                    });
                }

                DataService.save('Film', {
                    urlId: moment().valueOf(),
                    name: self.newVideo.name,
                    description: self.newVideo.description,
                    director: self.newVideo.director,
                    writer: self.newVideo.writer,
                    producers: self.newVideo.producers,
                    synopsis: self.newVideo.synopsis,
                    completionDate: moment(self.newVideo.completionDate).toDate(),
                    owner: self.newVideo.owner,
                    runTime: self.newVideo.runTime,
                    video_url: self.newVideo.video_url,
                    thumbnail_url: self.newVideo.thumbnailUrl,
                    hosting_type: self.newVideo.hosting_type,
                    hosting_id: self.newVideo.hosting_id,
                    tags: self.newVideo.tags,
                    disableComments: self.newVideo.disableComments || false,
                    disableCritique: self.newVideo.disableCritique || false,
                    language: self.newVideo.language,
                    filmingCountry: self.newVideo.filmingCountry,
                    originCountry: self.newVideo.originCountry,
                    type: self.newVideo.type,
                    unlist: false,
                    genres: genresArr
                }, true, true).then(function (film) {
                    $state.go('video', {id: film.data.id});
                    $rootScope.toastMessage('Video Uploaded Successfully');
                    // register Action
                    UtilsService.recordActivity(film, 'upload');
                }, function (err) {
                    console.log(err);
                    alert('Failed to create new film, with error code: ' + err.message);
                });

            } else {
                $rootScope.toastMessage('Please check the form!');
            }
        };

        self.uploadArtwork = function (flow) {
            self.newVideo.thumbnailUrl = 'http://getindiewise.com/alpha/utils/files/' + flow.files[0].file.name;
            //self.updateUser();
        }
    }

    ProfileSettingsController.$inject = ['$rootScope', 'AuthService', 'User', '$state', 'UserActions'];
    function ProfileSettingsController($rootScope, AuthService, User, $state, UserActions) {
        var self = this;
        // Datetime to date fix
        User.data.dob = moment(User.data.dob).startOf('day').toDate();
        self.user = User.data;

        self.updateUser = function () {
            AuthService.updateUser(self.user).then(function (res) {
                console.log(res);
                $rootScope.toastMessage('Profile Updated');
            });
        };

        self.updateAvatar = function (flow) {
            self.user.avatar = 'http://getindiewise.com/alpha/utils/files/' + flow.files[0].file.name;
            self.updateUser();
        }
    }

    UserCtrl.$inject = ['$rootScope', 'DataService', 'User', '$state', 'UserActions', '$modal'];
    function UserCtrl($rootScope, DataService, User, $state, UserActions, $modal) {
        var self = this;
        self.user = User.data;
        $rootScope.metadata.title = 'Profile: ' + self.user.firstName + ' ' + self.user.lastName;

        // Fetch My Critiques
        /*DataService.getList('Critique', [{fieldName: "createdAt", order: "desc"}],
         [{fieldName: "author", operator: "in", value: self.user.id}], 20, true, true, 1)
         .then(function (result) {
         console.log(result.data);
         self.myCritiques = result.data;
         });*/

        // Fetch My Critiqued
        //DataService.getList('', [{fieldName: "createdAt", order: "desc"}],
        //    [{fieldName: "author", operator: "in", value: self.user.id}], 20, true, true, 1)
        //    .then(function (result) {
        //        console.log(result.data);
        //        self.myCritiqued = result.data;
        //    });
        //var critiquedQuery = new Parse.Query("Critique");
        //critiquedQuery.notEqualTo('author', self.user);
        //critiquedQuery.include(['parent', 'author']);
        //critiquedQuery.matchesQuery("parent", innerQuery);
        //critiquedQuery.find().then(function (result) {
        //    self.myCritiqued = result;
        //});

        // Fetch My Reactions
        //var reactionQuery = new Parse.Query("Reaction");
        //reactionQuery.equalTo('user', self.user);
        //reactionQuery.include(['parent', 'user']);
        //reactionQuery.find().then(function (result) {
        //    self.myReactions = result;
        //});
        //
        //// Fetch My Reacted
        //var reactedQuery = new Parse.Query("Reaction");
        //reactedQuery.notEqualTo('user', self.user);
        //reactedQuery.include(['parent', 'user']);
        //reactedQuery.matchesQuery("parent", innerQuery);
        //reactedQuery.find().then(function (result) {
        //    self.myReacted = result;
        //});
        //
        ////Fetch My Wins
        //var winQuery = new Parse.Query("AwardWin");
        ////winQuery.equalTo('user', self.user);
        //winQuery.include(['award', 'film']);
        //winQuery.matchesQuery("film", innerQuery);
        //winQuery.find().then(function (result) {
        //    self.myWins = result;
        //});

        self.showMessageDialog = function ($event) {
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

        self.getEmoticonByEmotion = function (emotion) {
            var reactions = $rootScope.generateReactions();
            return _.findWhere(reactions, {emotion: emotion});
        };

        // easyShare
        kyco.easyShare();
    }

    UserAboutController.$inject = ['$rootScope', 'DataService', 'User', '$state', 'UserActions'];
    function UserAboutController($rootScope, DataService, User, $state, UserActions) {
        var self = this;
        self.user = User.data;
    }

    UserVideosController.$inject = ['$rootScope', 'DataService', 'User', 'Videos', '$state', 'UserActions'];
    function UserVideosController($rootScope, DataService, User, Videos, $state, UserActions) {
        var self = this;
        self.user = User.data;
        self.projects = Videos.data;

    }

    UserCritiquesController.$inject = ['$rootScope', 'DataService', 'User', 'Critiques', '$state', 'UserActions'];
    function UserCritiquesController($rootScope, DataService, User, Critiques, $state, UserActions) {
        var self = this;
        self.user = User.data;
        self.critiques = Critiques.data;
    }

    UserReactionsController.$inject = ['$rootScope', 'DataService', 'Reactions', 'User', '$state', 'UserActions'];
    function UserReactionsController($rootScope, DataService, User, Reactions, $state, UserActions) {
        var self = this;
        self.user = User.data;
        self.reactions = Reactions.data;
    }

    UserAwardsController.$inject = ['$rootScope', 'DataService', 'User', 'Awards', 'Nominations', '$state', 'UserActions'];
    function UserAwardsController($rootScope, DataService, User, Awards, Nominations, $state, UserActions) {
        var self = this;
        self.user = User.data;
        self.awards = Awards.data;
        self.nominations = Nominations.data;
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
            avatar: $rootScope.AppData.UserData.avatar,
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
                console.log(res);
                $rootScope.toastMessage('Profile Updated');
            });
        };

        self.updateAvatar = function (flow) {
            self.user.avatar = 'http://getindiewise.com/alpha/utils/files/' + flow.files[0].file.name;
            self.updateUser();
        }

    }

    MessagesCtrl.$inject = ['$rootScope', '$modal', 'UserActions', 'UtilsService', '$q'];
    function MessagesCtrl($rootScope, $modal, UserActions, UtilsService, $q) {
        $rootScope.metadata.title = 'Messages';

        var self = this;
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
            var msgsQuery = new Parse.Query("Message");
            msgsQuery.equalTo("parent", convo);
            msgsQuery.include(['from']);
            msgsQuery.find().then(function (msgs) {
                //console.log('Messages: ', msgs);
                self.messages = msgs;
            });
        }

        function postReply() {
            UserActions.checkAuth().then(function (res) {
                if (res) {
                    var message = new Parse.Object("Message");
                    message.set('body', self.myReply);
                    message.set('parent', {
                        __type: "Pointer",
                        className: "Conversation",
                        objectId: self.selectedConvo.id
                    });
                    message.set('from', $rootScope.AppData.User.userId);
                    message.save().then(function (result) {
                        self.myReply = null;
                        self.messages.push(result);
                        // TODO: Send email notification
                        //result.participants
                        UtilsService.recordActivity(result);
                    });

                    self.selectedConvo.set('updatedAt', moment().toDate());
                    self.selectedConvo.save();

                    //message.set('to', {__type: "Pointer", className: "_User", objectId: self.film.owner.id});
                    //message.set('from', $rootScope.AppData.User.userId;
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
                console.log(data);
                deferred.resolve(data);
            });

            return deferred.promise;
        }

        function fetchConvos() {
            var msgsQuery = new Parse.Query("Conversation");
            msgsQuery.equalTo("participants", $rootScope.AppData.User.userId);
            msgsQuery.descending("createdAt");
            msgsQuery.find().then(function (convos) {
                _.each(convos, function (a) {
                    var relParticipants = a.relation("participants");
                    relParticipants.query().find().then(function (participants) {
                        var msgQuery = new Parse.Query("Message");
                        msgQuery.equalTo("parent", a);
                        msgQuery.include(['from']);
                        msgQuery.descending("createdAt");
                        msgQuery.first().then(function (msg) {
                            //console.log('Messages: ', msg);
                            a.latest = msg;
                        });
                        a.participants = participants;
                        //console.log('list: ', a);
                    });
                });

                self.convos = convos;
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
                message.set('parent', {__type: "Pointer", className: "Conversation", objectId: self.selectedConvo.id});
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
        fetchConvos();
    }

    NotificationsCtrl.$inject = ['$rootScope', 'UserActions', 'UtilsService'];
    function NotificationsCtrl($rootScope, UserActions, UtilsService) {
        var self = this;
        self.refresh = function () {
            $rootScope.getFlatNotificationsFeed();
        };

        self.markAllAsRead = function () {
            $rootScope.getNewToken('flat', $rootScope.AppData.User.userId).then(function (token) {
                var feed = window.StreamClient.feed('flat_notifications', $rootScope.AppData.User.userId, token);
                feed.get({limit: 20, mark_read: true}, function (a) {
                    _.each($rootScope.AppData.NotificationsFeed.list, function (n) {
                        n.is_read = true;
                    });
                    $rootScope.AppData.NotificationsFeed.unread = 0;
                })
            });
        };

        self.markAsRead = function (n) {
            $rootScope.getNewToken('flat', $rootScope.AppData.User.userId).then(function (token) {
                var feed = window.StreamClient.feed('flat_notifications', $rootScope.AppData.User.userId, token);
                feed.get({limit: 5, mark_read: [n.id]}, function (a) {
                    n.is_read = true;
                    --$rootScope.AppData.NotificationsFeed.unseen;
                    --$rootScope.AppData.NotificationsFeed.unread;
                    return n;
                })
            });
        };

        self.refresh();
    }

    ContactUserDialogController.$inject = ['$rootScope', '$scope', '$modalInstance', 'UserActions', 'DataService', 'UtilsService', 'recipient'];
    function ContactUserDialogController($rootScope, $scope, $modalInstance, UserActions, DataService, UtilsService, recipient) {
        $scope.recipient = recipient;
        $scope.myMessage = null;

        $scope.postMessage = function () {
            UserActions.checkAuth().then(function (res) {
                if (res) {
                    // create new conversation
                    DataService.save('Conversation', {
                        participants: [
                            $rootScope.AppData.UserData
                            //{"__metadata": {id: $rootScope.AppData.UserData.id}, id: $rootScope.AppData.UserData.id},
                            //{"__metadata": {id: $scope.recipient.id}, id: $scope.recipient.id}
                        ],
                        Message_parent: [
                            {
                                body: self.myMessage,
                                from: $rootScope.AppData.User.userId

                            }
                        ]
                    }, true, true).then(function (convo) {
                        //DataService.save()
                        $scope.myMessage = null;
                        $rootScope.toastMessage('Message sent!');
                        // register Action
                        //result.participants = $scope.recipient;
                        UtilsService.recordActivity(result);
                        $scope.closeDialog();

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
    }
})();