/**
 * Created by Jerez Bain on 9/14/2015.
 */
(function () {
    'use strict';
    angular.module('IndieWise.directives', [])
        .directive('mightySlider', ['$rootScope', '$state', '$timeout', function ($rootScope, $state, $timeout) {
            return {
                restrict: 'E',
                transclude: true,
                templateUrl: './src/directives/featured-area.html',
                scope: {},
                link: function (scope, el, attrs) {
                    var filmsQuery = new Parse.Query("Film");
                    filmsQuery.notEqualTo("unlist", true);
                    filmsQuery.limit(12);
                    filmsQuery.include(["type", "owner"]);
                    filmsQuery.find().then(function (result) {
                        scope.featuredFilms = _.shuffle(result);
                    }).then(function () {
                        $timeout(function () {
                            var $win = $(window),
                                isTouch = !!('ontouchstart' in window),
                                clickEvent = isTouch ? 'tap' : 'click',
                                $gridsContainer = $('ul.items'),
                                $big = $('li.bigGrid', $gridsContainer),
                                $wide = $('li.wideGrid', $gridsContainer),
                                $large = $('li.largeGrid', $gridsContainer),
                                $small = $('li.smallGrid', $gridsContainer),
                                $frames = $('.frame', $gridsContainer),
                                sliders = $frames.length,
                                history = [],
                                wall = new freewall('ul.items');

                            function resizeGrids(width) {
                                var bigWidth = ($big.eq(0).outerWidth() / 16) * 9,
                                    wideWidth = ($wide.eq(0).outerWidth() / 16) * 9,
                                    largeWidth = ($large.eq(0).outerWidth() / 16) * 9,
                                    smallWidth =($small.eq(0).outerWidth() / 16) * 9;

                                if (width <= 480) {
                                    $big.height(bigWidth);
                                    $small.height(smallWidth);
                                    $wide.height(wideWidth);
                                    $large.height(largeWidth);
                                }
                                else {
                                    $big.height(bigWidth);
                                    $small.height(smallWidth);
                                    $wide.height(wideWidth / 2);
                                    $large.height(largeWidth * 2);
                                }

                                wall.fitWidth();
                            }


                            wall.reset({
                                selector: 'li',
                                animate: 1,
                                cellW: 100,
                                cellH: 100,
                                fixSize: 0,
                                gutterY: 10,
                                gutterX: 10,
                                onResize: function () {
                                    wall.fitWidth();
                                }
                            });

                            /*var images = wall.container.find('.li');
                            images.find('img').load(function() {
                                wall.fitWidth();
                            });*/


                            function countDown(sliderID) {
                                var time = 5000 + Math.floor(Math.random() * 10000);

                                history[sliderID] = clearTimeout(history[sliderID]);

                                history[sliderID] = setTimeout(function() {
                                    var api = $frames.eq(sliderID).data('mightySlider');

                                    if(api && api.relative.activeSlide === api.slides.length - 1)
                                        api.activate(0);
                                    else
                                        api.next();
                                }, time);
                            }


                            // Resize the grids height to fix the aspect ratio
                            resizeGrids(getViewport().width);


                            $.fn.randomize = function(selector){
                                var $elems = selector ? $(this).find(selector) : $(this).children(),
                                    $parents = $elems.parent();

                                $parents.each(function(){
                                    $(this).children(selector).sort(function(){
                                        return Math.round(Math.random()) - 0.5;
                                    }).detach().appendTo(this);
                                });

                                return this;
                            };


                            $gridsContainer.randomize();


                            $frames.mightySlider({
                                speed: 1000,
                                viewport: 'fill',
                                easing: 'easeOutExpo',

                                // Navigation options
                                navigation: {
                                    slideSize: '100%'
                                },

                                // Dragging options
                                dragging: {
                                    mouseDragging: 0,
                                    touchDragging: 0
                                }
                            }, {
                                active: function() {
                                    var sliderID = $frames.index(this.frame);
                                    countDown(sliderID);
                                }
                            });


                            $win.on('resize', function() {
                                // Resize the grids height to fix the aspect ratio
                                resizeGrids(getViewport().width);
                            });

                            setTimeout(function(){
                                $win.trigger('resize');
                            }, 100);
                        },0);
                    });



                    /**
                     * Get viewport/window size (width and height).
                     *
                     * @return {Object}
                     */
                    function getViewport() {
                        var e = window,
                            a = 'inner';
                        if (!('innerWidth' in window)) {
                            a = 'client';
                            e = document.documentElement || document.body;
                        }
                        return {
                            width: e[a + 'Width'],
                            height: e[a + 'Height']
                        }
                    }
                }
            }
        }])
        .directive('elitePlayer', ['$rootScope', 'UserActions', '$interval', '$anchorScroll', function ($rootScope, UserActions, $interval, $anchorScroll) {
            return {
                restrict: 'E',
                scope: {film: '@', type: '@'},
                link: function (scope, el, attrs) {
                    attrs.$observe("film", function (video) {
                        video = JSON.parse(video);
                        window.videoPlayer = scope.videoPlayer = el.Video({                  //ALL PLUGIN OPTIONS
                            instanceName:"player1",                      //name of the player instance
                            autohideControls:5,                          //autohide HTML5 player controls
                            hideControlsOnMouseOut:"No",                 //hide HTML5 player controls on mouse out of the player: "Yes","No"
                            videoPlayerWidth:'100%',                     //fixed total player width
                            videoPlayerHeight:500,                       //fixed total player height
                            responsive:true,				             //this option will overwrite above videoPlayerWidth/videoPlayerHeight and set player to fit your div (parent) container: true/false
                            playlist:"Right playlist",                   //choose playlist type: "Right playlist", "Off"
                            playlistScrollType:"light",                  //choose scrollbar type: "light","minimal","light-2","light-3","light-thick","light-thin","inset","inset-2","inset-3","rounded","rounded-dots","3d"
                            playlistBehaviourOnPageload:"closed",		 //choose playlist behaviour when webpage loads: "closed", "opened" (not apply to Vimeo player)
                            autoplay:false,                              //autoplay when webpage loads: true/false
                            colorAccent:"#3F51B5",                       //plugin colors accent (hexadecimal or RGB value - http://www.colorpicker.com/)
                            vimeoColor:"00adef",                         //set "hexadecimal value", default vimeo color is "00adef"
                            youtubeControls:"default controls",			 //choose youtube player controls: "custom controls", "default controls"
                            youtubeSkin:"dark",                          //default youtube controls theme: light, dark
                            youtubeColor:"red",                          //default youtube controls bar color: red, white
                            youtubeQuality:"default",                    //choose youtube quality: "small", "medium", "large", "hd720", "hd1080", "highres", "default"
                            youtubeShowRelatedVideos:"No",				 //choose to show youtube related videos when video finish: "Yes", "No" (onFinish:"Stop video" needs to be enabled)
                            videoPlayerShadow:"effect3",                 //choose player shadow:  "effect1" , "effect2", "effect3", "effect4", "effect5", "effect6", "off"
                            loadRandomVideoOnStart:"No",                 //choose to load random video when webpage loads: "Yes", "No"
                            shuffle:"No",				                 //choose to shuffle videos when playing one after another: "Yes", "No" (shuffle button enabled/disabled on start)
                            posterImg:"",                               //player poster image
                            onFinish:"Stop video",                      //"Play next video","Restart video", "Stop video",
                            nowPlayingText:"Yes",                        //enable disable now playing title: "Yes","No"
                            fullscreen:"Fullscreen native",              //choose fullscreen type: "Fullscreen native","Fullscreen browser"
                            rightClickMenu:true,                         //enable/disable right click over HTML5 player: true/false
                            hideVideoSource:true,						 //option to hide self hosted video sources (to prevent users from download/steal your videos): true/false
                            showAllControls:true,						 //enable/disable all HTML5 player controls: true/false
                            allowSkipAd:true,                            //enable/disable "Skip advertisement" option: true/false
                            infoShow:"No",                              //enable/disable info option: "Yes","No"
                            shareShow:"No",                             //enable/disable all share options: "Yes","No"
                            facebookShow:"Yes",                          //enable/disable facebook option individually: "Yes","No"
                            twitterShow:"Yes",                           //enable/disable twitter option individually: "Yes","No"
                            mailShow:"Yes",                              //enable/disable mail option individually: "Yes","No"
                            facebookShareName:"Elite video player",      //first parametar of facebook share in facebook feed dialog is title
                            facebookShareLink:"http://getindiewise.com/item/elite-video-player-wordpress-plugin/10496434",  //second parametar of facebook share in facebook feed dialog is link below title
                            facebookShareDescription:"Elite Video Player is stunning, modern, responsive, fully customisable high-end video player for WordPress that support advertising and the most popular video platforms like YouTube, Vimeo or self-hosting videos (mp4).", //third parametar of facebook share in facebook feed dialog is description below link
                            facebookSharePicture:"https://0.s3.envato.com/files/123866118/preview.jpg", //fourth parametar in facebook feed dialog is picture on left side
                            twitterText:"Elite video player",			 //first parametar of twitter share in twitter feed dialog is text
                            twitterLink:"http://getindiewise.com/item/elite-video-player-wordpress-plugin/10496434", //second parametar of twitter share in twitter feed dialog is link
                            twitterHashtags:"wordpressvideoplayer",		 //third parametar of twitter share in twitter feed dialog is hashtag
                            twitterVia:"Creative media",				 //fourth parametar of twitter share in twitter feed dialog is via (@)
                            googlePlus:"http://getindiewise.com/item/elite-video-player-wordpress-plugin/10496434", //share link over Google +
                            logoShow:"Yes",                              //"Yes","No"
                            logoClickable:"No",                         //"Yes","No"
                            logoPath:"./assets/img/Logo_alt2_web_87x45.png",             //path to logo image
                            logoGoToLink:"http://getindiewise.com",       //redirect to page when logo clicked
                            logoPosition:"bottom-left",                  //choose logo position: "bottom-right","bottom-left"
                            embedShow:"No",                             //enable/disable embed option: "Yes","No"
                            embedCodeSrc:"www.yourwebsite.com/videoplayer/index.html", //path to your video player on server
                            embedCodeW:"746",                            //embed player code width
                            embedCodeH:"420",                            //embed player code height
                            embedShareLink:"www.yourwebsite.com/videoplayer/index.html", //direct link to your site (or any other URL) you want to be "shared"
                            youtubePlaylistID:"",                        //automatic youtube playlist ID (leave blank "" if you want to use manual playlist) LL4qbSRobYCjvwo4FCQFrJ4g
                            youtubeChannelID:"",                         //automatic youtube channel ID (leave blank "" if you want to use manual playlist) UCHqaLr9a9M7g9QN6xem9HcQ

                            //manual playlist
                            videos:[
                                {
                                    videoType: scope.type,                                                              //choose video type: "HTML5", "youtube", "vimeo", "image"
                                    title: video.name,                                                            //video title
                                    youtubeID: scope.type === 'youtube' ? video.video_url.split('v=')[1].split('&')[0] : "",                                                          //last part if the URL https://www.youtube.com/watch?v=0dJO0HyE8xE
                                    vimeoID: scope.type === 'vimeo' ? video.video_url.split('.com/')[1] : "",                                                              //last part of the URL http://vimeo.com/119641053
                                    mp4: scope.type === 'hosted' ? video.video_url : "",               //HTML5 video mp4 url
                                    //imageUrl:"images/preview_images/poster2.jpg",                                     //display image instead of playing video
                                    //imageTimer:4, 																	  //set time how long image will display
                                    prerollAD:"no",                                                                  //show pre-roll "yes","no"
                                    prerollGotoLink:"http://getindiewise.com/",                                         //pre-roll goto link
                                    preroll_mp4:"http://creativeinteractivemedia.com/player/videos/Short_Elegant_Logo_Reveal.mp4",   //pre-roll video mp4 format
                                    prerollSkipTimer:5,
                                    midrollAD:"no",                                                                  //show mid-roll "yes","no"
                                    midrollAD_displayTime:"00:10",                                                    //show mid-roll at any custom time in format "minutes:seconds" ("00:00")
                                    midrollGotoLink:"http://getindiewise.com/",                                         //mid-roll goto link
                                    midroll_mp4:"http://creativeinteractivemedia.com/player/videos/Logo_Explode.mp4", //mid-roll video mp4 format
                                    midrollSkipTimer:5,
                                    postrollAD:"no",                                                                 //show post-roll "yes","no"
                                    postrollGotoLink:"http://getindiewise.com/",                                        //post-roll goto link
                                    postroll_mp4:"http://creativeinteractivemedia.com/player/videos/Logo_Light.mp4",  //post-roll video mp4 format
                                    postrollSkipTimer:5,
                                    popupImg:"images/preview_images/popup.jpg",                        			  	  //popup image URL
                                    popupAdShow:"no",                                                                //enable/disable popup image: "yes","no"
                                    popupAdStartTime:"00:03",                                                         //time to show popup ad during playback
                                    popupAdEndTime:"00:07",                                                           //time to hide popup ad during playback
                                    popupAdGoToLink:"http://getindiewise.com/",                                         //re-direct to URL when popup ad clicked
                                    description:video.description,                                                      //video description
                                    thumbImg: video.thumbnail_url,                                                      //path to playlist thumbnail image
                                    info:"Video info goes here.<br>This text can be <i>HTML formatted</i>, <a href='http://getindiewise.com/' target='_blank'><font color='008BFF'>find out more</font></a>.<br>You can disable this info window in player options. <br><br>Lorem ipsum dolor sit amet, eu pri dolores theophrastus. Posidonium vituperatoribus cu mel, cum feugiat nostrum sapientem ne. Vis ea summo persius, unum velit erant in eos, pri ut suas iriure euripidis. Ad augue expetendis sea. Ne usu saperet appetere honestatis, ne qui nulla debitis sententiae."                                                                                    //video info
                                }
                            ]
                        });

                        var startedPlaying = $interval(function () {
                            if (scope.videoPlayer.state === "elite_vp_playing") {
                                $rootScope.initWatch();

                                switch (scope.type) {
                                    case "youtube":
                                        console.log('Youtube API is Ready');
                                        scope.videoPlayer.youtubePlayer.addEventListener("onStateChange", function (a) {
                                            console.log(a.target.getPlayerState());
                                            if (a.target.getPlayerState() == 0) {
                                                console.log('Scroll page to content');
                                                $anchorScroll('content');
                                            }
                                        });
                                        break;
                                }

                                $interval.cancel(startedPlaying)
                            }
                        }, 1000);

                        /*scope.$watchCollection("youtubePlayer", function(nvs, ovs) {
                            if (angular.isDefined(nvs)) {
                                console.log('Video Player is Ready');

                            }
                        });*/

                    });

                }
            }
        }])
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
                    scope.isLoggedIn = $rootScope.AppData.User;
                    scope.model = {
                        myComment: null
                    };
                    scope.myReply = null;
                    scope.showCommentInput = false;
                    scope.showReplyInput = false;
                    scope.editCommentMode = false;
                    scope.postComment = postComment;
                    scope.deleteComment = deleteComment;
                    scope.loadReplies = loadReplies;
                    scope.toggleCommentInput = toggleCommentInput;
                    scope.toggleEditCommentMode = toggleEditCommentMode;
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
                            console.log(result);
                            return comment.replies = result, comment.repliesLoaded = true;
                        });
                    }

                    function toggleCommentInput() {
                        scope.showCommentInput = !scope.showCommentInput;
                    }

                    function toggleEditCommentMode(comment) {
                        scope.editCommentMode = !scope.editCommentMode;
                        scope.editComment = !!scope.editCommentMode ? comment : undefined;
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
                templateUrl: './src/directives/reply-comment.html',
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
        .directive('editCommentBlock', ['$rootScope', 'UserActions', 'UtilsService', function ($rootScope, UserActions, UtilsService) {
            return {
                restrict: 'E',
                templateUrl: './src/directives/edit-comment.html',
                link: function (scope, el, attrs) {
                    scope.editedBody = scope.editComment.attributes.body;
                    scope.updateComment = updateComment;
                    function updateComment() {
                        if (scope.editedBody === scope.editComment.attributes.body) {
                            scope.toggleEditCommentMode();
                            return scope.editComment;
                        }
                        UserActions.checkAuth().then(function (res) {
                            scope.editComment.set("body", scope.editedBody);
                            scope.editComment.set("editedAt", new Date());
                            scope.editComment.save().then(function (comment) {
                                scope.toggleEditCommentMode();
                                return comment;
                            })
                        });
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