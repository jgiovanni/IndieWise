//(function () {
    angular
        .module('IndieWise.controllers', [])
        // Auth Controllers
        .controller('SignInCtrl', ['$rootScope', '$localForage', '$q', '$state', 'AuthService', '$mdDialog', SignInCtrl])
        .controller('ForgotPasswordCtrl', ['$rootScope', '$state', 'AuthService', ForgotPasswordCtrl])
        .controller('RegisterCtrl', ['$rootScope', '$localForage', '$q', '$state', 'AuthService', 'ParseService', '$auth', RegisterCtrl])
        .controller('UploadCtrl', ['$rootScope', 'ParseService', '$state', '$http', 'UtilsService', UploadCtrl])
        .controller('ProfileCtrl', ['$rootScope', 'ParseService', '$state', '$mdDialog', ProfileCtrl])
        .controller('UserCtrl', ['$rootScope', 'ParseService', '$state', UserCtrl])
        .controller('EditProfileCtrl', ['$rootScope', '$scope', 'AuthService', 'ParseService', '$state', EditProfileCtrl])
        .controller('MessagesCtrl', ['$rootScope', '$mdSidenav', 'UserActions', 'UtilsService', MessagesCtrl])
        .controller('NotificationsCtrl', ['$rootScope', 'UserActions', 'UtilsService', NotificationsCtrl])
        // App Controllers
        .controller('BodyCtrl', ['$rootScope', '$localForage', '$mdSidenav', '$mdBottomSheet', '$log', '$q', '$state', 'AuthService', '$mdToast', 'UserActions', '$sce', BodyCtrl])
        .controller('HomeCtrl', ['$rootScope', '$scope', '$localForage', '$mdDialog', '$timeout', '$interval', HomeCtrl])
        .controller('BrowseCtrl', ['$scope', '$rootScope', '$state', '$localForage', '$q', '$timeout', '$mdSidenav', '$mdDialog', BrowseCtrl])
        .controller('ResultsCtrl', ['$scope', '$rootScope', '$state', '$localForage', '$q', '$timeout', '$mdSidenav', '$mdDialog', ResultsCtrl])
        .controller('VideoCtrl', ['$rootScope', '$scope', 'Project', '$mdDialog', 'UserActions', 'UtilsService', VideoCtrl])
        .controller('VideoEditCtrl', ['$rootScope', '$state', '$mdDialog', 'UserActions', 'Project', 'ParseService', VideoEditCtrl])
        .controller('VideoCritiqueCtrl', ['$rootScope', '$scope', '$mdDialog', 'UserActions', 'UtilsService', VideoCritiqueCtrl])
        .controller('GenreCtrl', ['$scope', '$rootScope', '$state', '$localForage', GenreCtrl])
    ;

    function SignInCtrl($rootScope, $localForage, $q, $state, AuthService, $mdDialog) {
        'use strict';
        $rootScope.metadata.title = 'Sign In';
        var self = this;
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
                    $state.go('home');
                    //window.location.reload();
                }
            }, function (res) {
                self.error = res;
                console.log('Failed', res);
            }).then(function () {
                self.cancelModal();
            });
        };

        self.doLoginFacebook = function () {
            AuthService.loginWithFB().then(function (res) {
                $state.go('home');
                window.location.reload();
            });
        };

        self.authenticate = function (provider) {
            self.error = null;
            AuthService.otherSocialLogin(provider).then(function (a) {
                console.log(a);
            });
        };
        self.cancelModal = function () {
            $mdDialog.cancel();
        };
    }
    function ForgotPasswordCtrl($rootScope, $state, AuthService) {
        'use strict';
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
    function RegisterCtrl($rootScope, $localForage, $q, $state, AuthService, ParseService, $auth) {
        'use strict';
        $rootScope.metadata.title = 'Register';
        var self = this;
        self.user = {
            email: '',
            password: '',
            first_name: '',
            last_name: '',
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
                $state.go('home');
            }, function (res) {
                $scope.error = res.message;
                console.log('Failed', res);
            }).then(function () {
                //window.location.reload();
            })
        };

        self.doLoginFacebook = function () {
            AuthService.loginWithFB().then(function (res) {
                $state.go('home');
                //window.location.reload();
            });
        };

        self.authenticate = function (provider) {
            self.error = null;
            AuthService.otherSocialLogin(provider).then(function (a) {
                console.log(a);
            });
        };

    }
    function BodyCtrl($rootScope, $localForage, $mdSidenav, $mdBottomSheet, $log, $q, $state, AuthService, $mdToast, UserActions, $sce) {
        'use strict';
        var self = this;

        self.selected = null;
        self.toggleList = toggleUsersList;
        self.showContactOptions = showContactOptions;
        console.log($rootScope.$stateParams);
        self.searchText = $rootScope.$stateParams.q || '';
        self.selectedItem = '';

        self.notificationsTemplate = $sce.trustAsResourceUrl('src/directives/notification.html');

        self.getMatches = function (search) {
            var deferred = $q.defer();

            // Get matching search queries
            var terms = new Parse.Query('Search');
            terms.contains('term', search.toLowerCase());
            terms.find().then(function (res) {
                if (res.length) {
                    deferred.resolve(res);
                } else {
                    var films = new Parse.Query('Film');
                    films.contains('name_lowercase', search.toLowerCase());
                    //films.notEqualTo("disableProject", true);
                    films.notEqualTo("unlist", true);
                    films.find().then(function (res) {
                        deferred.resolve(res);
                    });
                }
            });

            return deferred.promise;
        };

        self.startSearch = function (text) {
            console.log(text);
            if (text) {
                if (angular.isString(text)) {
                    // save search
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
                    });
                }
                if (angular.isObject(text)) {
                    switch (text.className) {
                        case 'Film':
                            var term = new Parse.Object("Search");
                            term.set('term', text.attributes.name_lowercase);
                            term.set('count', 0);
                            term.save();
                            // show results
                            self.toPage('results', {q: text.attributes.name_lowercase});
                            break;
                        case 'Search':
                            // save search
                            text.increment('count');
                            text.save();
                            // show results
                            self.toPage('results', {q: text.attributes.term});
                            break;
                    }
                }
            }
        };

        self.checkIfEnterKeyWasPressed = function ($event) {
            var keyCode = $event.which || $event.keyCode;
            if (keyCode === 13) {
                // initiate search
                self.startSearch(self.searchText);
            }
        };

        $rootScope.generateGenres = function () {
            var deferred = $q.defer();
            //$localForage.getItem('genres').then(function (genres) {
            //    if (genres) {
            //        $rootScope.genresList = genres;
            //        deferred.resolve(genres);
            //    } else {
            var genreQuery = new Parse.Query("Genre");
            genreQuery.find().then(function (result) {
                $rootScope.genresList = result;
                $localForage.setItem('genres', result);
                deferred.resolve(result);
            });
            //    }
            //});
            return deferred.promise;
        };

        $rootScope.generateTypes = function () {
            var deferred = $q.defer();

            var typeQuery = new Parse.Query("Type");
            typeQuery.find().then(function (result) {
                $rootScope.typesList = result;
                $localForage.setItem('types', result);
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
                /*37) Empowered
            38) Cool
            39) Pumped
            40) Turned On
            41) Proud
            42) Disgusted
            43) Sympathetic
            44) Overwhelmed
            45) Passionate
            46) Thrilled
            47) Loved
            48) Thankful
            49) Appreciated
            50) Romantic
            51) Chill
            52) Pissed Off
            53) Accomplished
            54) Honored
            55) Relaxed
            56) Young
            56) Wild
            56) Old
            56) Free
            56) Epic
            56) Engaged
            56) Fired Up
            56) Detached
            56) Disconnected
            56) Connected
            56) Distant
            56) Beautiful

            */
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


        /**
         * First hide the bottomsheet IF visible, then
         * hide or Show the 'left' sideNav area
         */
        function toggleUsersList() {
            var pending = $mdBottomSheet.hide() || $q.when(true);

            pending.then(function () {
                $mdSidenav('left').toggle();
            });
        }

        self.closeLeftMenu = function () {
            $mdSidenav('left').close();
        };

        /**
         * Show the bottom sheet
         */
        function showContactOptions($event) {
            var user = self.selected;

            return $mdBottomSheet.show({
                parent: angular.element(document.getElementById('content')),
                templateUrl: './src/users/view/contactSheet.html',
                controller: ['$mdBottomSheet', ContactPanelController],
                controllerAs: "cp",
                bindToController: true,
                targetEvent: $event
            }).then(function (clickedItem) {
                clickedItem && $log.debug(clickedItem.name + ' clicked!');
            });

            /**
             * Bottom Sheet controller for the Avatar Actions
             */
            function ContactPanelController($mdBottomSheet) {
                this.user = user;
                this.actions = [
                    {name: 'Phone', icon: 'phone', icon_url: 'assets/svg/phone.svg'},
                    {name: 'Twitter', icon: 'twitter', icon_url: 'assets/svg/twitter.svg'},
                    {name: 'Google+', icon: 'google_plus', icon_url: 'assets/svg/google_plus.svg'},
                    {name: 'Hangout', icon: 'hangouts', icon_url: 'assets/svg/hangouts.svg'}
                ];
                this.submitContact = function (action) {
                    $mdBottomSheet.hide(action);
                };
            }
        }


        self.toPage = function (state, args) {
            $state.go(state, args);
        };

        self.notiURL = function (n) {
            if (!n.is_read) {
                self.markAsRead(n);
            }
            self.toPage(n.main_url.state, n.main_url.args);
            $mdSidenav('right').close();
        };

        self.markAllAsSeen = function () {
            $rootScope.getNewToken('notification', $rootScope.AppData.User.id).then(function (token) {
                var feed = window.StreamClient.feed('notification', $rootScope.AppData.User.id, token);
                feed.get({limit: 5, mark_seen: true}, function (a) {
                    console.log(a);
                    _.each($rootScope.AppData.Notifications.list, function (n) {
                        n.is_seen = true;
                    });
                    $rootScope.AppData.Notifications.unseen = 0;
                })
            });
        };

        self.markAllAsRead = function () {
            $rootScope.getNewToken('notification', $rootScope.AppData.User.id).then(function (token) {
                var feed = window.StreamClient.feed('notification', $rootScope.AppData.User.id, token);
                feed.get({limit: 5, mark_seen: true}, function (a) {
                    console.log(a);
                    _.each($rootScope.AppData.Notifications.list, function (n) {
                        n.is_seen = true;
                    });
                    $rootScope.AppData.Notifications.unseen = 0;
                })
            });
        };

        self.markAsRead = function (n) {
            $rootScope.getNewToken('notification', $rootScope.AppData.User.id).then(function (token) {
                var feed = window.StreamClient.feed('notification', $rootScope.AppData.User.id, token);
                feed.get({limit: 5, mark_read: [n.id]}, function (a) {
                    n.is_read = true;
                    --$rootScope.AppData.Notifications.unseen;
                    --$rootScope.AppData.Notifications.unread;
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
            $mdSidenav('right').toggle()
                .then(function () {

                });
            self.markAllAsSeen();
        };

        $rootScope.toFavorites = self.toFavorites = toFavorites;
        $rootScope.toWatchLater = self.toWatchLater = toWatchLater;
        $rootScope.checkContains = self.checkContains = checkContains;

        function toFavorites(obj) {
            return UserActions.favorite(obj);
        }

        function toWatchLater(obj) {
            return UserActions.watchLater(obj);
        }

        function checkContains(obj, search) {
            return _.contains(obj, search);
        }
    }
    function HomeCtrl($rootScope, $scope, $localForage, $mdDialog, $timeout, $interval) {
        var self = this;
        $rootScope.metadata.title = 'Home';

        self.indeterminate = 'indeterminate';
        self.latest = {
            watched: [],
            watchedLoaded: 'indeterminate',
            critiques: [],
            critiquesLoaded: 'indeterminate',
            reactions: [],
            reactionsLoaded: 'indeterminate',
            comments: [],
            commentsLoaded: 'indeterminate'
        };
        self.featuredProjects = [
            {title: 'Featured 1', icon: '', color:'darkBlue'},
            {title: 'Featured 2', icon: '', color:'pink'},
            {title: 'Featured 3', icon: '', color:'yellow'},
            {title: 'Featured 4', icon: '', color:'blue'},
            {title: 'Featured 5', icon: '', color:'red'},
            //{title: 'Featured 6', icon: '', color:'green'},
        ];

        self.toggleLoader = function (loader, state) {

        };

        self.refresh = function () {
            var innerQuery = new Parse.Query("Film");
            //innerQuery.notEqualTo("disableProject", true);
            innerQuery.notEqualTo("unlist", true);

            var filmsQuery = new Parse.Query("Film_Genre");
            filmsQuery.matchesQuery("film", innerQuery);
            filmsQuery.include(["film.type", "film.owner"]);
            filmsQuery.descending("createdAt");
            filmsQuery.find().then(function (result) {
                self.films = result;
                /*_.each(self.films, function (film) {
                 var cQ = new Parse.Query("Critique");
                 cQ.exists("author");
                 cQ.equalTo('parent', film.attributes.film);
                 cQ.find().then(function (res) {
                 var total = 0;
                 film.attributes.film.set('critiqueCount', res.length);
                 if (res.length) {
                 _.each(res, function (a) {
                 total += a.attributes.overall;
                 });
                 film.attributes.film.set('iwRating', total / res.length);
                 film.attributes.film.attributes.iwRating = total / res.length;
                 } else { film.attributes.film.attributes.iwRating = 0;}
                 console.log(total / res.length);
                 film.attributes.film.save();
                 });
                 });*/
            });

            // Trending Videos
            var innerQ_1 = innerQuery;
            innerQ_1.descending("reactionCount");
            innerQ_1.limit(4);
            innerQ_1.include(["type", "owner"]);
            innerQ_1.find().then(function (result) {
                self.trending = result;
            });

            // Highest Rated Videos
            var innerQ_2 = innerQuery;
            innerQ_2.descending("iwRating");
            innerQ_2.limit(4);
            innerQ_2.include(["type", "owner"]);
            innerQ_2.find().then(function (result) {
                self.highestRated = result;
            });

            // Highest Awarded Videos
            var innerQ_3 = innerQuery;
            innerQ_3.descending("awardCount");
            innerQ_3.limit(4);
            innerQ_3.include(["type", "owner"]);
            innerQ_3.find().then(function (result) {
                self.highestAwarded = result;
            });

            // Recent Videos
            var innerQ_4 = innerQuery;
            innerQ_4.descending("createdAt");
            innerQ_4.limit(4);
            innerQ_4.include(["type", "owner"]);
            innerQ_4.find().then(function (result) {
                self.recentFilms = result;
            });

            // Recent Critiques
            var critiqueQuery = new Parse.Query("Critique");
            critiqueQuery.descending("createdAt");
            critiqueQuery.exists("author");
            critiqueQuery.include(["author", "parent"]);
            critiqueQuery.limit(5);
            critiqueQuery.find().then(function (result) {
                self.latest.critiques = result;
                self.latest.critiquesLoaded = '';
            });

            // Recent Reactions
            var reactionQuery = new Parse.Query("Reaction");
            reactionQuery.descending("createdAt");
            reactionQuery.exists("user");
            reactionQuery.exists("parent");
            reactionQuery.include(["user", "parent"]);
            reactionQuery.limit(5);
            reactionQuery.find().then(function (result) {
                self.latest.reactions = result;
                self.latest.reactionsLoaded = '';
            });

            // Recent Comments
            var commentQuery = new Parse.Query("Comment");
            commentQuery.descending("createdAt");
            commentQuery.exists("author");
            commentQuery.include(["author", "parentFilm", "parentComment.author", "parentCritique.parent"]);
            commentQuery.limit(5);
            commentQuery.find().then(function (result) {
                self.latest.comments = result;
                self.latest.commentsLoaded = '';
            });


        };
        self.refresh();
        self.refInterval = $interval(self.refresh, 30000);

        self.openMenu = function ($mdOpenMenu, ev) {
            var originatorEv = ev;
            $mdOpenMenu(ev);
        };

        self.toggleFavorite = function (video) {

        };

        self.toggleWatchLater = function (video) {

        };

        /*$rootScope.getNewToken('user', 'all').then(function (token) {
         var feed1 = window.StreamClient.feed('user', 'all', token);
         });*/


        function failCallback(data) {
            //alert('something went wrong, check the console logs');
            console.log(data);
        }

        /*feed1.get({limit:5}, function(error, response, body) {
         self.recently.watched = body.results;
         console.log(error, response, body);
         });*/

        $rootScope.getNewToken('watched', 'all').then(function (token) {
            var feed2 = window.StreamClient.feed('watched', 'all', token);
            feed2.subscribe(function () {
                var throttledWatch = _.throttle(self.getWatchedList(feed2), 60000);
                $timeout(throttledWatch, 0);
                //console.log(obj);
            }).then(function (obj) {
                self.getWatchedList(feed2);
            }, failCallback);
        });

        self.getWatchedList = function (feed) {
            self.latest.watchedLoaded = self.indeterminate;
            var watchedQuery = new Parse.Query("Watched");
            watchedQuery.include('film');
            watchedQuery.limit(5);
            watchedQuery.descending("updatedAt");
            watchedQuery.find().then(function (res) {
                self.latest.watched = res;
                self.latest.watchedLoaded = '';
            });
        };

        $scope.$on('$destroy', function () {
            $interval.cancel(self.refInterval);
        });
    }
    function BrowseCtrl($scope, $rootScope, $state, $localForage, $q, $timeout, $mdSidenav, $mdDialog) {
        "use strict";
        $rootScope.metadata.title = 'Browse';

        var Browse = this;
        Browse.isOpen = false;
        Browse.selectedGenres = [];
        Browse.selectedTypes = [];
        Browse.films = [];
        Browse.arrs = {
            genres: [],
            types: []
        };
        Browse.filters = {
            genres: [],
            types: []
        };


        $('.collapsible').collapsible({
            accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });

        $rootScope.generateTypes().then(function (types) {
            var d = $q.defer();
            Browse.arrs.types = angular.isArray(Browse.selectedTypes) && Browse.selectedTypes.length ? Browse.selectedTypes : types;
            return d.promise;
        });
        $rootScope.generateGenres().then(function (genres) {
            var d = $q.defer();
            Browse.arrs.genres = angular.isArray(Browse.selectedGenres) && Browse.selectedGenres.length ? Browse.selectedGenres : genres;
            return d.promise;
        });

        Browse.toggleFilterNav = function () {
            $mdSidenav('filterNav').toggle();
        };

        Browse.refresh = function () {
            $q.all([$rootScope.generateTypes(), $rootScope.generateGenres()]).then(function (values) {
                Browse.search(values[1], values[0]);
                console.log(Browse);
            })
        };

        Browse.search = function (genres, types) {
            if (genres && !genres.length)
                genres = Browse.arrs.genres;
            if (types && !types.length)
                types = Browse.arrs.types;
            var joinQuery = new Parse.Query("Film_Genre");
            var innerQuery = new Parse.Query("Film");
            //innerQuery.notEqualTo("disableProject", true);
            innerQuery.notEqualTo("unlist", true);
            joinQuery.matchesQuery("film", innerQuery);
            joinQuery.include(["film.type", "film.owner"]);
            joinQuery.descending("createdAt");
//joinQuery.limit(10);
            joinQuery.containedIn('genres', genres);
            joinQuery.containedIn('type', types);
            joinQuery.find().then(function (data) {
                console.log(data);
                Browse.films = data;
            });

            $scope.$broadcast('scroll.refreshComplete');
        };

        Browse.selectGenres = function (genre) {
            var exists = _.find(Browse.selectedGenres, function (a) {
                return a && a.id == genre.id;
            });
            !!exists ? Browse.selectedGenres = _.reject(Browse.selectedGenres, genre) : Browse.selectedGenres.push(genre);
            Browse.search(Browse.selectedGenres, Browse.selectedTypes);
        };

        Browse.selectTypes = function (type) {
            var exists = _.find(Browse.selectedTypes, function (a) {
                return a && a.id == type.objectId;
            });
            !!exists ? Browse.selectedGenres = _.reject(Browse.selectedTypes, type) : Browse.selectedTypes.push(type);
            Browse.search(Browse.selectedGenres, Browse.selectedTypes);
        };

        Browse.openMenu = function ($mdOpenMenu, ev) {
            var originatorEv = ev;
            $mdOpenMenu(ev);
        };

        Browse.toggleFavorite = function (video) {

        };

        Browse.toggleWatchLater = function (video) {

        };

        $scope.$watch('', function (newValue, oldValue) {

        });

        Browse.refresh();
    }
    function ResultsCtrl($scope, $rootScope, $state, $localForage, $q, $timeout, $mdSidenav, $mdDialog) {
        "use strict";
        $rootScope.metadata.title = 'Search';

        var self = this;
        self.isOpen = false;
        self.selectedGenres = [];
        self.selectedTypes = [];
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

        self.toggleFilterNav = function () {
            $mdSidenav('filterNav').toggle();
        };

        self.refresh = function () {
            $q.all([$rootScope.generateTypes(), $rootScope.generateGenres()]).then(function (values) {
                self.search(values[1], values[0]);
                console.log(self);
            })
        };

        self.search = function (genres, types) {
            if (genres && !genres.length)
                genres = self.arrs.genres;
            if (types && !types.length)
                types = self.arrs.types;

            var deferred = $q.defer();

            // Search Films
            var innerQuery = new Parse.Query("Film");
            //innerQuery.notEqualTo("disableProject", true);
            innerQuery.notEqualTo("unlist", true);
            innerQuery.contains("name_lowercase", $rootScope.$stateParams.q);

            var joinQuery = new Parse.Query("Film_Genre");
            joinQuery.matchesQuery("film", innerQuery);
            joinQuery.include(["film.type", "film.owner"]);
            joinQuery.descending("createdAt");
//joinQuery.limit(10);
            joinQuery.containedIn('genres', genres);
            joinQuery.containedIn('type', types);
            var p1 = joinQuery.find().then(function (data) {
                return data;
                //angular.extend(self.results, data);
            });

            //Search user
            var searchUsersFirstName = new Parse.Query('User');
            searchUsersFirstName.matches('first_name', $rootScope.$stateParams.q);
            var searchUsersLastName = new Parse.Query('User');
            searchUsersLastName.matches('last_name', $rootScope.$stateParams.q);
            var searchUsers = new Parse.Query.or(searchUsersFirstName, searchUsersLastName);
            var p2 = searchUsers.find().then(function (data) {
                return data;
                //angular.extend(self.results, data);
            });

            $q.all([p1, p2]).then(function (values) {
                self.results = _.flatten(values, true);
                console.log(values);
                console.log(self.results);
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

        self.openMenu = function ($mdOpenMenu, ev) {
            var originatorEv = ev;
            $mdOpenMenu(ev);
        };

        self.toggleFavorite = function (video) {

        };

        self.toggleWatchLater = function (video) {

        };

        $scope.$watch('', function (newValue, oldValue) {

        });

        self.refresh();
    }
    function BrowseGenresCtrl($scope, $rootScope, $state, $localForage, $timeout) {
        "use strict";
        var Browse = this;

        Browse.refresh = function () {
            //$rootScope.getSelectedGenres().then(function () {
            var browseQuery = new Parse.Query("Genre");
            browseQuery.find().then(function (result) {
                Browse.items = result;
                _.each(result, function (a) {
                    a.films = [];
                    var joinQuery = new Parse.Query("Film_Genre");
                    joinQuery.include('film.type');
                    joinQuery.include('film.owner');
                    joinQuery.descending("createdAt");
                    joinQuery.limit(10);
                    joinQuery.containedIn('genres', [a]);
                    joinQuery.find().then(function (data) {
                        console.log(data);
                        a.films = data;
                        if (data.length) {
                            //Browse.handleScroller(a.id);
                        }
                    });
                });

                console.log(result);
                $scope.$broadcast('scroll.refreshComplete');
            });
            //});
        };

        Browse.refresh();
    }
    function GenreCtrl($scope, $rootScope, $state, $localForage) {
        "use strict";
        var GC = this;

        GC.refresh = function () {
            var genreQuery = new Parse.Query("Genre");
            genreQuery.equalTo("slug", $rootScope.$stateParams.slug);
            genreQuery.first().then(function (genre) {
                GC.genre = genre;
                var filmsQuery = new Parse.Query("Film_Genre");
                filmsQuery.containedIn("genres", [genre]);
                filmsQuery.include("film.type");
                filmsQuery.include("film.owner");
                filmsQuery.ascending("createdAt");
                filmsQuery.find().then(function (result) {
                    GC.films = result;
                    console.log(result);
                    $scope.$broadcast('scroll.refreshComplete');
                });
            });
        };

        GC.refresh();
    }
    function VideoCtrl($rootScope, $scope, Project, $mdDialog, UserActions, UtilsService) {
        "use strict";
        var self = this;
        self.loaded = false;
        self.displayShare = false;
        self.toggleReactionsList = false;
        self.emotions = $rootScope.generateReactions();
        self.critiqueAverage = 0;

        /*Parse.Object.extend({
         className: "Critique",
         attrs: ['originality', 'direction', 'writing', 'cinematography', 'performances', 'production', 'pacing', 'structure', 'audio', 'music', 'overall', 'private', 'author', 'body', 'parent']
         });

         Parse.Object.extend({
         className: "Nomination",
         attrs: ['awardPntr', 'nominator', 'filmPntr']
         });

         Parse.Object.extend({
         className: "Comment",
         attrs: ['body', 'parentFilm', 'parentCritique', 'parentComment', 'author', 'replyCount', 'repliedAt']
         });

         Parse.Object.extend({
         className: "Message",
         attrs: ['body', 'from', 'parent']
         });

         Parse.Object.extend({
         className: "Rating",
         attrs: ['parent', 'author', 'up', 'down']
         });*/

        self.critique = {
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
            author: Parse.User.current(),
            body: '',
            parent: self.film
        };

        self.film = Project;
        function init(result) {
            $rootScope.currentTitle = result.attributes.name;
            self.film = result;
            $scope.commentsParent = self.critique.parent = self.film;
            self.loaded = true;

            $rootScope.metadata = {
                title: result.attributes.name,
                description: result.attributes.description.substr(0, 150),
                image: result.attributes.thumbnail_url,
                url: window.location.href
            };
            //$scope.$broadcast('scroll.refreshComplete');

            // Fetch Genres
            var filmGenreQuery = new Parse.Query("Film_Genre");
            filmGenreQuery.equalTo('film', self.film);
            filmGenreQuery.first().then(function (result) {
                var relGenres = result.relation("genres");
                relGenres.query().find().then(function (genres) {
                    self.filmGenres = genres;
                });
            });

            // Fetch Comments
            var commentsQuery = new Parse.Query("Comment");
            commentsQuery.equalTo('parentFilm', self.film);
            commentsQuery.include("author");
            commentsQuery.doesNotExist("parentComment");
            commentsQuery.find().then(function (result) {
                //console.log("Comments: ", result);
                self.comments = result;
            });

            self.qReactions();

            self.qCritiques();

            // Fetch Nominations
            var nominationQuery = new Parse.Query("Nomination");
            nominationQuery.equalTo('filmPntr', self.film);
            nominationQuery.include(["nominator", "awardPntr"]);
            nominationQuery.find().then(function (result) {
                self.nominations = result;
                //console.log('Nominations: ', result);
                //self.loaded = true;
                //$scope.$broadcast('scroll.refreshComplete');
                if (angular.isArray(result) && result.length) {
                    self.wins = [];
                    var nomedAwards = [],
                        nomedAwardIds = [],
                        countedNoms = {};
                    // sort alike
                    _.each(self.nominations, function (a) {
                        nomedAwards.push(a.attributes.awardPntr);
                        nomedAwardIds.push(a.attributes.awardPntr.id);
                    });

                    // calc award wins
                    if (nomedAwards.length) {
                        _.each(UtilsService.compressArray(nomedAwardIds), function (a) {
                            if (a.count >= 3)
                                self.wins.push(_.findWhere(nomedAwards, {id: a.value}));
                        });
                    }
                }
            });

            self.checkUserActions();
            // Fetch Awards Won

            // TODO: trigger after clicking play button
            self.activeWatch = UserActions.markAsWatched(self.film);

            $scope.$on('$destroy', function () {
                UserActions.cancelWatched(self.activeWatch);
            });

            self.test = function () {
                console.log('Clicked');
            }
        }

        self.checkUserActions = function () {
            UserActions.canReact(self.film.id).then(function (res) {
                self.canReact = res;
            }, function (error) {
                self.canReact = error;
            });

            UserActions.canCritique(self.film.id).then(function (res) {
                self.canCritique = res;
            }, function (error) {
                self.canCritique = error;
            });

            UserActions.canRate(self.film.id).then(function (res) {
                self.canRate = res;
            }, function (error) {
                self.canRate = error;
            });
        };

        self.qReactions = function () {
            // Fetch Reactions
            var reactionsQuery = new Parse.Query("Reaction");
            reactionsQuery.equalTo('parent', self.film);
            //commentsQuery.include("user");
            reactionsQuery.find().then(function (result) {
                //console.log("Comments: ", result);
                self.reactions = result;
                self.chartedReactions = _.countBy(result, function (r) {
                    return _.contains(result, r) ? r.attributes.emotion : undefined;
                });
                self.reactionCountMax = _.max(self.chartedReactions, function (i) {return i;});
                console.log('Reactions');
                console.log(result);
            });
        };

        self.qCritiques = function () {
            // Fetch Critiques
            var critiqueQuery = new Parse.Query("Critique");
            critiqueQuery.equalTo('parent', self.film);
            critiqueQuery.include("author");
            critiqueQuery.find().then(function (result) {
                self.critiques = result;
                console.log('Critique: ', result);
                var total = 0;
                _.each(result, function (a) {
                    total += a.attributes.overall;
                });
                self.critiqueAverage = total/result.length;
            });
        };

        self.getEmoticonByEmotion = function (emotion) {
            var reactions = $rootScope.generateReactions();
            return _.findWhere(reactions, {emotion: emotion});
        };

        self.openMenu = function ($mdOpenMenu, ev) {
            var originatorEv = ev;
            $mdOpenMenu(ev);
        };

        self.toggleShare = toggleShare;
        self.toggleReactions = toggleReactions;
        function toggleShare() {
            self.displayShare = !self.displayShare;
        }

        function toggleReactions() {
            self.toggleReactionsList = !self.toggleReactionsList;
            self.searchReactionsText = '';
        }

        // Handle Message and Comment Inputs
        self.myMessage = null;
        self.showMessageInput = false;

        self.toggleMessageInput = function () {
            self.showMessageInput = !self.showMessageInput;
        };

        self.rate = function (direction) {
            UserActions.checkAuth().then(function (res) {
                if (res) {
                    var actionVerb = 'like';
                    if (self.canRate === true) {
                        var rating = new Parse.Object("Rating");
                        rating.set('author', Parse.User.current());
                        rating.set('parent', self.film);
                        switch (direction) {
                            case 'up':
                                rating.set('up', true);
                                rating.set('down', false);
                                // Increment film rateUpCount
                                self.film.increment('rateUpCount');
                                self.film.save();

                                break;
                            case 'down':
                                rating.set('up', false);
                                rating.set('down', true);
                                // Increment film rateDownCount
                                self.film.increment('rateDownCount');
                                self.film.save();
                                actionVerb = 'unlike';

                                break;
                        }

                        rating.save().then(function (res) {
                            UtilsService.recordActivity(res, actionVerb);
                            self.checkUserActions();
                        });
                    } else if (angular.isObject(self.canRate)) {
                        if (!!self.canRate.attributes.up && direction === 'up') {
                            self.canRate.destroy().then(function (res) {
                                self.film.increment('rateUpCount', -1);
                                self.film.save();
                                UtilsService.recordActivity(res, 'like');
                                self.checkUserActions();
                            });
                        } else if (!!self.canRate.attributes.down && direction === 'down') {
                            self.canRate.destroy().then(function (res) {
                                self.film.increment('rateDownCount', -1);
                                self.film.save();
                                UtilsService.recordActivity(res, 'unlike');
                                self.checkUserActions();
                            });
                        } else if ((!!self.canRate.attributes.down && direction === 'up') || (!!self.canRate.attributes.up && direction === 'down')) {
                            switch (direction) {
                                case 'up':
                                    self.canRate.set('up', true);
                                    self.canRate.set('down', false);

                                    // Increment film rateUpCount
                                    self.film.increment('rateUpCount');
                                    // Decrement film rateDownCount
                                    self.film.increment('rateDownCount', -1);

                                    self.film.save();

                                    break;
                                case 'down':
                                    self.canRate.set('up', false);
                                    self.canRate.set('down', true);

                                    // Decrement film rateUpCount
                                    self.film.increment('rateUpCount', -1);
                                    // Increment film rateDownCount
                                    self.film.increment('rateDownCount');

                                    self.film.save();
                                    actionVerb = 'unlike';
                                    break;
                            }
                            self.canRate.save().then(function (res) {
                                self.checkUserActions();
                                UtilsService.recordActivity(res, actionVerb);
                            });
                        }
                    }
                    //if (angular.isObject(self.canRate))
                }
            })
        };

        self.react = function (emotion) {
            if (angular.isDefined(emotion)) {
                UserActions.checkAuth().then(function (res) {
                    if (res) {
                        var actionVerb = 'react';
                        if (self.canReact === true) {
                            var reaction = new Parse.Object("Reaction");
                            reaction.set('user', Parse.User.current());
                            reaction.set('parent', self.film);
                            reaction.set('emotion', emotion.emotion);
                            reaction.save().then(function (res) {
                                self.film.increment('reactionCount');
                                self.film.save();
                                UtilsService.recordActivity(res, actionVerb);
                                self.checkUserActions();
                                self.qReactions();
                            });
                        } else if (angular.isObject(self.canReact)) {
                            if (self.canReact.attributes.emotion !== emotion.emotion) {
                                self.canReact.set('emotion', emotion.emotion);
                                self.canReact.save().then(function () {
                                    self.checkUserActions();
                                    self.qReactions();
                                });
                            }
                        }
                    }
                    self.toggleReactions();
                });
            }
        };

        self.canReactIcon = function () {
            return _.where(self.emotions, {'emotion': self.canReact.emotion}).icon;
        };

        self.throttledRate = function (direction) {
            return _.throttle(self.rate(direction), 2000);
        };

        self.postMessage = function () {
            UserActions.checkAuth().then(function (res) {
                if (res) {
                    // create new conversation
                    var convo = new Parse.Object("Conversation");
                    var relation = convo.relation("participants");
                    relation.add([self.film.attributes.owner, Parse.User.current()]);
                    convo.save().then(function (res) {
                        var message = new Parse.Object("Message");
                        message.set('body', self.myMessage);
                        message.set('parent', res);
                        message.set('from', Parse.User.current());
                        message.save().then(function (result) {
                            self.toggleMessageInput();
                            self.myMessage = null;
                            $rootScope.toastMessage('Message sent!');
                            // TODO: Send email notification

                            // register Action
                            result.participants = self.film.attributes.owner;
                            UtilsService.recordActivity(result);

                        });
                    });

                    //message.set('to', {__type: "Pointer", className: "_User", objectId: self.film.attributes.owner.id});
                    //message.set('from', Parse.User.current();
                }
            })
        };

        self.deleteCritique = function (c, ev) {
            UserActions.checkAuth().then(function (res) {
                if (res) {
                    var confirm = $mdDialog.confirm()
                        .title('Would you like to delete your critique?')
                        //.content('All of the banks have agreed to <span class="debt-be-gone">forgive</span> you your debts.')
                        //.ariaLabel('Lucky day')
                        .targetEvent(ev)
                        .ok('Delete')
                        .cancel('Cancel');
                    $mdDialog.show(confirm).then(function () {
                        c.destroy().then(function (res) {
                            self.critiques = _.reject(self.critiques, function (a) {
                                return a.id === c.id;
                            });
                            $rootScope.toastMessage('Your critique was deleted.');

                            // Decrement film critiqueCount
                            self.film.increment('critiqueCount', -1);
                            self.film.save();
                            self.checkUserActions();
                        });
                    }, function () {
                        //$scope.status = 'You decided to keep your debt.';
                    });
                }
            })
        };

        self.showCritiqueDialog = function ($event) {
            //UserActions.canCritique(self.film.id).then(function (allow) {
            //debugger;
            function CritiqueDialogController($scope, $mdDialog, critique, $q) {
                $scope.critique = critique;
                $scope.dialogModel = {
                    awardId: null
                };
                $scope.nominated = {
                    awardPntr: {__type: "Pointer", className: "Award", objectId: $scope.dialogModel.awardId},
                    nominator: Parse.User.current(),
                    filmPntr: {__type: "Pointer", className: "Film", objectId: $rootScope.$stateParams.id},
                    critique: undefined
                    //nominatee: {__type: "Pointer", className: "Film", objectId: $rootScope.$stateParams.id}
                };

                $scope.calcOverall = function () {
                    $scope.critique.overall = ($scope.critique.originality + $scope.critique.direction + $scope.critique.writing +
                        $scope.critique.cinematography + $scope.critique.performances + $scope.critique.production +
                        $scope.critique.pacing + $scope.critique.structure + $scope.critique.audio + $scope.critique.music) / 10;
                };

                $scope.$watchCollection('critique', function () {
                    $scope.calcOverall();
                });

                $scope.closeDialog = function () {
                    $mdDialog.hide();
                };

                $scope.getAwards = function () {
                    var deferred = $q.defer();
                    var awardQuery = new Parse.Query("Award");
                    awardQuery.find().then(function (result) {
                        deferred.resolve(result);
                        $scope.awardsList = result;
                    });

                    return deferred.promise;
                };

                $scope.postCritique = function () {
                    var critiqueObj = new Parse.Object("Critique");
                    critiqueObj.save($scope.critique).then(function (obj) {
                        self.critiques.push(obj);

                        // Increment film critiqueCount
                        self.film.increment('critiqueCount');
                        self.film.save();

                        // if an award has been selected, create a nomination
                        if (!!$scope.dialogModel.awardId && angular.isString($scope.dialogModel.awardId)) {
                            $scope.nominated.critique = obj;
                            $scope.nominated.awardPntr.objectId = $scope.dialogModel.awardId;
                            var nomination = new Parse.Object("Nomination");
                            nomination.save($scope.nominated).then(function (nom) {
                                // Increment film commentCount
                                self.film.increment('nominationCount');
                                self.film.save();

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

            UserActions.checkAuth().then(function (res) {
                if (res) {
                    var parentEl = angular.element(document.body);
                    $mdDialog.show({
                        parent: parentEl,
                        targetEvent: $event,
                        templateUrl: './src/common/critiqueDialog.html',
                        locals: {
                            critique: self.critique
                        },
                        controller: CritiqueDialogController
                    });
                }
            })
        }

        //Lets begin
        init(self.film);
    }
    function VideoEditCtrl($rootScope, $state, $mdDialog, UserActions, Project, ParseService) {

        var self = this;
        self.project = Project;
        self.projectGenres = [];
        self.dateOfCompl = self.project.attributes.completionDate;
        //angular.copy(self.project.attributes.completionDate, self.dateOfCompl);
        console.log(self);

        // Fetch Genres
        var filmGenreQuery = new Parse.Query("Film_Genre");
        filmGenreQuery.equalTo('film', self.project);
        filmGenreQuery.first().then(function (result) {
            self.filmGenre = result;
            var relGenres = result.relation("genres");
            relGenres.query().find().then(function (genres) {
                _.each(genres, function (genre) {
                    self.projectGenres.push(genre.id);
                });
            });
        });

        if (self.project.attributes.runTime) {
            var totalSeconds = self.project.attributes.runTime;
            self.runtime = {};
            self.runtime.hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            self.runtime.mins = Math.floor(totalSeconds / 60);
            self.runtime.secs = totalSeconds % 60;
        }

        if (angular.isString(self.project.attributes.video_url)) {
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
            self.project.runTime = (self.runtime.hours * 3600) + (self.runtime.mins * 60) + self.runtime.secs;
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
                    return self.project.thumbnail_url = 'http://img.youtube.com/vi/' + video_id + '/mqdefault.jpg';
                } else if (url.indexOf('vimeo') != -1) {
                    var video_id = url.split('.com/')[1];
                    $http.jsonp('http://www.vimeo.com/api/v2/video/' + video_id + '.json?callback=JSON_CALLBACK').then(function (res) {
                        return self.project.thumbnail_url = res.data[0].thumbnail_large;
                    });
                } else if (url.indexOf('dailymotion') != -1) {
                    var video_id = url.split('video/')[1].split('_')[0];
                    $http.get('https://api.dailymotion.com/video/' + video_id + '?fields=thumbnail_large_url').then(function (res) {
                        return self.project.thumbnail_url = res.data.thumbnail_large_url;
                    });
                } else if (url.indexOf('youku') != -1) {

                } else if (url.indexOf('vine') != -1) {
                    $http.get('/alpha/utils/get-vine-data.php?url=' + url).then(function (res) {
                        return self.project.thumbnail_url = res.data;
                    });

                }
            }
        };

        self.updateProject = function () {
            self.project.set('name', self.project.attributes.name);
            self.project.set('name_lowercase', self.project.attributes.name.toLowerCase());
            self.project.set('runTime', self.project.attributes.runTime);
            self.project.set('description', self.project.attributes.description);
            self.project.set('director', self.project.attributes.director);
            self.project.set('writer', self.project.attributes.writer);
            self.project.set('producers', self.project.attributes.producers);
            self.project.set('synopsis', self.project.attributes.synopsis);
            self.project.set('completionDate', self.dateOfCompl);
            self.project.set('video_url', self.project.attributes.video_url);
            self.project.set('thumbnail_url', self.project.attributes.thumbnailUrl);
            self.project.set('disableComments', self.project.attributes.disableComments || false);
            self.project.set('disableCritique', self.project.attributes.disableCritique || false);
            self.project.save().then(function (res1) {
                if (self.filmGenre.attributes.type.id !== self.project.attributes.type.id) {
                    self.filmGenre.set('type', {__type: "Pointer", className: "Type", objectId: self.newVideo.type});
                }
                //self.filmGenre.unset('genres');
                var relation = self.filmGenre.relation("genres");
                _.each(self.projectGenres, function (a) {
                    var Genre = Parse.Object.extend("Genre");
                    relation.add(new Genre({id: a}));
                });
                self.filmGenre.save().then(function (res2) {
                    $rootScope.toastMessage('Project Updated');
                    $state.go('video', {id: self.project.id});
                });
            });

        };

        self.deleteProject = function (ev) {
            if ($rootScope.AppData.User && ($rootScope.AppData.User.id === self.project.attributes.owner.id)) {
                var confirm = $mdDialog.confirm()
                    .title('Would you like to delete your project?')
                    //.content('All of the banks have agreed to <span class="debt-be-gone">forgive</span> you your debts.')
                    //.ariaLabel('Lucky day')
                    .targetEvent(ev)
                    .ok('Delete it!')
                    .cancel('Never mind');
                $mdDialog.show(confirm).then(function () {
                    //self.project.set('disableProject', true);
                    self.project.destroy({
                        success: function(myObject) {
                            // The object was deleted from the Parse Cloud.
                            $state.go('profile');
                        },
                        error: function(myObject, error) {
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
    function VideoCritiqueCtrl($rootScope, $scope, $mdDialog, UserActions, UtilsService) {
        'use strict';

        Parse.Object.extend({
            className: "Comment",
            attrs: ['body', 'parentFilm', 'parentCritique', 'parentComment', 'author', 'replyCount', 'repliedAt']
        });

        var self = this;
        // Fetch Critique
        var critiqueQuery = new Parse.Query("Critique");
        critiqueQuery.include(["author", "parent.owner", "parent.type"]);
        critiqueQuery.get($rootScope.$stateParams.id).then(function (result) {
            self.critique = result;
            self.film = result.attributes.parent;
            $scope.commentsParent = self.critique;
            console.log('Critique: ', result);
            //self.loaded = true;
            //$scope.$broadcast('scroll.refreshComplete');

            // Fetch Comments
            var commentsQuery = new Parse.Query("Comment");
            commentsQuery.equalTo('parentCritique', self.critique);
            commentsQuery.include("author");
            commentsQuery.doesNotExist("parentComment");
            commentsQuery.find().then(function (result) {
                console.log("Comments: ", result);
                self.comments = result;
            });
        });

        // Handle Message and Comment Inputs
        self.myMessage = null;
        self.showMessageInput = false;

        self.toggleCommentInput = function () {
            self.showCommentInput = !self.showCommentInput;
        };

        self.toggleReplyInput = function (comment) {
            $scope.showReplyInput = !$scope.showReplyInput;
            $scope.targetComment = self.targetComment = comment;
        };

        self.postReply = function () {
            UserActions.checkAuth().then(function (res) {
                if (res) {
                    var comment = new Parse.Object("Comment");
                    comment.set('body', self.myReply);
                    comment.set('parentCritique', self.critique);
                    angular.isDefined(self.targetComment.attributes.parentComment)
                        ? comment.set('parentComment', self.targetComment.attributes.parentComment)
                        : comment.set('parentComment', {
                        __type: "Pointer",
                        className: "Comment",
                        objectId: self.targetComment.id
                    });
                    comment.set('author', Parse.User.current());
                    comment.save(null).then(function (comment) {
                        _.find(self.comments, function (a) {
                            return a.id === self.targetComment.id
                        }).replies.push(comment);
                        //self.comments.push(comment);
                        $rootScope.toastMessage('Reply posted!');
                        self.myReply = null;

                        // Increment original comment replyCount
                        self.targetComment.increment('replyCount');
                        self.targetComment.set('repliedAt', moment().toDate());
                        self.targetComment.save().then(function (parentComment) {
                            console.log(parentComment);
                            self.toggleReplyInput(undefined);
                        });

                        // Increment film commentCount
                        self.critique.increment('commentCount');
                        self.critique.save();

                    }, function (error) {
                        alert('Failed to create new reply, with error code: ' + error.message);
                    });
                }
            })
        };
    }
    function UploadCtrl($rootScope, ParseService, $state, $http, UtilsService) {
        'use strict';

        Parse.Object.extend({
            className: "Film",
            attrs: ['name', 'description', 'director', 'writer', 'producers', 'synopsis', 'language', 'completionDate', 'filmingCountry', 'originCountry', 'owner', 'type',
                'pastAwards', 'keyCast', 'runTime', 'thumbnailUrl', 'video_file', 'video_url', 'disableComments', 'disableCritique']
        });

        Parse.Object.extend({
            className: "Film_Genre",
            attrs: ['film', 'genres', 'type']
        });

        var self = this;

        self.newVideo = {
            name: '',
            description: '',
            director: '',
            writer: '',
            producers: '',
            synopsis: '',
            keyCast: '',
            language: '',
            completionDate: undefined,
            filmingCountry: undefined,
            originCountry: undefined,
            owner: Parse.User.current(),
            genres: undefined,
            type: undefined,
            pastAwards: '',
            runTime: 0,
            thumbnailUrl: '',
            video_file: undefined,
            video_url: '',
            tags: []
        };

        self.runtime = {
            hours: 0,
            mins: 0,
            secs: 0
        };

        self.maxDate = moment().toDate();

        self.selectedGenre = null;

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
                    var video_id = url.split('v=')[1].split('&')[0];
                    return self.newVideo.thumbnailUrl = 'http://img.youtube.com/vi/' + video_id + '/mqdefault.jpg';
                } else if (url.indexOf('vimeo') != -1) {
                    var video_id = url.split('.com/')[1];
                    $http.jsonp('http://www.vimeo.com/api/v2/video/' + video_id + '.json?callback=JSON_CALLBACK').then(function (res) {
                        return self.newVideo.thumbnailUrl = res.data[0].thumbnail_large;
                    });
                } else if (url.indexOf('dailymotion') != -1) {
                    var video_id = url.split('video/')[1].split('_')[0];
                    $http.get('https://api.dailymotion.com/video/' + video_id + '?fields=thumbnail_large_url').then(function (res) {
                        return self.newVideo.thumbnailUrl = res.data.thumbnail_large_url;
                    });
                } else if (url.indexOf('youku') != -1) {

                } else if (url.indexOf('vine') != -1) {
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
            if (angular.isUndefined(self.newVideo.genres) || (angular.isArray(self.newVideo.genres) && !self.newVideo.genres.length)) {
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
            if (!test) $rootScope.toastMessage(msg);
            return test;
        };

        self.submitNewVideo = function () {
            if (!!self.validateNewVideoForm()) {
                var film = new Parse.Object("Film");
                film.set('name', self.newVideo.name);
                film.set('name_lowercase', self.newVideo.name.toLowerCase());
                film.set('description', self.newVideo.description);
                film.set('director', self.newVideo.director);
                film.set('writer', self.newVideo.writer);
                film.set('producers', self.newVideo.producers);
                film.set('synopsis', self.newVideo.synopsis);
                film.set('completionDate', self.newVideo.completionDate);
                film.set('owner', self.newVideo.owner);
                film.set('runTime', self.newVideo.runTime);
                film.set('video_url', self.newVideo.video_url);
                film.set('thumbnail_url', self.newVideo.thumbnailUrl);
                film.set('tags', self.newVideo.tags||[]);
                film.set('disableComments', self.newVideo.disableComments || false);
                film.set('disableCritique', self.newVideo.disableCritique || false);
                //film.set('disableProject', false);
                film.set('unlist', false);

                // Must check so that new null objects are not created
                if (angular.isString(self.newVideo.language))
                    film.set('language', {__type: "Pointer", className: "Language", objectId: self.newVideo.language});
                if (angular.isString(self.newVideo.filmingCountry))
                    film.set('filmingCountry', {
                        __type: "Pointer",
                        className: "Country",
                        objectId: self.newVideo.filmingCountry
                    });
                if (angular.isString(self.newVideo.originCountry))
                    film.set('originCountry', {
                        __type: "Pointer",
                        className: "Country",
                        objectId: self.newVideo.originCountry
                    });
                if (angular.isString(self.newVideo.type))
                    film.set('type', {__type: "Pointer", className: "Type", objectId: self.newVideo.type});


                film.save(null).then(
                    function (film) {
                        //console.log('New film created with objectId: ' + film.id);
                        //console.log(film);
                        // create Film_Genre object
                        var filmGenre = new Parse.Object("Film_Genre");
                        filmGenre.set('film', {__type: "Pointer", className: "Film", objectId: film.id});
                        filmGenre.set('type', {__type: "Pointer", className: "Type", objectId: self.newVideo.type});
                        var relation = filmGenre.relation("genres");
                        _.each(self.newVideo.genres, function (a) {
                            var Genre = Parse.Object.extend("Genre");
                            relation.add(new Genre({id: a}));
                        });
                        filmGenre.save(null).then(
                            function (fg) {
                                // the object was saved.
                                //console.log('New filmGenre created with objectId: ' + fg.id);
                                $rootScope.toastMessage('Video Uploaded Successfully');
                                $state.go('video', {id: film.id});
                            },
                            function (error) {
                                // saving the object failed.
                                alert('Failed to create new film_genre, with error code: ' + error.message);
                            });

                        // register Action
                        UtilsService.recordActivity(film, 'upload');

                    },
                    function (error) {
                        // saving the object failed.
                        alert('Failed to create new film, with error code: ' + error.message);
                    });
            } else {
                //$rootScope.toastMessage('Please check the form!');
            }
        };
    }
    function ProfileCtrl($rootScope, ParseService, $state, $mdDialog) {
        'use strict';

        var self = this;
        console.log($rootScope.AppData.User);
        console.log($rootScope.$state);
        $rootScope.metadata.title = 'Profile';
        // Fetch Projects
        var innerQuery = new Parse.Query("Film");
        innerQuery.equalTo("owner", Parse.User.current());
        //innerQuery.notEqualTo("disableProject", true);
        innerQuery.notEqualTo("unlist", true);
        var query = new Parse.Query("Film_Genre");
        query.matchesQuery("film", innerQuery);
        query.include(["film.type", "film.owner"]);
        query.descending("createdAt");
        query.find().then(function (result) {
            console.log(result);
            self.projects = result;
        });

        // Fetch Favorites
        var favoritesQuery = new Parse.Query("Favorites");
        //query.matchesQuery("film", innerQuery);
        favoritesQuery.equalTo("user", Parse.User.current());
        favoritesQuery.include(["project.owner", "project.type"]);
        favoritesQuery.descending("createdAt");
        favoritesQuery.find().then(function (result) {
            console.log(result);
            self.favorites = result;
        });

        // Fetch WatchLater
        var watchLaterQuery = new Parse.Query("WatchLater");
        //query.matchesQuery("film", innerQuery);
        watchLaterQuery.equalTo("user", Parse.User.current());
        watchLaterQuery.include(["project.owner", "project.type"]);
        watchLaterQuery.descending("createdAt");
        watchLaterQuery.find().then(function (result) {
            console.log(result);
            self.watchlaters = result;
        });

        // Fetch My Critiques
        var critiqueQuery = new Parse.Query("Critique");
        critiqueQuery.equalTo('author', Parse.User.current());
        critiqueQuery.include(['parent', 'author']);
        critiqueQuery.find().then(function (result) {
            self.myCritiques = result;
        });

        // Fetch My Critiqued
        var critiquedQuery = new Parse.Query("Critique");
        critiquedQuery.notEqualTo('author', Parse.User.current());
        critiquedQuery.include(['parent', 'author']);
        critiquedQuery.matchesQuery("parent", innerQuery);
        critiquedQuery.find().then(function (result) {
            self.myCritiqued = result;
        });

        // Fetch My Reactions
        var reactionQuery = new Parse.Query("Reaction");
        reactionQuery.equalTo('user', Parse.User.current());
        reactionQuery.include(['parent', 'user']);
        reactionQuery.find().then(function (result) {
            self.myReactions = result;
        });

        // Fetch My Reacted
        var reactedQuery = new Parse.Query("Reaction");
        reactedQuery.notEqualTo('user', Parse.User.current());
        reactedQuery.include(['parent', 'user']);
        reactedQuery.matchesQuery("parent", innerQuery);
        reactedQuery.find().then(function (result) {
            self.myReacted = result;
        });

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
    function UserCtrl($rootScope, ParseService, $state) {
        'use strict';

        var self = this;

        var userQuery = new Parse.Query("_User");
        userQuery.get($rootScope.$stateParams.id).then(function (user) {
            self.user = user;
            $rootScope.metadata.title = 'Profile: '+user.attributes.first_name+' '+user.attributes.last_name;

            // Fetch Projects
            var innerQuery = new Parse.Query("Film");
            //innerQuery.notEqualTo("disableProject", true);
            innerQuery.notEqualTo("unlist", true);
            innerQuery.equalTo("owner", self.user);
            var query = new Parse.Query("Film_Genre");
            query.matchesQuery("film", innerQuery);
            query.include(["film.type", "film.owner"]);
            query.descending("createdAt");
            query.find().then(function (result) {
                console.log(result);
                self.projects = result;
            });

            // Fetch My Critiques
            var critiqueQuery = new Parse.Query("Critique");
            critiqueQuery.equalTo('author', self.user);
            critiqueQuery.include(['parent', 'author']);
            critiqueQuery.find().then(function (result) {
                self.myCritiques = result;
            });

            // Fetch My Critiqued
            var critiquedQuery = new Parse.Query("Critique");
            critiquedQuery.notEqualTo('author', self.user);
            critiquedQuery.include(['parent', 'author']);
            critiquedQuery.matchesQuery("parent", innerQuery);
            critiquedQuery.find().then(function (result) {
                self.myCritiqued = result;
            });

            // Fetch My Reactions
            var reactionQuery = new Parse.Query("Reaction");
            reactionQuery.equalTo('user', self.user);
            reactionQuery.include(['parent', 'user']);
            reactionQuery.find().then(function (result) {
                self.myReactions = result;
            });

            // Fetch My Reacted
            var reactedQuery = new Parse.Query("Reaction");
            reactedQuery.notEqualTo('user', self.user);
            reactedQuery.include(['parent', 'user']);
            reactedQuery.matchesQuery("parent", innerQuery);
            reactedQuery.find().then(function (result) {
                self.myReacted = result;
            });

        });

        self.getEmoticonByEmotion = function (emotion) {
            var reactions = $rootScope.generateReactions();
            return _.findWhere(reactions, {emotion: emotion});
        };


    }
    function EditProfileCtrl($rootScope, $scope, AuthService, ParseService, $state) {
        'use strict';
        $rootScope.metadata.title = 'Edit Profile';

        var self = this;
        self.user = {
            email: $rootScope.AppData.User.attributes.email,
            usertag: $rootScope.AppData.User.attributes.usertag,
            first_name: $rootScope.AppData.User.attributes.first_name,
            last_name: $rootScope.AppData.User.attributes.last_name,
            bio: $rootScope.AppData.User.attributes.bio,
            avatar: $rootScope.AppData.User.attributes.avatar,
        };
        self.socials = {
            facebook: Parse.FacebookUtils.isLinked($rootScope.AppData.User),
            twitter: false,
            google: false,
            instagram: false
        };

        self.getGenres = function () {
            ParseService.genres();
        };

        self.doLink = function (social) {
            switch (social) {
                case 'facebook':
                    AuthService.linkWithFB().then(function (res) {
                        self.socials.facebook = Parse.FacebookUtils.isLinked($rootScope.AppData.User);
                    });
                    break;
                default :
                    break;
            }
        };
        self.doUnlink = function (social) {
            switch (social) {
                case 'facebook':
                    AuthService.unlinkWithFB().then(function (res) {
                        self.socials.facebook = Parse.FacebookUtils.isLinked($rootScope.AppData.User);
                    });
                    break;
                default :
                    break;
            }
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
    function MessagesCtrl($rootScope, $mdSidenav, UserActions, UtilsService) {
        "use strict";
        $rootScope.metadata.title = 'Messages';

        Parse.Object.extend({
            className: "Conversation",
            attrs: ['name', 'participants']
        });

        Parse.Object.extend({
            className: "Message",
            attrs: ['body', 'from', 'parent']
        });

        var self = this;
        self.newMode = false;
        self.myReply = null;
        // Fetch Conversations, Participants, and Messages

        // Fetch Conversations
        var msgsQuery = new Parse.Query("Conversation");
        msgsQuery.equalTo("participants", Parse.User.current());
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

        self.toggleConvoNav = function () {
            $mdSidenav('ConvoNav').toggle();
        };

        self.selectConvo = function (convo) {
            self.selectedConvo = convo;
            self.currentParticipants = convo.participants;
            var msgsQuery = new Parse.Query("Message");
            msgsQuery.equalTo("parent", convo);
            msgsQuery.include(['from']);
            msgsQuery.find().then(function (msgs) {
                //console.log('Messages: ', msgs);
                self.messages = msgs;
            });
        };

        self.postReply = function () {
            UserActions.checkAuth().then(function (res) {
                if (res) {
                    var message = new Parse.Object("Message");
                    message.set('body', self.myReply);
                    message.set('parent', {__type: "Pointer", className: "Conversation", objectId: self.selectedConvo.id});
                    message.set('from', Parse.User.current());
                    message.save().then(function (result) {
                        self.myReply = null;
                        self.messages.push(result);
                        // TODO: Send email notification
                        result.participants
                        UtilsService.recordActivity(result);
                    });

                    self.selectedConvo.set('updatedAt', moment().toDate());
                    self.selectedConvo.save();

                    //message.set('to', {__type: "Pointer", className: "_User", objectId: self.film.attributes.owner.id});
                    //message.set('from', Parse.User.current();
                }
            })
        };
    }
    function NotificationsCtrl($rootScope, UserActions, UtilsService) {
        "use strict";

    }
//})();