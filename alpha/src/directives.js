/**
 * Created by Jerez Bain on 9/14/2015.
 */
(function () {
    'use strict';
    angular.module('IndieWise.directives', [])
        .directive('coverr', [function () {
            return {
                restrict: 'E',
                transclude: true,
                scope: {},
                link: function (scope, el, attrs) {
                    function initCoverr() {
                        scaleVideoContainer();

                        initBannerVideoSize('.video-container .poster img');
                        initBannerVideoSize('.video-container .filter');
                        initBannerVideoSize('.video-container video');

                        $(window).on('resize', function() {
                            scaleVideoContainer();
                            scaleBannerVideoSize('.video-container .poster img');
                            scaleBannerVideoSize('.video-container .filter');
                            scaleBannerVideoSize('.video-container video');
                        });
                    };


                    function scaleVideoContainer() {

                        var height = $(window).height() + 5;
                        var unitHeight = parseInt(height) + 'px';
                        $('.hero-module').css('height',unitHeight);

                    }

                    function initBannerVideoSize(element){

                        $(element).each(function(){
                            $(this).data('height', $(this).height());
                            $(this).data('width', $(this).width());
                        });

                        scaleBannerVideoSize(element);

                    }

                    function scaleBannerVideoSize(element){

                        var windowWidth = $(window).width(),
                            windowHeight = $(window).height() + 5,
                            videoWidth,
                            videoHeight;

                        console.log(windowHeight);

                        $(element).each(function(){
                            var videoAspectRatio = $(this).data('height')/$(this).data('width');

                            $(this).width(windowWidth);

                            if(windowWidth < 1000){
                                videoHeight = windowHeight;
                                videoWidth = videoHeight / videoAspectRatio;
                                $(this).css({'margin-top' : 0, 'margin-left' : -(videoWidth - windowWidth) / 2 + 'px'});

                                $(this).width(videoWidth).height(videoHeight);
                            }

                            $('.hero-module .video-container video').addClass('fadeIn animated');

                        });
                    }
                },
            }
        }])
        .directive('helpInfo', [function () {
            return {
                restrict: 'E',
                transclude: true,
                templateUrl: './src/directives/help-info.html',
                scope: {
                    text: '=text'
                }
            }
        }])
        .directive('embedWatcher', [function () {
            return {
                link: function (scope, el, attrs) {
                    el.bind('click', function () {
                        debugger;
                    })
                }
            }
        }])
        .directive('projectCard', ['$rootScope', '$state', '$mdDialog', 'UserActions', function($rootScope, $state, $mdDialog, UserActions){
            return {
                restrict: 'E',
                transclude: true,
                templateUrl: './src/directives/project-card.html',
                scope: {
                    video: '=video',
                },
                link: function (scope, el, attrs) {
                    scope.isOpenFab = false;
                    scope.isLoggedIn = $rootScope.AppData.User;
                    scope.toFavorites = toFavorites;
                    scope.toWatchLater = toWatchLater;
                    scope.checkFabActions = checkFabActions;
                    el.find('md-fab-trigger').on('click', checkFabActions);

                    function toFavorites(obj) {
                        return UserActions.favorite(obj);
                    }

                    function toWatchLater(obj) {
                        return UserActions.watchLater(obj);
                    }

                    function checkFabActions() {
                        if (!scope.isOpenFab) {
                            UserActions.checkFavorite(scope.video)
                                .then(function (a) {
                                    scope.faved = 'red-text';
                                }, function (a) {
                                    scope.faved = 'blue-text';
                                });
                            UserActions.checkWatchLater(scope.video)
                                .then(function (a) {
                                    scope.wled = 'red-text';
                                }, function (a) {
                                    scope.wled = 'blue-text';
                                });
                        }
                    }

                    scope.deleteProject = function (ev) {
                        if ($rootScope.isLoggedIn && ($rootScope.isLoggedIn.id === scope.video.attributes.owner.id)) {
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
                    };

                    scope.openMenu = function ($mdOpenMenu, ev) {
                        var originatorEv = ev;
                        $mdOpenMenu(ev);
                    };
                }
            }
        }])
        .directive('commentsBlock', ['$rootScope', 'UserActions', 'UtilsService', '$mdDialog', function ($rootScope, UserActions, UtilsService, $mdDialog) {
            return {
                restrict: 'E',
                templateUrl: './src/directives/comments.html',
                scope: {
                    comments: '=comments',
                    disable: '=disable',
                    parent: '=parent'
                },
                link: function (scope, el, attrs) {
                    scope.isLoggedIn = $rootScope.isLoggedIn;
                    scope.model = {
                        myComment: null
                    };
                    scope.myReply = null;
                    scope.showCommentInput = false;
                    scope.showReplyInput = false;
                    scope.postComment = postComment;
                    scope.deleteComment = deleteComment;
                    scope.loadReplies = loadReplies;
                    scope.toggleCommentInput = toggleCommentInput;
                    scope.toggleReplyInput = toggleReplyInput;

                    function postComment() {
                        UserActions.checkAuth().then(function (res) {
                            if (res) {
                                var comment = new Parse.Object("Comment");
                                comment.set('body', scope.model.myComment);
                                switch (scope.parent.className) {
                                    case 'Film':
                                        comment.set('parentFilm', scope.parent);
                                        break;
                                    case 'Critique':
                                        comment.set('parentCritique', scope.parent);
                                        break;
                                }
                                comment.set('author', Parse.User.current());
                                comment.save(null).then(function (res) {
                                    scope.comments.push(res);
                                    $rootScope.toastMessage('Comment posted!');
                                    scope.model.myComment = null;
                                    scope.toggleCommentInput();

                                    // Increment film commentCount
                                    scope.parent.increment('commentCount');
                                    scope.parent.save();

                                    // register Action
                                    UtilsService.recordActivity(res);


                                }, function (error) {
                                    alert('Failed to create new comment, with error code: ' + error.message);
                                });
                            }
                        })
                    }

                    function deleteComment(c, ev) {
                        UserActions.checkAuth().then(function (res) {
                            if (res) {
                                var confirm = $mdDialog.confirm()
                                    .title('Would you like to delete your comment?')
                                    //.content('All of the banks have agreed to <span class="debt-be-gone">forgive</span> you your debts.')
                                    //.ariaLabel('Lucky day')
                                    .targetEvent(ev)
                                    .ok('Delete')
                                    .cancel('Cancel');
                                $mdDialog.show(confirm).then(function () {
                                    var p = c.attributes.parentComment || undefined;
                                    c.destroy().then(function (res) {
                                        // Decrement film commentCount
                                        scope.parent.increment('commentCount', -1);
                                        scope.parent.save();

                                        UtilsService.deleteActivity(c);

                                        if (angular.isUndefined(p)) {
                                            // normal comment
                                            scope.comments = _.reject(scope.comments, function (a) {
                                                return a.id === c.id;
                                            });

                                        } else {
                                            // reply comment
                                            var z = _.find(scope.comments, function (a) {
                                                return a.id === p.id;
                                            });

                                            z.replies = _.reject(z.replies, function (a) {
                                                return a.id === c.id;
                                            });
                                            // Increment film commentCount
                                            var pcQuery = new Parse.Query("Comment");
                                            pcQuery.get(p.id).then(function (res) {
                                                res.increment('replyCount', -1);
                                                res.save();
                                            });

                                            return c = undefined;
                                        }

                                        $rootScope.toastMessage('Your comment was deleted.');
                                    });
                                }, function () {
                                    //$scope.status = 'You decided to keep your debt.';
                                });
                            }
                        })
                    }

                    function loadReplies(comment) {
                        // Fetch Replies
                        var commentsQuery = new Parse.Query("Comment");
                        switch (scope.parent.className) {
                            case 'Film':
                                commentsQuery.equalTo('parentFilm', scope.parent);
                                break;
                            case 'Critique':
                                commentsQuery.equalTo('parentCritique', scope.parent);
                                break;
                        }
                        commentsQuery.include("author");
                        commentsQuery.equalTo('parentComment', comment);
                        commentsQuery.find().then(function (result) {
                            return comment.replies = result, comment.repliesLoaded = true;
                        });
                    }

                    function toggleCommentInput() {
                        scope.showCommentInput = !scope.showCommentInput;
                    }

                    function toggleReplyInput(comment) {
                        scope.showReplyInput = !scope.showReplyInput;
                        scope.targetComment = comment;
                    }

                    scope.$on('reply:complete', function (event, comment) {
                        scope.toggleReplyInput(undefined);
                    });
                }
            }
        }])
        .directive('repliesBlock', [function () {
            return {
                restrict: 'E',
                templateUrl: './src/directives/replies.html',
                link: function (scope, el, attrs) {

                }
            }
        }])
        .directive('replyBlock', ['$rootScope', 'UserActions', 'UtilsService', function ($rootScope, UserActions, UtilsService) {
            return {
                restrict: 'E',
                templateUrl: './src/directives/reply.html',
                link: function (scope, el, attrs) {
                    scope.postReply = postReply;

                    function postReply() {
                        UserActions.checkAuth().then(function (res) {
                            if (res) {
                                var comment = new Parse.Object("Comment");
                                comment.set('body', scope.myReply);
                                switch (scope.parent.className) {
                                    case 'Film':
                                        comment.set('parentFilm', scope.parent);
                                        break;
                                    case 'Critique':
                                        comment.set('parentCritique', scope.parent);
                                        break;
                                }
                                var repliedTo = angular.isDefined(scope.targetComment.attributes.parentComment)
                                    ? scope.targetComment.attributes.parentComment : scope.targetComment;
                                comment.set('parentComment', repliedTo);
                                comment.set('author', Parse.User.current());
                                comment.save(null).then(function (comment) {
                                    if(!repliedTo.replies) {
                                        repliedTo.replies = [];
                                    }
                                    repliedTo.replies.push(comment);
                                    //scope.comments.push(comment);
                                    $rootScope.toastMessage('Reply posted!');
                                    scope.myReply = null;

                                    // Increment original comment replyCount
                                    scope.targetComment.increment('replyCount');
                                    scope.targetComment.set('repliedAt', moment().toDate());
                                    scope.targetComment.save().then(function (parentComment) {
                                        console.log(parentComment);
                                        scope.$emit('reply:complete', comment);
                                    });

                                    // Increment parent commentCount
                                    scope.parent.increment('commentCount');
                                    scope.parent.save();

                                    // register Action
                                    UtilsService.recordActivity(comment);
                                }, function (error) {
                                    alert('Failed to create new reply, with error code: ' + error.message);
                                });
                            }
                        })
                    }
                }
            }
        }])
        .directive('focusOn',function($timeout) {
            return {
                restrict : 'A',
                link : function($scope,$element,$attr) {
                    $scope.$watch($attr.focusOn,function(_focusVal) {
                        $timeout(function() {
                            _focusVal ? $element.focus() :
                                $element.blur();
                        });
                    });
                }
            }
        });
    angular.module('IndieWise.filters', [])
        .filter('linkify', function () {

            function linkify (_str, type) {
                if (!_str) {
                    return;
                }

                var _text = _str.replace( /(?:https?\:\/\/|www\.)+(?![^\s]*?")([\w.,@?!^=%&amp;:\/~+#-]*[\w@?!^=%&amp;\/~+#-])?/ig, function(url) {
                    var wrap = document.createElement('div');
                    var anch = document.createElement('a');
                    anch.href = url;
                    anch.target = "_blank";
                    anch.innerHTML = url;
                    wrap.appendChild(anch);
                    return wrap.innerHTML;
                });

                // bugfix
                if (!_text) {
                    return '';
                }

                // Twitter
                if (type === 'twitter') {
                    _text = _text.replace(/(|\s)*@([\u00C0-\u1FFF\w]+)/g, '$1<a href="https://twitter.com/$2" target="_blank">@$2</a>');
                    _text = _text.replace(/(^|\s)*#([\u00C0-\u1FFF\w]+)/g, '$1<a href="https://twitter.com/search?q=%23$2" target="_blank">#$2</a>');
                }


                // Github
                if (type === 'github') {
                    _text = _text.replace(/(|\s)*@(\w+)/g, '$1<a href="https://github.com/$2" target="_blank">@$2</a>');
                }

                return _text;
            }

            //
            return function (text, type) {
                return linkify(text, type);
            };
        })
        .directive('linkify', ['$filter', '$timeout', 'linkify', function ($filter, $timeout, linkify) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var type = attrs.linkify || 'normal';
                    $timeout(function () { element.html(linkify[type](element.html())); });
                }
            };
        }])
})();