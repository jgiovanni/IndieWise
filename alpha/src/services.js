(function () {
    'use strict';
    angular
        .module('IndieWise.services', [])
        .factory('FacebookAngularPatch', function ($q, $timeout) {

            var fbApiAngular = function () {

                var params = [].splice.call(arguments, 0);
                var defer = $q.defer();
                var angularWrap = $timeout;

                window.fbPromise.then(function () {

                    // Pushing callback function that will resolve to the params array
                    params.push(function (response) {
                        if (!___.isUndefined(response.error)) {
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

            window.FB.init({
                appId: '150687055270744',
                status: true,
                cookie: true,
                xfbml: true,
                version: 'v2.4'
            });

            window.fbPromise.then(function () {
                FB.apiAngular = fbApiAngular;
            });


        })
        /*.factory('FacebookSDK', ['$window', 'FacebookAngularPatch', function ($window, FacebookAngularPatch) {
            $window.fbAsyncInit = function() {
                $window.FB.init({
                    appId: '150687055270744',
                    status: true,
                    cookie: true,
                    xfbml: true,
                    version: 'v2.4'
                });
            };
        }])*/
        .factory('AuthService', ['$rootScope', '$q', '$localForage', '$state', 'UtilsService', 'Backand', '$http', 'DataService', '$interval', '$window',
            function ($rootScope, $q, $localForage, $state, UtilsService, Backand, $http, DataService, $interval, $window) {
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
                            fullName: _userParams.firstName + ' ' + _userParams.lastName,
                            country: _userParams.country,
                            dob: moment(_userParams.dob).startOf('day').toDate(),
                            gender: _userParams.gender,
                            url_id: moment().valueOf()
                        })
                            .then(function (userData) {
                                service.error = '';
                                console.log('User ' + userData.username + ' created successfully!');
                                return service.login(_userParams.email, _userParams.password).then(function (res) {
                                    console.log(res);
                                    service.getCurrentUser().then(function (res) {
                                        console.log(res);
                                        /*var g = 0;
                                        var t = 0;
                                        if (angular.isArray(_userParams.genres) && _userParams.genres.length) {
                                            $interval(function () {
                                                DataService.save('Genres', {user: res.userId, genre: _userParams.genres[g++].id});
                                            }, 500, _userParams.genres.length);
                                        }
                                        if (angular.isArray(_userParams.types) && _userParams.types.length) {
                                            $interval(function () {
                                                DataService.save('UserTypes', {
                                                    user: res.userId,
                                                    type_id: _userParams.types[t].id,
                                                    type_name: _userParams.types[t++].name
                                                });
                                            }, 500, _userParams.types.length);
                                        }*/
                                        $state.go('profile.about');
                                    });
                                });
                            }, function (error) {
                                console.log(error);
                                service.error = error.error_description || 'Unknown error from server';
                            });
                    },
                    /**
                     *
                     * @param _userParams
                     */
                    updateUser: function (_userParams, deep, returnObject, level) {
                        return Backand.getUserDetails().then(function (response) {
                            $rootScope.AppData.User = service.currentUser = response;
                            return $http({
                                method: 'PUT',
                                url: Backand.getApiUrl() + '/1/objects/users/' + _userParams.id,
                                params: {deep: deep||true, returnObject: returnObject||false, level: level||1},
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
                        return p;
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
                                        deep: false
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
                        var defered = $q.defer();
                        //sign in to Backand
                        Backand.signin(_user, _password)
                            .then(function (response) {
                                service.getCurrentUser();
                                defered.resolve(true);
                            }, function (data) {
                                console.log(data);
                                self.error = data && data.error_description || 'Unknown error from server';
                                defered.reject(data);
                            }
                        );
                        return defered.promise;
                    },
                    /**
                     *
                     * @returns {Promise}
                     */
                    logout: function () {
                        var deferred = $q.defer();
                        Backand.signout();
                        $localForage.removeItem('User');
                        $rootScope.AppData.User = undefined;
                        deferred.resolve(true);
                        return deferred.promise;
                    },
                    /**
                     *
                     * @param email
                     * @returns {Promise}
                     */
                    requestPasswordReset: function (email) {
                        // TODO change to backend
                        return Backand.requestResetPassword(email).then(function (res) {
                            console.log(res);
                            return res;
                        }, function (error) {
                            //console.log(error);
                            return error;
                        });
                    },
                    passwordReset: function (password,token) {
                        // TODO change to backend
                        return Backand.resetPassword(password, token).then(function (res) {
                            console.log(res);
                            $state.go('sign_in');
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
                                    $state.go('profile.about');
                                } else {
                                    $state.go('home');
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
        .factory('linkify', ['$filter', function ($filter) {
            function _linkifyAsType(type) {
                return function (str) {
                    return $filter('linkify')(str, type);
                };
            }

            return {
                twitter: _linkifyAsType('twitter'),
                github: _linkifyAsType('github'),
                normal: _linkifyAsType()
            };
        }])
        .service('anchorSmoothScroll', function(){

            this.scrollTo = function(eID) {

                // This scrolling function
                // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript

                var startY = currentYPosition();
                var stopY = elmYPosition(eID);
                var distance = stopY > startY ? stopY - startY : startY - stopY;
                if (distance < 100) {
                    scrollTo(0, stopY); return;
                }
                var speed = Math.round(distance / 100);
                if (speed >= 20) speed = 20;
                var step = Math.round(distance / 25);
                var leapY = stopY > startY ? startY + step : startY - step;
                var timer = 0;
                if (stopY > startY) {
                    for ( var i=startY; i<stopY; i+=step ) {
                        setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                        leapY += step; if (leapY > stopY) leapY = stopY; timer++;
                    } return;
                }
                for ( var i=startY; i>stopY; i-=step ) {
                    setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                    leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
                }

                function currentYPosition() {
                    // Firefox, Chrome, Opera, Safari
                    if (self.pageYOffset) return self.pageYOffset;
                    // Internet Explorer 6 - standards mode
                    if (document.documentElement && document.documentElement.scrollTop)
                        return document.documentElement.scrollTop;
                    // Internet Explorer 6, 7 and 8
                    if (document.body.scrollTop) return document.body.scrollTop;
                    return 0;
                }

                function elmYPosition(eID) {
                    var elm = document.getElementById(eID);
                    var y = elm.offsetTop;
                    var node = elm;
                    while (node.offsetParent && node.offsetParent != document.body) {
                        node = node.offsetParent;
                        y += node.offsetTop;
                    } return y;
                }

            };

        });

    DataService.$inject = ['$rootScope', '$http', 'Backand', '$q'];
    function DataService($rootScope, $http, Backand, $q) {
        var vm = this;
        // Private API
        var API = 'http://52.207.215.154/api/';
        vm.collection = function (name, params) {
            var data = angular.extend({per_page: 10, page: 1}, params);
            return $http({
                method: 'GET',
                url: API + name,
                params: data
            });
        };
        vm.item = function (name, id, include, search) {
            return $http({
                method: 'GET',
                url: API + name + '/' + id,
                params: {
                    include: include,
                    search: search,
                }
            });
        };

        // Newsletter Form
        vm.notifyMe = function (params) {
            return $http.post('utils/notify-me.php', params);
        };
        //get the object name and optional parameters
        vm.query = function (name, params) {
            return $http({
                method: 'GET',
                url: Backand.getApiUrl() + '/1/query/data/' + name,
                params: {
                    parameters: params
                }
            });
        };
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
        vm.save = function (name, params, deep, returnObject) {
            return $http({
                method: 'POST',
                url: Backand.getApiUrl() + '/1/objects/' + name,
                params: {
                    deep: deep,
                    returnObject: returnObject
                },
                data: params,
                headers: {
                    Authorization: Backand.getToken(),
                    AppName: 'indiewise'
                }
            });
        };
        vm.update = function (name, id, params, deep, returnObject, direction) {
            if(params.hasOwnProperty('__metadata')) {
                angular.extend(params, {
                    __metadata: {id: id}
                });
            }
            return $http({
                method: 'PUT',
                url: Backand.getApiUrl() + '/1/objects/' + name + '/' + id,
                params: {
                    deep: deep,
                    returnObject: returnObject,
                    direction: direction || undefined
                },
                data: params,
                headers: {
                    Authorization: Backand.getToken(),
                    AppName: 'indiewise'
                }
            });
        };

        vm.action = function (object, action, params) {
            return $http ({
                method: 'GET',
                url: Backand.getApiUrl() + '/1/objects/action/'+ object,
                params: {
                    name: action,
                    parameters: params
                }
            });
        };

        vm.increment = function (name, id, params, deep, returnObject) {
            var deferred = $q.defer();
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
                ___.each(params, function (val, key) {
                    data[key] = (parseInt(res.data[key].valueOf()) || 0) + parseInt(val);
                });
                angular.extend(data, {
                    __metadata: {id: res.data.id}
                });
                $http({
                    method: 'PUT',
                    url: Backand.getApiUrl() + '/1/objects/' + name + '/' + id,
                    params: {
                        deep: deep,
                        returnObject: returnObject
                    },
                    data: data,
                    headers: {
                        Authorization: Backand.getToken(),
                        AppName: 'indiewise'
                    }
                }).then(function (a) {
                    console.log(a);
                    deferred.resolve(a.data);
                });
            });

            return deferred.promise;
        };
        vm.delete = function (name, id) {
            return $http({
                method: 'DELETE',
                url: Backand.getApiUrl() + '/1/objects/' + name + '/' + id,
                headers: {
                    Authorization: Backand.getToken(),
                    AppName: 'indiewise'
                }
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
        if (vidDiv) {
            !!remove ? vidDiv.css('z-index', '') : vidDiv.css('z-index', 0);
        }
    }

})();

