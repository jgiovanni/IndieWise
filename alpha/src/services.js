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
                    // pro-tip: swap App ID out for PROD App ID automatically on deploy using grunt-replace
                    appId: 150687055270744, // Facebook App ID
                    //channelUrl: 'http://brandid.github.io/parse-angular-demo/channel.html', // Channel File
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
        .factory('AuthService', ['$rootScope', '$q', '$localForage', '$state', 'UtilsService', '$auth',
            function ($rootScope, $q, $localForage, $state, UtilsService, $auth) {
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

                        var user = new Parse.User();
                        user.set("username", _userParams.email);
                        user.set("password", _userParams.password);
                        user.set("email", _userParams.email);
                        user.set("first_name", _userParams.first_name);
                        user.set("last_name", _userParams.last_name);
                        user.set("selected_genres", _userParams.selected_genres||[]);
                        user.set("selected_types", _userParams.selected_types||[]);
                        user.set("country", _userParams.country);
                        user.set("dob", _userParams.dob);
                        user.set("gender", _userParams.gender);

                        // should return a promise
                        return user.signUp(null, {}).then(function (user) {
                            console.log(user);
                            $localForage.setItem('User', user);
                            $rootScope.AppData.User = user;
                        });

                    },
                    /**
                     *
                     * @param _userParams
                     */
                    updateUser: function (_userParams) {

                        var user = Parse.User.current();
                        user.set("username", _userParams.email);
                        //user.set("password", _userParams.password);
                        user.set("email", _userParams.email);
                        user.set("bio", _userParams.bio);
                        user.set("avatar", _userParams.avatar);
                        user.set("first_name", _userParams.first_name);
                        user.set("last_name", _userParams.last_name);
                        user.set("usertag", _userParams.usertag);
                        user.set("selected_genres", _userParams.selected_genres);
                        user.set("selected_types", _userParams.selected_types||[]);
                        user.set("country", _userParams.country);
                        user.set("dob", _userParams.dob);
                        user.set("gender", _userParams.gender);

                        // should return a promise
                        return user.save(null).then(function (user) {
                            console.log(user);
                            $localForage.setItem('User', user);
                            $rootScope.AppData.User = user;
                        });

                    },
                    /**
                     *
                     * @param _parseInitUser
                     * @returns {Promise}
                     */
                    currentUser: function (_parseInitUser) {

                        // if there is no user passed in, see if there is already an
                        // active user that can be utilized
                        _parseInitUser = _parseInitUser ? _parseInitUser : Parse.User.current();

                        console.log("_parseInitUser ", Parse.User.current());
                        if (!_parseInitUser) {
                            return $q.reject({error: "noUser"});
                        } else {
                            return $q.when(_parseInitUser);
                        }
                    },
                    /**
                     *
                     * @param _user
                     * @param _password
                     * @returns {Promise}
                     */
                    login: function (_user, _password) {
                        return Parse.User.logIn(_user, _password).then(function (user) {
                            $localForage.setItem('User', user);
                            $rootScope.AppData.User = user;
                        });
                    },
                    /**
                     *
                     * @returns {Promise}
                     */
                    logout: function (_callback) {
                        var defered = $q.defer();
                        Parse.User.logOut();
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
                        return Parse.User.requestPasswordReset(email).then(function (res) {
                            console.log(res);
                            //$localForage.setItem('User', user);
                            return res;
                        }, function (error) {
                            //console.log(error);
                            return error;
                        });
                    },
                    /**
                     *
                     * @returns {Promise}
                     */
                    loginWithFB: function () {
                        Parse.FacebookUtils.init({

                            // pro-tip: swap App ID out for PROD App ID automatically on deploy using grunt-replace
                            appId: 150687055270744, // Facebook App ID
                            //channelUrl: 'http://brandid.github.io/parse-angular-demo/channel.html', // Channel File
                            cookie: true, // enable cookies to allow Parse to access the session
                            xfbml: true, // parse XFBML
                            frictionlessRequests: true // recommended

                        });

                        return Parse.FacebookUtils.logIn("public_profile,email,user_friends", {
                            success: function (user) {
                                // Handle successful login
                                $rootScope.AppData.User = user;
                                console.log(user);
                                return user;
                            },
                            error: function (user, error) {
                                console.log(user);
                                console.log(error);
                                // Handle errors and cancellation
                            }
                        });

                        // STEP 1 - LOGIN TO FACEBOOK
                        //return $cordovaFacebook.login(["public_profile", "email", "user_friends"])
                        //    .then(function (success) {
                        //        // save access_token
                        //        var accessToken = success.authResponse.accessToken;
                        //        var userID = success.authResponse.userID;
                        //        var expiresIn = success.authResponse.expiresIn;
                        //
                        //        console.log("Login Success" + JSON.stringify(success));
                        //
                        //        // STEP - 2 CONVERTING DATE FORMAT
                        //        var expDate = new Date(
                        //            new Date().getTime() + expiresIn * 1000
                        //        ).toISOString();
                        //
                        //        // STEP - 3 LOGIN TO PARSE
                        //        return Parse.FacebookUtils.logIn({
                        //            id: userID,
                        //            access_token: accessToken,
                        //            expiration_date: expDate
                        //        });
                        //    }).then(function (_parseResult) {
                        //
                        //        // STEP - 4 GET ADDITIONAL USER INFORMATION FROM FACEBOOK
                        //        // get the user information to add to the Parse Object
                        //        var fbValues = "&fields=id,name,location,website,picture,email";
                        //        var fbPermission = ["public_profile"];
                        //
                        //        return $cordovaFacebook.api("me?access_token=" + accessToken + fbValues, fbPermission);
                        //    }).then(function (_fbUserInfo) {
                        //
                        //        // use the information to update the object
                        //        // STEP - 5 UPDATE THE USER OBJECT
                        //        var username = _fbUserInfo.name.toLocaleLowerCase().replace(" ", "");
                        //        var email = _fbUserInfo.email;
                        //
                        //        Parse.User.current().set("username", username);
                        //        Parse.User.current().set("email", email);
                        //
                        //        return Parse.User.current().save();
                        //    }).then(function (_updatedUser) {
                        //        $localForage.setItem('User', _updatedUser);
                        //        return _updatedUser;
                        //    });

                    },
                    /**
                     *
                     * @returns {Promise}
                     */
                    linkWithFB: function () {
                        Parse.FacebookUtils.init({

                            // pro-tip: swap App ID out for PROD App ID automatically on deploy using grunt-replace
                            appId: 150687055270744, // Facebook App ID
                            //channelUrl: 'http://brandid.github.io/parse-angular-demo/channel.html', // Channel File
                            cookie: true, // enable cookies to allow Parse to access the session
                            xfbml: true, // parse XFBML
                            frictionlessRequests: true // recommended

                        });
                        var user = Parse.User.current();
                        if (!Parse.FacebookUtils.isLinked(user)) {
                            return Parse.FacebookUtils.link(user, null, {
                                success: function (user) {
                                    alert("Woohoo, user logged in with Facebook!");
                                    $rootScope.AppData.User = user;
                                    return user;
                                },
                                error: function (user, error) {
                                    alert("User cancelled the Facebook login or did not fully authorize.");
                                    return error;
                                }
                            });
                        } else {
                            return false;
                        }
                    },
                    /**
                     *
                     * @returns {Promise}
                     */
                    unlinkWithFB: function () {
                        Parse.FacebookUtils.init({

                            // pro-tip: swap App ID out for PROD App ID automatically on deploy using grunt-replace
                            appId: 150687055270744, // Facebook App ID
                            //channelUrl: 'http://brandid.github.io/parse-angular-demo/channel.html', // Channel File
                            cookie: true, // enable cookies to allow Parse to access the session
                            xfbml: true, // parse XFBML
                            frictionlessRequests: true // recommended

                        });

                        return Parse.FacebookUtils.unlink(Parse.User.current(), {
                            success: function(user) {
                                alert("The user is no longer associated with their Facebook account.");
                                $rootScope.AppData.User = user;
                                return user;
                            }
                        });
                    },
                    /**
                     *
                     * @returns {Promise}
                     */
                    loginWithTwitter: function () {
                        $auth.authenticate(provider)
                            .then(function (response) {
                                // Signed in with Google.
                                console.log(response);
                                console.log(response.config.data);
                                //$state.go('home');
                                //window.location.reload();

                            })
                            .catch(function (response) {
                                // Something went wrong.
                                console.log(response);
                            });
                    },
                    otherSocialLogin: function (provider) {
                        return $auth.authenticate(provider)
                            .then(function (response) {
                                // Signed in with Google.
                                console.log(response);
                                console.log(response.config.data);

                                var token = UtilsService.parseJwt(response.data);
                                Parse.User.become(token.sessionToken).then(function (user) {
                                    // The current user is now set to user.
                                    console.log(user);
                                    switch(provider) {
                                        case 'twitter':
                                            $state.go('home');
                                            break;
                                        case 'google':
                                            $state.go('home');
                                            break;
                                        case 'instagram':
                                            $state.go('home');
                                            break
                                    }
                                }, function (error) {
                                    // The token could not be validated.
                                    console.log(error);
                                });
                            })
                            .catch(function (response) {
                                // Something went wrong.
                                console.log(response);

                                if (response.status == 409)  {
                                    if (response.data.message.indexOf("already taken") != -1) {
                                        self.error = 'The email of this '+provider+' account is already associated with an indiewise account. Please login with that account and link your accounts in profile settings';
                                    }
                                }
                            });
                    }
                };
                return service;
            }
        ])
        .factory('UserActions', ['$rootScope', '$q', 'AuthService', 'UtilsService', '$timeout', '$mdDialog', '$mdMedia', function ($rootScope, $q, AuthService, UtilsService, $timeout, $mdDialog, $mdMedia) {
            var service = {
                checkAuth: function () {
                    var deferred = $q.defer();
                    Parse.User.current() ? deferred.resolve(true) : deferred.reject(false);
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
                    $timeout.cancel(promise)
                },
                giveCritique: function (video_id) {

                },
                canCritique: function (filmId) {
                    var deferred = $q.defer();
                    if (Parse.User.current()) {
                        var query = new Parse.Query("Critique");
                        query.equalTo('parent', {__type: "Pointer", className: "Film", objectId: filmId});
                        query.equalTo('author', Parse.User.current());
                        query.first().then(function (res) {
                            angular.isDefined(res)
                                // critique exists already from this user
                                ? deferred.reject(res)
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
                    if (Parse.User.current()) {
                        var query = new Parse.Query("Reaction");
                        query.equalTo('parent', {__type: "Pointer", className: "Film", objectId: filmId});
                        query.equalTo('user', Parse.User.current());
                        query.first().then(function (res) {
                            angular.isDefined(res)
                                // reaction exists already from this user
                                ? deferred.reject(res)
                                // user hasn't reacted yet
                                : deferred.resolve(true);
                        });
                    } else {
                        deferred.reject(false);
                    }
                    return deferred.promise;
                },
                canRate: function (filmId) {
                    var deferred = $q.defer();
                    if (Parse.User.current()) {
                        var query = new Parse.Query("Rating");
                        query.equalTo('parent', {__type: "Pointer", className: "Film", objectId: filmId});
                        query.equalTo('author', Parse.User.current());
                        query.first().then(function (res) {
                            angular.isDefined(res)
                                // rating exists already from this user
                                ? deferred.reject(res)
                                // user hasn't rated yet
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
                        var query = new Parse.Query("Favorites");
                        query.equalTo('project', {__type: "Pointer", className: "Film", objectId: obj.id});
                        query.equalTo('user', Parse.User.current());
                        query.first().then(function (res) {
                            if (res) {
                                deferred.resolve(res);
                            } else {
                                deferred.reject(false);
                            }
                        });
                    }, function (err) {
                        service.loginModal();
                    });
                    return deferred.promise;
                },
                favorite: function (obj) {
                    service.checkAuth().then(function (res) {
                        var query = new Parse.Query("Favorites");
                        query.equalTo('project', {__type: "Pointer", className: "Film", objectId: obj.id});
                        query.equalTo('user', Parse.User.current());
                        query.first().then(function (res) {
                            if (res) {
                                res.destroy();
                                $rootScope.toastMessage('Removed from Favorites');
                            } else {
                                var fav = new Parse.Object("Favorites");
                                fav.set('project', {__type: "Pointer", className: "Film", objectId: obj.id});
                                fav.set('user', Parse.User.current());
                                fav.save();
                                $rootScope.toastMessage('Added to Favorites');
                            }
                        });
                    }, function (err) {
                        service.loginModal();
                    });
                },
                checkWatchLater: function (obj) {
                    var deferred = $q.defer();
                    service.checkAuth().then(function (res) {
                        var query = new Parse.Query("WatchLater");
                        query.equalTo('project', {__type: "Pointer", className: "Film", objectId: obj.id});
                        query.equalTo('user', Parse.User.current());
                        query.first().then(function (res) {
                            if (res) {
                                deferred.resolve(res);
                            } else {
                                deferred.reject(false);
                            }
                        });
                    }, function (err) {
                        service.loginModal();
                    });
                    return deferred.promise;
                },
                watchLater: function (obj) {
                    service.checkAuth().then(function (res) {
                        var query = new Parse.Query("WatchLater");
                        query.equalTo('project', {__type: "Pointer", className: "Film", objectId: obj.id});
                        query.equalTo('user', Parse.User.current());
                        query.first().then(function (res) {
                            if (res) {
                                res.destroy();
                                $rootScope.toastMessage('Removed from Watch Later');
                            } else {
                                var wl = new Parse.Object("WatchLater");
                                wl.set('project', {__type: "Pointer", className: "Film", objectId: obj.id});
                                wl.set('user', Parse.User.current());
                                wl.save();
                                $rootScope.toastMessage('Added to Watch Later');
                            }
                        });
                    }, function (err) {
                        service.loginModal();
                    });
                },
                loginModal: function () {
                    if (!$rootScope.authModalOpen) {
                        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
                        $mdDialog.show({
                            controller: ['$rootScope', '$localForage', '$q', '$state', 'AuthService', '$mdDialog', SignInModalCtrl],
                            controllerAs: 'SIC',
                            templateUrl: './src/auth/sign-in-dialog.html',
                            parent: angular.element(document.body),
                            //targetEvent: ev,
                            clickOutsideToClose: true,
                            fullscreen: useFullScreen
                        })
                            .then(function (answer) {
                                console.log(answer);
                                $rootScope.authModalOpen = false;
                            }, function () {
                                console.log('You cancelled the dialog.');
                                $rootScope.authModalOpen = false;
                            });
                        $rootScope.authModalOpen = true;
                    }
                }
            };

            return service;
        }])
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
            function _linkifyAsType (type) {
                return function (str) {(type, str);
                    return $filter('linkify')(str, type);
                };
            }

            return {
                twitter: _linkifyAsType('twitter'),
                github: _linkifyAsType('github'),
                normal: _linkifyAsType()
            };
        }]);

    function SignInModalCtrl($rootScope, $localForage, $q, $state, AuthService, $mdDialog) {
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
                    //$state.go('home');
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
                //$state.go('home');
                //window.location.reload();
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

})();

