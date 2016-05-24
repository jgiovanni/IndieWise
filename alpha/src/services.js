(function () {
    'use strict';
    angular
        .module('IndieWise.services', [])
        .factory('ParseSDK', ['$q', function ($q) {
            // pro-tip: swap these keys out for PROD keys automatically on deploy using grunt-replace
            Parse.initialize("KkQqsTBaxOWqkoWjrPjz1CyL1iKmPRikVVG1Hwem", "nw73aGJuOatZrYSNMQpmmFILwOZVA0mTnp4BYbSL");

            // FACEBOOK init
            var fbDeferred = $q.defer();
            window.fbPromise = fbDeferred.promise;
            window.fbAsyncInit = function () {
                fbDeferred.resolve();
            };

            window.fbPromise.then(function () {
                Parse.FacebookUtils.init({
                    appId: 150687055270744, // Facebook App ID
                    //status: true,
                    cookie: true, // enable cookies to allow Parse to access the session
                    xfbml: true, // parse XFBML
                    frictionlessRequests: true // recommended
                });
            });
            return true;

        }])
        .factory('FacebookAngularPatch', function ($q, $timeout) {

            var fbApiAngular = function () {

                var params = [].splice.call(arguments, 0);
                var defer = $q.defer();
                var angularWrap = $timeout;

                window.fbPromise.then(function () {

                    // Pushing callback function that will resolve to the params array
                    params.push(function (response) {
                        if (!_.isUndefined(response.error)) {
                            angularWrap(function () {
                                defer.reject(response.error);
                            });
                            return;
                        }

                        angularWrap(function () {
                            defer.resolve(response);
                        });
                    });

                    FB.api.apply(FB, params);

                });

                return defer.promise;
            };


            // using the fbPromise we set up in index.html, we extend the FB SDK with FB.apiAngular
            // now we use FB.apiAngular instead of FB.api, which gives us an angular wrapped promise

            window.fbPromise.then(function () {
                FB.apiAngular = fbApiAngular;
            });


        })
        .factory('AuthService', ['$rootScope', '$q', '$localForage', '$state', 'UtilsService', 'Backand', '$http',
            function ($rootScope, $q, $localForage, $state, UtilsService, Backand, $http) {
                /**
                 *
                 * @returns {*}
                 */


                var service = {
                    /**
                     *
                     * @param _userParams
                     */
                    createUser: function (_userParams) {
                        return Backand.signup(_userParams.firstName, _userParams.lastName, _userParams.email, _userParams.password, _userParams.passwordCheck, {
                            username: _userParams.email,
                            country: _userParams.country,
                            dob: moment(_userParams.dob).startOf('day').toDate(),
                            gender: _userParams.gender,
                            selected_genres: [],
                            selected_types: []
                        })
                            .then(function (userData) {
                                service.getCurrentUser();
                                service.error = '';
                                console.log('User ' + userData.username + ' created successfully!');
                                return service.login(_userParams.email, _userParams.password).then(function (res) {
                                    console.log(res);
                                    $state.go('home');
                                });
                            }, function (error) {
                                console.log(error);
                                service.error = error.error_description || 'Unknown error from server';
                            }
                        );
                    },
                    /**
                     *
                     * @param _userParams
                     */
                    updateUser: function (_userParams) {
                        return Backand.getUserDetails().then(function (response) {
                            $rootScope.AppData.User = service.currentUser = response;
                            return $http({
                                method: 'PUT',
                                url: Backand.getApiUrl() + '/1/objects/users/' + _userParams.id,
                                data: _userParams,
                                headers: {
                                    Authorization: response.access_token,
                                    AppName: 'indiewise'
                                }
                            });
                        });
                    },
                    /**
                     *
                     * @param Back&
                     * @returns {Promise}
                     */
                    currentUser: null,
                    getCurrentUser: function () {
                        var p = Backand.getUserDetails();
                        p.then(function (response) {
                            $rootScope.AppData.User = service.currentUser = response;
                            service.getCurrentUserData();
                            //console.log(response);
                        });
                    },
                    currentUserData: null,
                    getCurrentUserData: function () {
                        var deferred = $q.defer();
                        var user = Backand.getUserDetails();
                        user.then(function (data) {
                            if (data) {
                                var p = $http({
                                    method: 'GET',
                                    url: Backand.getApiUrl() + '/1/objects/users/' + data.userId,
                                    params: {
                                        deep: false,
                                    }
                                });
                                p.then(function (response) {
                                    $rootScope.AppData.UserData = service.currentUserData = response.data;
                                    deferred.resolve(response);
                                });

                            } else {
                                return $q.reject(null);
                            }
                        });
                        return deferred.promise;
                    },
                    /**
                     *
                     * @param _user
                     * @param _password
                     * @returns {Promise}
                     */
                    login: function (_user, _password) {
                        //sign in to Backand
                        return Backand.signin(_user, _password)
                            .then(
                            function (response) {
                                service.getCurrentUser();
                            },
                            function (data) {
                                console.log(data);
                                self.error = data && data.error_description || 'Unknown error from server';
                            }
                        );
                    },
                    /**
                     *
                     * @returns {Promise}
                     */
                    logout: function () {
                        var defered = $q.defer();
                        Backand.signout();
                        $localForage.removeItem('User');
                        $rootScope.AppData.User = undefined;
                        defered.resolve(true);
                        return defered.promise;

                    },
                    /**
                     *
                     * @param email
                     * @returns {Promise}
                     */
                    passwordReset: function (email) {
                        // TODO change to backend
                        return Parse.User.requestPasswordReset(email).then(function (res) {
                            console.log(res);
                            return res;
                        }, function (error) {
                            //console.log(error);
                            return error;
                        });
                    },
                    socialLogin: function (provider, newUser) {
                        var socialSignIn = newUser ? Backand.socialSignUp(provider) : Backand.socialSignIn(provider);
                        return socialSignIn
                            .then(function (userData) {
                                service.getCurrentUser();
                                self.error = '';
                                if (newUser) {
                                    console.log('User ' + userData.username + ' created successfully!');
                                }
                            }, function (error) {
                                self.error = error && error.error_description || 'Unknown error from server';
                                console.log(self.error);
                            }
                        )
                    }
                };

                function _init() {
                    service.getCurrentUser();
                }

                _init();
                return service;
            }
        ])
        .factory('UserActions', ['$rootScope', '$q', 'AuthService', 'DataService', 'UtilsService', '$timeout', '$modal', '$mdMedia', function ($rootScope, $q, AuthService, DataService, UtilsService, $timeout, $modal, $mdMedia) {
            var service = {
                checkAuth: function () {
                    var deferred = $q.defer();
                    AuthService.currentUser ? deferred.resolve(true) : deferred.reject(false);
                    return deferred.promise;
                },
                markAsWatched: function (video) {
                    // Set as watched when user has watched 20% for the video's runtime or 6 seconds
                    var time = 0;// (video.attributes.runTime * 200) || 6000;
                    return $timeout(function () {
                        //console.log('Marked as Watched');
                        UtilsService.recordActivity(video, 'watch');
                    }, time);
                },
                cancelWatched: function (promise) {
                    $timeout.cancel(promise);
                },
                canCritique: function (filmId) {
                    var deferred = $q.defer();
                    if (AuthService.currentUser) {
                        DataService.query('canCritique', {filmId: filmId, userId: AuthService.currentUser.userId})
                            .then(function (res) {
                                res.data.length
                                    // critique exists already from this user
                                    ? deferred.reject(res.data[0])
                                    // user hasn't critiqued yet
                                    : deferred.resolve(true);
                            });
                    } else {
                        deferred.reject(false);
                    }
                    return deferred.promise;
                },
                canReact: function (filmId) {
                    var deferred = $q.defer();
                    if (AuthService.currentUser) {
                        DataService.query('canReact', {filmId: filmId, userId: AuthService.currentUser.userId})
                            .then(function (res) {
                                res.data.length
                                    // critique exists already from this user
                                    ? deferred.reject(res.data[0])
                                    // user hasn't critiqued yet
                                    : deferred.resolve(true);
                            });
                    } else {
                        deferred.reject(false);
                    }
                    return deferred.promise;
                },
                canRate: function (filmId) {
                    var deferred = $q.defer();
                    if (AuthService.currentUser) {
                        DataService.query('canRate', {filmId: filmId, userId: AuthService.currentUser.userId})
                            .then(function (res) {
                                res.data.length
                                    // critique exists already from this user
                                    ? deferred.reject(res.data[0])
                                    // user hasn't critiqued yet
                                    : deferred.resolve(true);
                            });
                    } else {
                        deferred.reject(false);
                    }
                    return deferred.promise;
                },
                checkFavorite: function (obj) {
                    var deferred = $q.defer();
                    service.checkAuth().then(function (res) {
                        DataService.query('checkFavorite', {
                            parentId: obj.id,
                            userId: AuthService.currentUser.userId
                        }).then(function (res) {
                            if (res.data.length) {
                                deferred.resolve(res.data[0]);
                            } else {
                                deferred.reject(false);
                            }
                        });
                    }, function (err) {
                        deferred.reject('login');
                        //service.loginModal();
                    });
                    return deferred.promise;
                },
                favorite: function (obj) {
                    service.checkAuth().then(function (res) {
                        DataService.query('checkFavorite', {
                            parentId: obj.id,
                            userId: AuthService.currentUser.userId
                        }).then(function (res) {
                            if (res.data.length) {
                                DataService.delete('Favorites', res.data[0].id);
                                $rootScope.toastMessage('Removed from Favorites');
                            } else {
                                DataService.save('Favorites', {
                                    project: obj.id,
                                    user: AuthService.currentUser.userId
                                }).then(function (res) {
                                    $rootScope.toastMessage('Added to Favorites');
                                }, function (err) {
                                    console.log('Error: ', err);
                                });
                            }
                        });
                    }, function (err) {
                        service.loginModal();
                    });
                },
                checkWatchLater: function (obj) {
                    var deferred = $q.defer();
                    service.checkAuth().then(function (res) {
                        DataService.query('checkWatchLater', {
                            parentId: obj.id,
                            userId: AuthService.currentUser.userId
                        }).then(function (res) {
                            if (res.data.length) {
                                deferred.resolve(res.data[0]);
                            } else {
                                deferred.reject(false);
                            }
                        });
                    }, function (err) {
                        deferred.reject('login');
                        //service.loginModal();
                    });
                    return deferred.promise;
                },
                watchLater: function (obj) {
                    service.checkAuth().then(function (res) {
                        DataService.query('checkWatchLater', {
                            parentId: obj.id,
                            userId: AuthService.currentUser.userId
                        }).then(function (res) {
                            if (res.data.length) {
                                DataService.delete('WatchLater', res.data[0].id);
                                $rootScope.toastMessage('Removed from Watch Later');
                            } else {
                                DataService.save('WatchLater', {
                                    project: obj.id,
                                    user: AuthService.currentUser.userId
                                }).then(function (res) {
                                    $rootScope.toastMessage('Added to Watch Later');
                                }, function (err) {
                                    console.log('Error: ', err);
                                });
                            }
                        });
                    }, function (err) {
                        service.loginModal();
                    });
                },
                loginModal: function () {
                    if (!$rootScope.authModalOpen) {
                        var modalInstance = $modal.open({
                            controller: SignInModalCtrl,
                            controllerAs: 'SIC',
                            templateUrl: './src/auth/sign-in-dialog.html',
                            size: Foundation.MediaQuery.atLeast('medium') ? 'large' : 'full'
                        });
                        modalInstance.result.then(function (answer) {
                            console.log(answer);
                            $rootScope.authModalOpen = false;
                            zIndexPlayer(true);
                        }, function () {
                            console.log('You cancelled the dialog.');
                            $rootScope.authModalOpen = false;
                            zIndexPlayer(true);
                        });
                        $rootScope.authModalOpen = true;
                    }
                }
            };

            return service;
        }])
        .factory('DataService', DataService)
        .factory('ParseService', ['$rootScope', '$q', '$localForage', function ($rootScope, $q, $localForage) {
            var service = {
                genres: function () {
                    var deferred = $q.defer();

                    $localForage.getItem('genres').then(function (genres) {
                        if (genres) {
                            if (angular.isUndefined(genres[0].attributes)) {
                                $localForage.removeItem('genres').then(function () {
                                    service.genres();
                                });
                            } else {
                                $rootScope.genresList = genres;
                                deferred.resolve(genres);
                            }
                        } else {
                            var genreQuery = new Parse.Query("Genre");
                            genreQuery.find().then(function (result) {
                                $rootScope.genresList = result;
                                $localForage.setItem('genres', result);
                                deferred.resolve(result);
                            });
                        }
                    });
                    return deferred.promise;
                },

                types: function () {
                    var deferred = $q.defer();

                    $localForage.getItem('types').then(function (types) {
                        if (types) {
                            if (angular.isUndefined(types[0].attributes)) {
                                $localForage.removeItem('types').then(function () {
                                    service.types();
                                });
                            } else {
                                $rootScope.typesList = types;
                                deferred.resolve(types);
                            }
                        } else {
                            var typeQuery = new Parse.Query("Type");
                            typeQuery.find().then(function (result) {
                                $rootScope.typesList = result;
                                $localForage.setItem('types', result);
                                deferred.resolve(result);
                            });
                        }
                    });

                    return deferred.promise;
                },

                countries: function () {
                    var deferred = $q.defer();

                    $localForage.getItem('countries').then(function (countries) {
                        if (countries) {
                            if (angular.isUndefined(countries[0].attributes)) {
                                $localForage.removeItem('countries').then(function () {
                                    service.countries();
                                });
                            } else {
                                $rootScope.countryList = countries;
                                deferred.resolve(countries);
                            }
                        } else {
                            var typeQuery = new Parse.Query("Country");
                            typeQuery.limit(500);
                            typeQuery.find().then(function (result) {
                                $rootScope.countryList = result;
                                $localForage.setItem('countries', result);
                                deferred.resolve(result);
                            });
                        }
                    });

                    return deferred.promise;
                },

                languages: function () {
                    var deferred = $q.defer();

                    $localForage.getItem('languages').then(function (languages) {
                        if (languages) {
                            if (angular.isUndefined(languages[0].attributes)) {
                                $localForage.removeItem('languages').then(function () {
                                    service.languages();
                                });
                            } else {
                                $rootScope.languageList = languages;
                                deferred.resolve(languages);
                            }
                        } else {
                            var typeQuery = new Parse.Query("Language");
                            typeQuery.limit(500);
                            typeQuery.find().then(function (result) {
                                $rootScope.languageList = result;
                                $localForage.setItem('languages', result);
                                deferred.resolve(result);
                            });
                        }
                    });

                    return deferred.promise;
                }
            };

            return service;
        }])
        .factory('linkify', ['$filter', function ($filter) {
            function _linkifyAsType(type) {
                return function (str) {
                    (type, str);
                    return $filter('linkify')(str, type);
                };
            }

            return {
                twitter: _linkifyAsType('twitter'),
                github: _linkifyAsType('github'),
                normal: _linkifyAsType()
            };
        }]);

    DataService.$inject = ['$rootScope', '$http', 'Backand', 'AuthService', '$q'];
    function DataService($rootScope, $http, Backand, AuthService, $q) {
        var vm = this;
        //get the object name and optional parameters
        vm.getList = function (name, sort, filter, size, deep, relatedObjects, page, search) {
            return $http({
                method: 'GET',
                url: Backand.getApiUrl() + '/1/objects/' + name,
                params: {
                    pageSize: size || 20,
                    pageNumber: page || 1,
                    filter: filter || '',
                    sort: sort || '',
                    deep: deep || false,
                    relatedObjects: relatedObjects || false,
                    search: search || ''
                }
            });
        };
        vm.getItem = function (name, id, deep, exclude, level) {
            return $http({
                method: 'GET',
                url: Backand.getApiUrl() + '/1/objects/' + name + '/' + id,
                params: {
                    deep: deep || false,
                    exclude: exclude || '',
                    level: level || 1
                }
            });
        };
        vm.query = function (name, params) {
            return $http({
                method: 'GET',
                url: Backand.getApiUrl() + '/1/query/data/' + name,
                params: {
                    parameters: params
                }
            });
        };
        vm.notifyMe = function (params) {
            return $http.post('utils/notify-me.php', params);
        };
        vm.save = function (name, params, deep, returnObject) {
            return Backand.getUserDetails().then(function (response) {
                $rootScope.AppData.User = AuthService.currentUser = response;
                return $http({
                    method: 'POST',
                    url: Backand.getApiUrl() + '/1/objects/' + name + '?deep=' + !!deep + '&returnObject=' + !!returnObject,
                    data: params,
                    headers: {
                        Authorization: response.access_token,
                        AppName: 'indiewise'
                    }
                });
            });
        };
        vm.update = function (name, id, params, deep, returnObject) {
            return Backand.getUserDetails().then(function (response) {
                $rootScope.AppData.User = AuthService.currentUser = response;
                angular.extend(params, {
                    __metadata: { id: id }
                });
                return $http({
                    method: 'PUT',
                    url: Backand.getApiUrl() + '/1/objects/' + name + '/' + id + '?deep=' + !!deep + '&returnObject=' + !!returnObject,
                    data: params,
                    headers: {
                        Authorization: response.access_token,
                        AppName: 'indiewise'
                    }
                });
            });
        };
        vm.increment = function (name, id, params, deep, returnObject) {
            var deferred = $q.defer();
            Backand.getUserDetails().then(function (userResponse) {
                $rootScope.AppData.User = AuthService.currentUser = userResponse;
                $http({
                    method: 'GET',
                    url: Backand.getApiUrl() + '/1/objects/' + name + '/' + id,
                    params: {
                        deep: deep || false,
                        //exclude: exclude || '',
                        //level: level || 1
                    }
                }).then(function (res) {
                    var data = {};
                    _.each(params, function (val, key) {
                        data[key] = (parseInt(res.data[key].valueOf())||0) + parseInt(val);
                    });
                    angular.extend(data, {
                        __metadata: { id: res.data.id }
                    });
                    $http({
                        method: 'PUT',
                        url: Backand.getApiUrl() + '/1/objects/' + name + '/' + id + '?deep=' + !!deep + '&returnObject=' + !!returnObject,
                        data: data,
                        headers: {
                            Authorization: userResponse.access_token,
                            AppName: 'indiewise'
                        }
                    }).then(function (a) {
                        console.log(a);
                        deferred.resolve(a.data);
                    });
                });
            });

            return deferred.promise;
        };
        vm.delete = function (name, id) {
            return Backand.getUserDetails().then(function (response) {
                $rootScope.AppData.User = AuthService.currentUser = response;
                return $http({
                    method: 'DELETE',
                    url: Backand.getApiUrl() + '/1/objects/' + name + '/' + id,
                    headers: {
                        Authorization: response.access_token,
                        AppName: 'indiewise'
                    }
                });
            });
        };
        return vm;
    }

    SignInModalCtrl.$inject = ['$rootScope', '$timeout', '$q', '$state', 'AuthService', '$modalInstance'];
    function SignInModalCtrl($rootScope, $timeout, $q, $state, AuthService, $modalInstance) {
        zIndexPlayer();
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
                    //$state.go('home');
                    //window.location.reload();
                }
            }, function (res) {
                self.error = res;
                console.log('Failed', res);
            }).then(function () {
                self.ok();
            });
        };


        self.authenticate = function (provider) {
            self.error = null;
            AuthService.socialLogin(provider, false).then(function (a) {
                console.log(a);
            });
        };

        self.ok = function () {
            $modalInstance.close();
        };

        self.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $timeout(function () {
            jQuery(document).foundation();
            $timeout(function () {
                jQuery(document).foundation();
            }, 500);
        }, 0);
    }

    function zIndexPlayer(remove) {
        var vidDiv = jQuery('.flex-video');
        if(vidDiv) {
            !!remove ? vidDiv.css('z-index', '') : vidDiv.css('z-index', 0);
        }
    }

})();

