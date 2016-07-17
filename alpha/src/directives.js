/**
 * Created by Jerez Bain on 9/14/2015.
 */
(function () {
    'use strict';
    angular.module('IndieWise.directives', [])
        .directive('layerSlider', ['$rootScope', '$timeout', 'DataService', function ($rootScope, $timeout, DataService) {
            return {
                restrict: 'E',
                transclude: true,
                templateUrl: './src/directives/layerSlider.html',
                scope: {},
                link: function (scope, el, attrs) {
                    DataService.query('countUsers').then(function (res) {
                        scope.users = res.data[0].users;
                    }).then(function () {
                        $timeout(function () {
                            jQuery("#layerslider").layerSlider({
                                responsive: false,
                                responsiveUnder: 1280,
                                layersContainer: 1280,
                                skin: 'noskin',
                                hoverPrevNext: false,
                                skinsPath: './assets/layerslider/skins/'
                            });
                        }, 0);
                    });
                }
            }
        }])
        .directive('premiumCarousel', ['$rootScope', '$state', '$timeout', 'DataService', function ($rootScope, $state, $timeout, DataService) {
            return {
                restrict: 'E',
                replace: true,
                //transclude: true,
                templateUrl: './src/directives/featured-area.html',
                scope: {},
                link: function (scope, el, attrs) {
                    DataService.getList("Project"/*"Project"*/, null, [{
                            fieldName: "unlist",
                            operator: "is",
                            value: false
                        }],
                        5, true, true, 1).then(function (result) {
                        scope.featuredFilms = result.data;
                        // console.log("featuredFilms: ", scope.featuredFilms);
                    }).then(function () {
                        $timeout(function () {
                            // console.log('run owl');
                            //Premium carousel
                            jQuery('.owl-carousel').each(function () {
                                var owl = jQuery(this);
                                jQuery(".prev").on('click', function () {
                                    jQuery(this).parent().parent().parent().parent().next().trigger('prev.owl.carousel');
                                });

                                jQuery(".next").on('click', function () {
                                    jQuery(this).parent().parent().parent().parent().next().trigger('next.owl.carousel');
                                });
                                var loopLength = owl.data('car-length');
                                var divLength = jQuery(this).find("div.item").length;
                                if (divLength > loopLength) {
                                    owl.owlCarousel({
                                        dots: owl.data("dots"),
                                        items: owl.data("items"),
                                        slideBy: owl.data("slideby"),
                                        center: owl.data("center"),
                                        loop: owl.data("loop"),
                                        margin: owl.data("margin"),
                                        nav: owl.data("nav"),
                                        autoplay: owl.data("autoplay"),
                                        autoplayTimeout: owl.data("autoplay-timeout"),
                                        autoWidth: owl.data("auto-width"),
                                        autoHeight: owl.data("auto-Height"),
                                        merge: owl.data("merge"),
                                        responsive: {
                                            0: {
                                                items: owl.data("responsive-small"),
                                                nav: false
                                            },
                                            600: {
                                                items: owl.data("responsive-medium"),
                                                nav: false
                                            },
                                            1000: {
                                                items: owl.data("responsive-large"),
                                                nav: false
                                            },
                                            1900: {
                                                items: owl.data("responsive-xlarge"),
                                                nav: false
                                            }
                                        }
                                    });

                                } else {
                                    owl.owlCarousel({
                                        dots: false,
                                        items: owl.data("items"),
                                        loop: false,
                                        margin: owl.data("margin"),
                                        autoplay: false,
                                        autoplayHoverPause: true,
                                        responsiveClass: true,
                                        autoWidth: owl.data("auto-width"),
                                        autoHeight: owl.data("auto-Height"),
                                    });
                                }
                            });
                        }, 1000);
                    });

                }
            }
        }])
        .directive('watchingCarousel', ['$rootScope', '$timeout', '$interval', 'DataService', function ($rootScope, $timeout, $interval, DataService) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: './src/directives/people-watching.html',
                scope: {},
                link: function (scope, el, attrs) {
                    scope.getWatchedList = function () {
                        DataService.query('getRecentlyWatched').then(function (result) {
                            scope.watched = result.data;
                            // console.log('watched');
                            // console.log(scope.watched);
                            $timeout(function () {
                                //console.log('run owl');
                                //Premium carousel
                                jQuery('.owl-carousel').each(function () {
                                    var owl = jQuery(this);
                                    jQuery(".prev").on('click', function () {
                                        jQuery(this).parent().parent().parent().parent().next().trigger('prev.owl.carousel');
                                    });

                                    jQuery(".next").on('click', function () {
                                        jQuery(this).parent().parent().parent().parent().next().trigger('next.owl.carousel');
                                    });
                                    var loopLength = owl.data('car-length');
                                    var divLength = jQuery(this).find("div.item").length;
                                    if (divLength > loopLength) {
                                        owl.owlCarousel({
                                            dots: owl.data("dots"),
                                            items: owl.data("items"),
                                            slideBy: owl.data("slideby"),
                                            center: owl.data("center"),
                                            loop: owl.data("loop"),
                                            margin: owl.data("margin"),
                                            nav: owl.data("nav"),
                                            autoplay: owl.data("autoplay"),
                                            autoplayTimeout: owl.data("autoplay-timeout"),
                                            autoWidth: owl.data("auto-width"),
                                            autoHeight: owl.data("auto-Height"),
                                            merge: owl.data("merge"),
                                            responsive: {
                                                0: {
                                                    items: owl.data("responsive-small"),
                                                    nav: false
                                                },
                                                600: {
                                                    items: owl.data("responsive-medium"),
                                                    nav: false
                                                },
                                                1000: {
                                                    items: owl.data("responsive-large"),
                                                    nav: false
                                                },
                                                1900: {
                                                    items: owl.data("responsive-xlarge"),
                                                    nav: false
                                                }
                                            }
                                        });

                                    } else {
                                        owl.owlCarousel({
                                            dots: false,
                                            items: owl.data("items"),
                                            loop: false,
                                            margin: owl.data("margin"),
                                            autoplay: false,
                                            autoplayHoverPause: true,
                                            responsiveClass: true,
                                            autoWidth: owl.data("auto-width"),
                                            autoHeight: owl.data("auto-Height"),
                                        });
                                    }
                                });
                            }, 0);
                        });
                    };
                    /*$interval(function () {
                     scope.getWatchedList()
                     }, 60000);*/

                    scope.getWatchedList();
                }
            }
        }])
        .directive('playlists', ['$rootScope', '$state', 'DataService', 'UserActions', '_', function ($rootScope, $state, DataService, UserActions, _) {
            return {
                restrict: 'E',
                templateUrl: './src/directives/playlists.html',
                replace: false,
                scope: {
                    project: '='
                },
                link: function (scope, el, attrs) {
                    scope.model = {
                        newName: null,
                        playlistArr: []
                    };
                    scope.playlists = [];
                    scope.newPlInput = false;

                    // Get playlists
                    if ($rootScope.AppData.User && $state.is('video')) {
                        DataService.getList('Playlist', [], [{
                            fieldName: 'user',
                            operator: 'in',
                            value: $rootScope.AppData.User.userId
                        }], 10, true, false)
                            .then(function (res) {
                                // Check playlist items for this video
                                DataService.query('checkInPlaylist', {id: scope.project.id})
                                    .then(function (resA) {
                                        // console.log(resA);
                                        scope.model.playlistArr = resA.data;

                                        // list playlists
                                        scope.playlists = res.data;
                                        // console.log(scope.playlists);
                                    });
                            });
                    }


                    scope.toggleNewPlInput = function (clear) {
                        scope.newPlInput = !scope.newPlInput;
                        if (clear) {
                            scope.model.newName = null;
                        }
                    };

                    scope.newPlaylist = function () {
                        UserActions.checkAuth().then(function (res) {
                            DataService.save('Playlist', {
                                name: scope.model.newName,
                                user: $rootScope.AppData.User.userId
                            }, false, true).then(function (pl) {
                                scope.toggleNewPlInput(false);
                                scope.model.newName = null;
                                scope.playlists.data.push(pl.data)
                            });
                        }, function (err) {
                            UserActions.loginModal().then(function (res) {
                                debugger;
                            });
                        });
                    };

                    scope.syncPlaylists = function (bool, item) {
                        if (bool) {
                            // add item
                            scope.model.playlistArr.push(item);
                            DataService.save('PlaylistItem', {playlist: item.id, project: scope.project.id});
                            $rootScope.toastMessage('Added to playlist');
                            // console.log('Added to playlist: ', item);
                        } else {
                            // remove item

                            for (var i = 0; i < scope.model.playlistArr.length; i++) {
                                if (scope.model.playlistArr[i].id == item.id) {
                                    var genreSetting = _.findWhere(scope.model.playlistArr, {
                                        project: scope.project.id,
                                        playlist: item.id
                                    });
                                    // console.log(genreSetting);
                                    if (genreSetting) {
                                        DataService.delete('PlaylistItem', genreSetting.id);
                                    }
                                    scope.model.playlistArr.splice(i, 1);
                                    $rootScope.toastMessage('Removed from playlist');
                                    // console.log('Removed from playlist: ', item);
                                }
                            }
                        }
                    };

                    scope.isCheckedPlaylist = function (id) {
                        var match = false;
                        for (var i = 0; i < scope.model.playlistArr.length; i++) {
                            if (scope.model.playlistArr[i].playlist == id) {
                                match = true;
                            }
                        }
                        return match;
                    };
                }
            }
        }])
        .directive('toggleShowMore', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
            return {
                restrict: 'A',
                scope: {
                    showMoreHeight: '=showMoreHeight'
                },
                link: function (scope, el, attrs) {
                    $timeout(function () {
                        //show more and less
                        el.showMore({
                            speedDown: 300,
                            speedUp: 300,
                            height: scope.showMoreHeight ? scope.showMoreHeight + 'px' : '165px',
                            showText: 'Show more',
                            hideText: 'Show less'
                        });
                    }, 500);

                }
            }
        }])
        .directive('elitePlayer', ['$rootScope', 'DataService', 'UserActions', '$timeout', '$interval', '$state', 'anchorSmoothScroll', '_', function ($rootScope, DataService, UserActions, $timeout, $interval, $state, anchorSmoothScroll, _) {
            return {
                restrict: 'E',
                templateUrl: './src/directives/videoPlayer.html',
                scope: {film: '=film', type: '=type', lightsOff: '=lightsOff'},
                link: function (scope, el, attrs) {
                    var listenerStarted = false;
                    var hasWatched = false;
                    var playlist = [];
                    //console.log(scope.film);
                    var video = scope.film;
                    //attrs.$observe("film", function (video) {
                    //video = JSON.parse(video);
                    playlist.push({
                        videoType: scope.type,                                      //choose video type: "HTML5", "youtube", "vimeo", "image"
                        title: video.name,                                             //video title
                        youtubeID: scope.type === 'youtube' ? video.hosting_id : "",   //last part if the URL https://www.youtube.com/watch?v=0dJO0HyE8xE
                        vimeoID: scope.type === 'vimeo' ? video.hosting_id : "",          //last part of the URL http://vimeo.com/119641053
                        mp4: scope.type === 'HTML5' ? video.video_url : "",               //HTML5 video mp4 url
                        imageUrl: video.thumbnail_url,                                     //display image instead of playing video
                        imageTimer: 4, 																	  //set time how long image will display
                        prerollAD: "no",                                                                  //show pre-roll "yes","no"
                        prerollGotoLink: "http://getindiewise.com/",                                         //pre-roll goto link
                        // preroll_mp4: "http://creativeinteractivemedia.com/player/videos/Short_Elegant_Logo_Reveal.mp4",   //pre-roll video mp4 format
                        prerollSkipTimer: 5,
                        midrollAD: "no",                                                                  //show mid-roll "yes","no"
                        midrollAD_displayTime: "00:10",                                                    //show mid-roll at any custom time in format "minutes:seconds" ("00:00")
                        midrollGotoLink: "http://getindiewise.com/",                                         //mid-roll goto link
                        // midroll_mp4: "http://creativeinteractivemedia.com/player/videos/Logo_Explode.mp4", //mid-roll video mp4 format
                        midrollSkipTimer: 5,
                        postrollAD: "no",                                                                 //show post-roll "yes","no"
                        postrollGotoLink: "http://getindiewise.com/",                                        //post-roll goto link
                        // postroll_mp4: "http://creativeinteractivemedia.com/player/videos/Logo_Light.mp4",  //post-roll video mp4 format
                        postrollSkipTimer: 5,
                        // popupImg: "images/preview_images/popup.jpg",                        			  	  //popup image URL
                        popupAdShow: "no",                                                                //enable/disable popup image: "yes","no"
                        popupAdStartTime: "00:03",                                                         //time to show popup ad during playback
                        popupAdEndTime: "00:07",                                                           //time to hide popup ad during playback
                        popupAdGoToLink: "http://getindiewise.com/",                                         //re-direct to URL when popup ad clicked
                        description: video.description,                                                      //video description
                        thumbImg: video.thumbnail_url,                                                      //path to playlist thumbnail image
                        info: ""                                                                                    //video info
                    });

                    // Generate playlist
                    DataService.getList("Project", null, [
                        {
                            fieldName: "owner",
                            operator: "in",
                            value: angular.isString(video.owner) ? video.owner : video.owner.id
                        },
                        {fieldName: "id", operator: "notEquals", value: video.id},
                        {fieldName: "unlist", operator: "equals", value: false}
                    ], 10, false, true, 1).then(function (result) {
                        scope.playlistFilms = result.data.data;
                        // console.log("playlist: ", scope.playlistFilms);
                        return scope.playlistFilms;
                    }).then(function (res) {
                        _.each(res, function (vid) {
                            var type = '';
                            if (vid.video_url.indexOf('youtu') != -1) {
                                type = 'youtube';
                            } else if (vid.video_url.indexOf('vimeo') != -1) {
                                type = 'vimeo';
                            } else {
                                type = 'other';
                            }

                            playlist.push({
                                videoType: type,                                                              //choose video type: "HTML5", "youtube", "vimeo", "image"
                                title: vid.name,                                                            //video title
                                youtubeID: type === 'youtube' ? vid.hosting_id : "",                                                          //last part if the URL https://www.youtube.com/watch?v=0dJO0HyE8xE
                                vimeoID: type === 'vimeo' ? vid.hosting_id : "",                                                              //last part of the URL http://vimeo.com/119641053
                                mp4: type === 'hosted' ? vid.video_url : "",               //HTML5 video mp4 url
                                //imageUrl:"images/preview_images/poster2.jpg",                                     //display image instead of playing video
                                //imageTimer:4, 																	  //set time how long image will display
                                prerollAD: "no",                                                                  //show pre-roll "yes","no"
                                prerollGotoLink: "http://getindiewise.com/",                                         //pre-roll goto link
                                preroll_mp4: "http://creativeinteractivemedia.com/player/videos/Short_Elegant_Logo_Reveal.mp4",   //pre-roll video mp4 format
                                prerollSkipTimer: 5,
                                midrollAD: "no",                                                                  //show mid-roll "yes","no"
                                midrollAD_displayTime: "00:10",                                                    //show mid-roll at any custom time in format "minutes:seconds" ("00:00")
                                midrollGotoLink: "http://getindiewise.com/",                                         //mid-roll goto link
                                midroll_mp4: "http://creativeinteractivemedia.com/player/videos/Logo_Explode.mp4", //mid-roll video mp4 format
                                midrollSkipTimer: 5,
                                postrollAD: "no",                                                                 //show post-roll "yes","no"
                                postrollGotoLink: "http://getindiewise.com/",                                        //post-roll goto link
                                postroll_mp4: "http://creativeinteractivemedia.com/player/videos/Logo_Light.mp4",  //post-roll video mp4 format
                                postrollSkipTimer: 5,
                                popupImg: "images/preview_images/popup.jpg",                        			  	  //popup image URL
                                popupAdShow: "no",                                                                //enable/disable popup image: "yes","no"
                                popupAdStartTime: "00:03",                                                         //time to show popup ad during playback
                                popupAdEndTime: "00:07",                                                           //time to hide popup ad during playback
                                popupAdGoToLink: "http://getindiewise.com/",                                         //re-direct to URL when popup ad clicked
                                description: vid.url_id,                                                      //video description
                                thumbImg: vid.thumbnail_url,                                                      //path to playlist thumbnail image
                                info: ""                                                                                    //video info
                            });
                        });
                    }).finally(function () {
                        window.videoPlayer = scope.videoPlayer = el.Video({                  //ALL PLUGIN OPTIONS
                            instanceName: "player1",                      //name of the player instance
                            autohideControls: 2,                          //autohide HTML5 player controls
                            hideControlsOnMouseOut: "No",                 //hide HTML5 player controls on mouse out of the player: "Yes","No"
                            videoPlayerWidth: '100%',                     //fixed total player width
                            videoPlayerHeight: Foundation.MediaQuery.atLeast('large') ? 470 : 420,                       //fixed total player height
                            responsive: true,  //!Foundation.MediaQuery.atLeast('large'),				             //this option will overwrite above videoPlayerWidth/videoPlayerHeight and set player to fit your div (parent) container: true/false
                            playlist: /*scope.type === 'vimeo' ? "Off" :*/ "Right playlist",                   //choose playlist type: "Right playlist", "Off"
                            playlistScrollType: "light",                  //choose scrollbar type: "light","minimal","light-2","light-3","light-thick","light-thin","inset","inset-2","inset-3","rounded","rounded-dots","3d"
                            playlistBehaviourOnPageload: "closed",		 //choose playlist behaviour when webpage loads: "closed", "opened" (not apply to Vimeo player)
                            autoplay: false,                              //autoplay when webpage loads: true/false
                            colorAccent: "#3F51B5",                       //plugin colors accent (hexadecimal or RGB value - http://www.colorpicker.com/)
                            vimeoColor: "00adef",                         //set "hexadecimal value", default vimeo color is "00adef"
                            youtubeControls: "custom controls",			 //choose youtube player controls: "custom controls", "default controls"
                            youtubeSkin: "dark",                          //default youtube controls theme: light, dark
                            youtubeColor: "red",                          //default youtube controls bar color: red, white
                            youtubeQuality: "default",                    //choose youtube quality: "small", "medium", "large", "hd720", "hd1080", "highres", "default"
                            youtubeShowRelatedVideos: "No",				 //choose to show youtube related videos when video finish: "Yes", "No" (onFinish:"Stop video" needs to be enabled)
                            videoPlayerShadow: "effect2",                 //choose player shadow:  "effect1" , "effect2", "effect3", "effect4", "effect5", "effect6", "off"
                            loadRandomVideoOnStart: "No",                 //choose to load random video when webpage loads: "Yes", "No"
                            shuffle: "No",				                 //choose to shuffle videos when playing one after another: "Yes", "No" (shuffle button enabled/disabled on start)
                            posterImg: '',//video.thumbnail_url,                               //player poster image
                            onFinish: "Stop video",                      //"Play next video","Restart video", "Stop video",
                            nowPlayingText: "Yes",                        //enable disable now playing title: "Yes","No"
                            fullscreen: "Fullscreen native",              //choose fullscreen type: "Fullscreen native","Fullscreen browser"
                            rightClickMenu: false,                         //enable/disable right click over HTML5 player: true/false
                            hideVideoSource: true,						 //option to hide self hosted video sources (to prevent users from download/steal your videos): true/false
                            showAllControls: true,						 //enable/disable all HTML5 player controls: true/false
                            allowSkipAd: true,                            //enable/disable "Skip advertisement" option: true/false
                            infoShow: "No",                              //enable/disable info option: "Yes","No"
                            shareShow: "No",                             //enable/disable all share options: "Yes","No"
                            facebookShow: "No",                          //enable/disable facebook option individually: "Yes","No"
                            twitterShow: "No",                           //enable/disable twitter option individually: "Yes","No"
                            mailShow: "No",                              //enable/disable mail option individually: "Yes","No"
                            facebookShareName: video.name,      //first parametar of facebook share in facebook feed dialog is title
                            facebookShareLink: window.location.href,  //second parametar of facebook share in facebook feed dialog is link below title
                            facebookShareDescription: video.description, //third parametar of facebook share in facebook feed dialog is description below link
                            facebookSharePicture: video.thumbnail_url, //fourth parametar in facebook feed dialog is picture on left side
                            twitterText: video.name,			 //first parametar of twitter share in twitter feed dialog is text
                            twitterLink: window.location.href, //second parametar of twitter share in twitter feed dialog is link
                            twitterHashtags: "indiewise",		 //third parametar of twitter share in twitter feed dialog is hashtag
                            twitterVia: "IndieWise",				 //fourth parametar of twitter share in twitter feed dialog is via (@)
                            googlePlus: window.location.href, //share link over Google +
                            logoShow: "Yes",                              //"Yes","No"
                            logoClickable: "Yes",                         //"Yes","No"
                            logoPath: "./assets/img/Logo_alt2_web_87x45.png",             //path to logo image
                            logoGoToLink: "http://getindiewise.com",       //redirect to page when logo clicked
                            logoPosition: "bottom-left",                  //choose logo position: "bottom-right","bottom-left"
                            embedShow: "No",                             //enable/disable embed option: "Yes","No"
                            embedCodeSrc: "www.yourwebsite.com/videoplayer/index.html", //path to your video player on server
                            embedCodeW: "746",                            //embed player code width
                            embedCodeH: "420",                            //embed player code height
                            embedShareLink: window.location.href, //direct link to your site (or any other URL) you want to be "shared"
                            youtubePlaylistID: "",                        //automatic youtube playlist ID (leave blank "" if you want to use manual playlist) LL4qbSRobYCjvwo4FCQFrJ4g
                            youtubeChannelID: "",                         //automatic youtube channel ID (leave blank "" if you want to use manual playlist) UCHqaLr9a9M7g9QN6xem9HcQ

                            //manual playlist
                            videos: playlist
                        });

                        // playlist actions
                        el.find('.elite_vp_item:not(:first) *').bind('click', function (event) {
                            event.preventDefault();
                            var $parent = jQuery(this).hasClass('elite_vp_item') ? jQuery(this) : jQuery(this).parents('.elite_vp_item');
                            var $description = $parent.find('.elite_vp_description');
                            var urlId = $description.html().trim();
                            $state.go('video', {url_id: urlId});
                        });

                        el.find('.fa-elite-backward').bind('click', function (event) {
                            event.preventDefault();
                            var $parent = jQuery('.elite_vp_itemSelected').prev();
                            if (!$parent.length) {
                                $parent = jQuery('.elite_vp_item').last();
                            }
                            var $description = $parent.find('.elite_vp_description');
                            var urlId = $description.html().trim();
                            $state.go('video', {url_id: urlId});
                        });

                        el.find('.fa-elite-forward').bind('click', function (event) {
                            event.preventDefault();
                            var $parent = jQuery('.elite_vp_itemSelected').next();
                            var $description = $parent.find('.elite_vp_description');
                            var urlId = $description.html().trim();
                            $state.go('video', {url_id: urlId});
                        });

                        startedPlaying();
                    });

                    var startedPlaying = $interval(function () {
                        // If Vimeo video
                        if (scope.videoPlayer.state === 'loading' && !!angular.element('#elite_vp_vimeoWrapper iframe')) {
                            // Listen for messages from the player
                            if (!listenerStarted) {
                                if (window.addEventListener) {
                                    window.addEventListener('message', vimeoListener, false);
                                }
                                else {
                                    window.attachEvent('onmessage', vimeoListener);
                                }
                                listenerStarted = true;
                            }
                        }

                        // if YouTube Video
                        if (scope.videoPlayer.state === "elite_vp_playing") {
                            toggleLights();
                            $rootScope.initWatch();

                            switch (scope.type) {
                                case "youtube":
                                    //console.log('Youtube API is Ready');
                                    scope.videoPlayer.youtubePlayer.addEventListener("onStateChange", function (a) {
                                        //console.log(a.target.getPlayerState());
                                        if (a.target.getPlayerState() == 0) {
                                            //console.log('Scroll page to content');
                                            if (scope.lightsOff)
                                                toggleLights();
                                            anchorSmoothScroll.scrollTo('SinglePostStats');
                                        }
                                    });
                                    break;
                            }

                            $interval.cancel(startedPlaying)
                        }
                    }, 1000);

                    function vimeoListener(event) {
                        // Handle messages from the vimeo player only
                        if (!(/^https?:\/\/player.vimeo.com/).test(event.origin)) {
                            return false;
                        }
                        var data = JSON.parse(event.data);

                        if (data.event === 'playProgress') {
                            if (!hasWatched) {
                                if (!!scope.lightsOff) {
                                    toggleLights();
                                }
                                $rootScope.initWatch();
                                hasWatched = true;
                                $interval.cancel(startedPlaying)
                            }

                            if (window.addEventListener) {
                                window.removeEventListener('message', vimeoListener, false);
                            }
                            else {
                                window.detachEvent('onmessage', vimeoListener);
                            }
                        }
                    }

                    function toggleLights() {
                        scope.lightsOff = !scope.lightsOff;
                        var overlay = jQuery('#overlay');
                        overlay.fadeToggle(1000);
                        /* Choose desired delay */
                        if (!scope.lightsOff) {
                            $timeout(function () {
                                overlay.removeClass('highlight');
                            }, 1000);
                            /* Same delay */
                        } else {
                            overlay.addClass('highlight');
                        }
                    }

                    jQuery('#overlay').on('click', function () {
                        toggleLights();
                    });

                    // TODO: on playlist end, exit fullscreen
                    //videoPlayer.fsEnter.click()


                    //$state.go('stateName',params,{
                    //    // prevent the events onStart and onSuccess from firing
                    //    notify:false,
                    //    // prevent reload of the current state
                    //    reload:false,
                    //    // replace the last record when changing the params so you don't hit the back button and get old params
                    //    location:'replace',
                    //    // inherit the current params on the url
                    //    inherit:true
                    //});
                }
            }
        }])
        .directive('elitePlayerEmbed', ['$rootScope', '_', function ($rootScope, _) {
            return {
                restrict: 'E',
                templateUrl: './src/directives/videoPlayer.html',
                scope: { name: '=', hosting_id: '=', url: '=', type: '=', thumbnail: '=', description: '=' },
                link: function (scope, el, attrs) {
                    var playlist = [];
                    playlist.push({
                        videoType: scope.type,                                      //choose video type: "HTML5", "youtube", "vimeo", "image"
                        title: scope.name,                                             //video title
                        youtubeID: scope.type === 'youtube' ? scope.hosting_id : "",   //last part if the URL https://www.youtube.com/watch?v=0dJO0HyE8xE
                        vimeoID: scope.type === 'vimeo' ? scope.hosting_id : "",          //last part of the URL http://vimeo.com/119641053
                        mp4: scope.type === 'HTML5' ? scope.url : "",               //HTML5 video mp4 url
                        imageUrl: scope.thumbnail,                                     //display image instead of playing video
                        imageTimer: 4, 																	  //set time how long image will display
                        prerollAD: "no",                                                                  //show pre-roll "yes","no"
                        prerollGotoLink: "http://getindiewise.com/",                                         //pre-roll goto link
                        // preroll_mp4: "http://creativeinteractivemedia.com/player/videos/Short_Elegant_Logo_Reveal.mp4",   //pre-roll video mp4 format
                        prerollSkipTimer: 5,
                        midrollAD: "no",                                                                  //show mid-roll "yes","no"
                        midrollAD_displayTime: "00:10",                                                    //show mid-roll at any custom time in format "minutes:seconds" ("00:00")
                        midrollGotoLink: "http://getindiewise.com/",                                         //mid-roll goto link
                        // midroll_mp4: "http://creativeinteractivemedia.com/player/videos/Logo_Explode.mp4", //mid-roll video mp4 format
                        midrollSkipTimer: 5,
                        postrollAD: "no",                                                                 //show post-roll "yes","no"
                        postrollGotoLink: "http://getindiewise.com/",                                        //post-roll goto link
                        // postroll_mp4: "http://creativeinteractivemedia.com/player/videos/Logo_Light.mp4",  //post-roll video mp4 format
                        postrollSkipTimer: 5,
                        // popupImg: "images/preview_images/popup.jpg",                        			  	  //popup image URL
                        popupAdShow: "no",                                                                //enable/disable popup image: "yes","no"
                        popupAdStartTime: "00:03",                                                         //time to show popup ad during playback
                        popupAdEndTime: "00:07",                                                           //time to hide popup ad during playback
                        popupAdGoToLink: "http://getindiewise.com/",                                         //re-direct to URL when popup ad clicked
                        description: '',                                                      //video description
                        thumbImg: scope.thumbnail,                                                      //path to playlist thumbnail image
                        info: ""                                                                                    //video info
                    });

                    scope.videoPlayer = el.Video({                  //ALL PLUGIN OPTIONS
                        instanceName: "player_" + new Date().valueOf().toString(),                      //name of the player instance
                        autohideControls: 2,                          //autohide HTML5 player controls
                        hideControlsOnMouseOut: "No",                 //hide HTML5 player controls on mouse out of the player: "Yes","No"
                        videoPlayerWidth: '100%',                     //fixed total player width
                        videoPlayerHeight: Foundation.MediaQuery.atLeast('large') ? 470 : 420,                       //fixed total player height
                        responsive: true,  //!Foundation.MediaQuery.atLeast('large'),				             //this option will overwrite above videoPlayerWidth/videoPlayerHeight and set player to fit your div (parent) container: true/false
                        playlist: "Off",                   //choose playlist type: "Right playlist", "Off"
                        playlistScrollType: "light",                  //choose scrollbar type: "light","minimal","light-2","light-3","light-thick","light-thin","inset","inset-2","inset-3","rounded","rounded-dots","3d"
                        playlistBehaviourOnPageload: "closed",		 //choose playlist behaviour when webpage loads: "closed", "opened" (not apply to Vimeo player)
                        autoplay: false,                              //autoplay when webpage loads: true/false
                        colorAccent: "#3F51B5",                       //plugin colors accent (hexadecimal or RGB value - http://www.colorpicker.com/)
                        vimeoColor: "00adef",                         //set "hexadecimal value", default vimeo color is "00adef"
                        youtubeControls: "custom controls",			 //choose youtube player controls: "custom controls", "default controls"
                        youtubeSkin: "dark",                          //default youtube controls theme: light, dark
                        youtubeColor: "red",                          //default youtube controls bar color: red, white
                        youtubeQuality: "default",                    //choose youtube quality: "small", "medium", "large", "hd720", "hd1080", "highres", "default"
                        youtubeShowRelatedVideos: "No",				 //choose to show youtube related videos when video finish: "Yes", "No" (onFinish:"Stop video" needs to be enabled)
                        videoPlayerShadow: "effect2",                 //choose player shadow:  "effect1" , "effect2", "effect3", "effect4", "effect5", "effect6", "off"
                        loadRandomVideoOnStart: "No",                 //choose to load random video when webpage loads: "Yes", "No"
                        shuffle: "No",				                 //choose to shuffle videos when playing one after another: "Yes", "No" (shuffle button enabled/disabled on start)
                        posterImg: '',//video.thumbnail_url,                               //player poster image
                        onFinish: "Stop video",                      //"Play next video","Restart video", "Stop video",
                        nowPlayingText: "Yes",                        //enable disable now playing title: "Yes","No"
                        fullscreen: "Fullscreen native",              //choose fullscreen type: "Fullscreen native","Fullscreen browser"
                        rightClickMenu: false,                         //enable/disable right click over HTML5 player: true/false
                        hideVideoSource: true,						 //option to hide self hosted video sources (to prevent users from download/steal your videos): true/false
                        showAllControls: true,						 //enable/disable all HTML5 player controls: true/false
                        allowSkipAd: true,                            //enable/disable "Skip advertisement" option: true/false
                        infoShow: "No",                              //enable/disable info option: "Yes","No"
                        shareShow: "No",                             //enable/disable all share options: "Yes","No"
                        facebookShow: "No",                          //enable/disable facebook option individually: "Yes","No"
                        twitterShow: "No",                           //enable/disable twitter option individually: "Yes","No"
                        mailShow: "No",                              //enable/disable mail option individually: "Yes","No"
                        facebookShareName: scope.name,      //first parametar of facebook share in facebook feed dialog is title
                        facebookShareLink: window.location.href,  //second parametar of facebook share in facebook feed dialog is link below title
                        facebookShareDescription: scope.description, //third parametar of facebook share in facebook feed dialog is description below link
                        facebookSharePicture: scope.thumbnail, //fourth parametar in facebook feed dialog is picture on left side
                        twitterText: scope.name,			 //first parametar of twitter share in twitter feed dialog is text
                        twitterLink: window.location.href, //second parametar of twitter share in twitter feed dialog is link
                        twitterHashtags: "indiewise",		 //third parametar of twitter share in twitter feed dialog is hashtag
                        twitterVia: "IndieWise",				 //fourth parametar of twitter share in twitter feed dialog is via (@)
                        googlePlus: window.location.href, //share link over Google +
                        logoShow: "Yes",                              //"Yes","No"
                        logoClickable: "Yes",                         //"Yes","No"
                        logoPath: "./assets/img/Logo_alt2_web_87x45.png",             //path to logo image
                        logoGoToLink: "http://getindiewise.com",       //redirect to page when logo clicked
                        logoPosition: "bottom-left",                  //choose logo position: "bottom-right","bottom-left"
                        embedShow: "No",                             //enable/disable embed option: "Yes","No"
                        embedCodeSrc: "www.yourwebsite.com/videoplayer/index.html", //path to your video player on server
                        embedCodeW: "746",                            //embed player code width
                        embedCodeH: "420",                            //embed player code height
                        embedShareLink: window.location.href, //direct link to your site (or any other URL) you want to be "shared"
                        youtubePlaylistID: "",                        //automatic youtube playlist ID (leave blank "" if you want to use manual playlist) LL4qbSRobYCjvwo4FCQFrJ4g
                        youtubeChannelID: "",                         //automatic youtube channel ID (leave blank "" if you want to use manual playlist) UCHqaLr9a9M7g9QN6xem9HcQ

                        //manual playlist
                        videos: playlist
                    });
                }
            }
        }])
        .directive('offCanvasNav', ['$rootScope', function ($rootScope) {
            return {
                restrict: 'A',
                link: function (scope, el, attrs) {
                    el.find('a').on('click', function () {
                        angular.element('#offCanvas-responsive').foundation('close');
                    });
                }
            }
        }])
        .directive('sideNavNotif', ['$mdSidenav', function ($mdSidenav) {
            return {
                restrict: 'A',
                link: function (scope, el, attrs) {
                    el.find('a').bind('click', function () {
                        $mdSidenav('right').close();
                    });
                }
            }
        }])
        .directive('helpInfo', [function () {
            return {
                restrict: 'E',
                transclude: true,
                templateUrl: './src/directives/help-info.html',
                scope: {
                    text: '=text',
                    direction: '=direction'
                }
            }
        }])
        .directive('projectCard', ['$rootScope', '$state', '$modal', '$mdMedia', 'UserActions', function ($rootScope, $state, $modal, $mdMedia, UserActions) {
            return {
                restrict: 'E',
                transclude: true,
                replace: false,
                templateUrl: './src/directives/project-card.html',
                scope: {
                    video: '=video',
                    type: '=type',
                    related: '=related',
                    queried: '=queried'
                },
                link: function (scope, el, attrs) {
                    scope.isQueried = scope.queried === 'true';
                    scope.isOpenFab = false;
                    scope.isLoggedIn = $rootScope.AppData.User;
                    scope.openShareDialog = openShareDialog;
                    scope.toFavorites = toFavorites;
                    scope.toWatchLater = toWatchLater;
                    scope.check = check;

                    function check(obj) {
                        UserActions.checkAuth().then(function (res) {
                            // Check Saved and Faved Status
                            UserActions.checkFavorite(obj).then(function (res) {
                                scope.isFaved = true;
                            }, function (res) {
                                scope.isFaved = res;
                            });
                            UserActions.checkWatchLater(obj).then(function (res) {
                                scope.isSaved = true;
                            }, function (res) {
                                scope.isSaved = res;
                            });
                        }, function (err) {
                            UserActions.loginModal().then(function (res) {
                                debugger;
                            });
                        });
                    }

                    function toFavorites(obj) {
                        return UserActions.favorite(obj);
                    }

                    function toWatchLater(obj) {
                        return UserActions.watchLater(obj);
                    }

                    function openShareDialog(video) {
                        $modal.open({
                            templateUrl: './src/common/shareDialog.html',
                            resolve: {
                                Video: function () {
                                    return video;
                                }
                            },
                            controller: ['$scope', '$modalInstance', 'Video', function ($scope, $modalInstance, Video) {
                                $scope.video = Video;
                                $scope.shareLink = window.location.origin + '/alpha/' + Video.url_id;
                                $scope.cancel = function () {
                                    $modalInstance.close();
                                };
                            }]
                        })
                    }

                    scope.deleteProject = function (ev) {
                        if ($rootScope.isLoggedIn && ($rootScope.isLoggedIn.id === scope.video.owner.id)) {
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
                    };
                }
            }
        }])
        .directive('commentsBlock', ['$rootScope', 'DataService', 'UserActions', 'UtilsService', '$modal', '_', function ($rootScope, DataService, UserActions, UtilsService, $modal, _) {
            return {
                restrict: 'E',
                templateUrl: './src/directives/comments.html',
                scope: {
                    comments: '=comments',
                    disable: '=disable',
                    parent: '=parent'
                },
                link: function (scope, el, attrs) {
                    scope.model = {
                        myComment: null,
                        isLoggedIn: $rootScope.AppData.User,
                        isLoggedInData: $rootScope.AppData.UserData,
                    };
                    scope.myReply = null;
                    scope.showCommentInput = false;
                    scope.showReplyInput = false;
                    scope.editCommentMode = false;
                    scope.postComment = _.throttle(postComment, 1000);
                    scope.deleteComment = deleteComment;
                    scope.loadReplies = loadReplies;
                    scope.showReplies = false;
                    scope.toggleCommentInput = toggleCommentInput;
                    scope.toggleEditCommentMode = toggleEditCommentMode;
                    scope.toggleReplyInput = toggleReplyInput;

                    function postComment() {
                        UserActions.checkAuth().then(function (res) {
                            if (res) {
                                DataService.save('Comment', {
                                    body: scope.model.myComment,
                                    parentFilm: scope.parent.hasOwnProperty('unlist') ? scope.parent.id : undefined,
                                    parentCritique: !scope.parent.hasOwnProperty('unlist') ? scope.parent.id : undefined,
                                    author: scope.model.isLoggedIn.userId
                                }, true, true)
                                    .then(function (comment) {
                                        angular.extend(comment.data, {
                                            ownerId: comment.data.author.id,
                                            ownerUrlId: comment.data.author.url_id,
                                            ownerFullName: comment.data.author.firstName + ' ' + comment.data.author.lastName,
                                            ownerAvatar: comment.data.author.avatar
                                        });

                                        scope.comments.data.push(comment.data);
                                        $rootScope.toastMessage('Comment posted!');
                                        scope.model.myComment = null;
                                        clearCommentinput();
                                        // refresh parent data
                                        scope.parent.commentCount++;
                                        /*if (scope.parent.hasOwnProperty('unlist')) {
                                         DataService.getItem('Project', scope.parent.id, true, '', 2).then(function (a) {
                                         scope.parent = a.data;
                                         });
                                         } else {*/
                                        DataService.query('getCritiqueByUrlId', {urlId: scope.parent.url_id}).then(function (result) {
                                            scope.parent = result.data[0];
                                        });
                                        //}
                                        // register Action
                                        UtilsService.recordActivity(comment.data, 'comment');


                                    }, function (error) {
                                        console.log('Failed to create new comment, with error code: ' + error.message);
                                    });
                            }
                        })
                    }

                    function deleteComment(c, ev) {
                        UserActions.checkAuth().then(function (res) {
                            if (res) {
                                var confirm = $modal.confirm()
                                    .title('Would you like to delete your comment?')
                                    //.content('All of the banks have agreed to <span class="debt-be-gone">forgive</span> you your debts.')
                                    //.ariaLabel('Lucky day')
                                    .targetEvent(ev)
                                    .ok('Delete')
                                    .cancel('Cancel');
                                $modal.show(confirm).then(function () {
                                    var p = c.parentComment || undefined;

                                    DataService.delete('Comment', c.id).then(function (res) {
                                        // Decrement film commentCount
                                        scope.parent.commentCount--;

                                        //UtilsService.deleteActivity(c);

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
                        if (!comment.repliesLoaded) {
                            DataService.query('getCommentReplies', {id: comment.id}).then(function (replies) {
                                comment.replies = replies.data;
                                comment.repliesLoaded = true;
                                comment.showReplies = !comment.showReplies;
                                return comment;
                            });
                        } else {
                            comment.showReplies = !comment.showReplies;
                            return comment;
                        }
                    }

                    function toggleCommentInput() {
                        scope.showCommentInput = !scope.showCommentInput;
                    }

                    function clearCommentinput() {
                        scope.model.myComment = null;
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
        .directive('critiquesBlock', ['$rootScope', 'DataService', 'UserActions', 'UtilsService', '$modal', function ($rootScope, DataService, UserActions, UtilsService, $modal) {
            return {
                restrict: 'E',
                templateUrl: './src/directives/critiques.html',
                scope: {
                    critiques: '=critiques',
                    disable: '=disable',
                    parentUrlId: '='
                },
                link: function (scope, el, attrs) {
                    scope.isLoggedIn = $rootScope.AppData.User;
                    scope.showQuickReply = !0;

                    scope.isPrivate = function (critique) {
                        return critique.private;
                    };

                    scope.isOwnerOrAuthor = function (critique) {
                        return scope.isLoggedIn && (scope.isLoggedIn.userId == critique.author || scope.isLoggedIn.userId == critique.projectOwner);
                    };

                    scope.deleteCritique = function (c) {
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
                                    if (scope.isOwnerOrAuthor) {
                                        DataService.delete('Critique', c.id).then(function () {
                                            $rootScope.toastMessage('Your critique was deleted.');
                                            // Decrement film critiqueCount
                                            self.film.critiqueCount--;
                                            scope.updateVideoObj();
                                            self.checkUserActions();
                                            scope.critiques = _.reject(scope.critiques, function (a) {
                                                return a.id === c.id;
                                            });
                                        });
                                    }
                                }, function () {
                                    // console.info('Modal dismissed at: ' + new Date());
                                });
                            }
                        })
                    };
                }
            }
        }])
        .directive('toggleReplies', ['$rootScope', function ($rootScope) {
            return {
                restrict: 'A',
                link: function (scope, el, attrs) {
                    if (scope.comment.replyCount) {
                        el.html('Show replies <i class="fa fa-angle-down"></i>');
                    }
                    //comments reply hide show
                    el.on('click', function () {
                        scope.loadReplies(scope.comment);
                        if (scope.comment.replyCount  /*jQuery(this).parent().next().length > 0*/) {
                            jQuery(this).parent().nextAll().slideToggle();
                            //jQuery(this).html(jQuery(this).text() === 'Hide replies' ? 'Show replies' : 'Hide replies');
                            if (jQuery(this).hasClass('hide-reply')) {
                                jQuery(this).removeClass('hide-reply');
                                jQuery(this).html('Show replies <i class="fa fa-angle-down"></i>');
                            } else {
                                jQuery(this).addClass('hide-reply');
                                jQuery(this).html('Hide replies <i class="fa fa-angle-up"></i>');
                            }
                        }
                    });

                }
            }
        }])
        .directive('repliesBlock', [function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: './src/directives/replies.html',
                link: function (scope, el, attrs) {

                }
            }
        }])
        .directive('replyBlock', ['$rootScope', 'UserActions', 'DataService', 'UtilsService', '_', function ($rootScope, UserActions, DataService, UtilsService, _) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: './src/directives/reply-comment.html',
                link: function (scope, el, attrs) {
                    scope.postReply = _.throttle(postReply, 1000);
                    function postReply() {
                        UserActions.checkAuth().then(function (res) {
                            if (res) {
                                var repliedTo = angular.isObject(scope.targetComment.parentComment) ? scope.targetComment.parentComment : scope.targetComment;
                                DataService.save('Comment', {
                                    body: scope.myReply,
                                    //parentFilm: scope.parent.hasOwnProperty('unlist') ? scope.parent.id : undefined,
                                    parentCritique: scope.parent.id,
                                    parentComment: repliedTo.id,
                                    author: scope.model.isLoggedIn.userId
                                }, true, true).then(function (comment) {
                                    if (!!repliedTo.repliesLoaded) {
                                        var repliesLoaded = true;
                                        var oldReplies = repliedTo.replies || [];
                                    }
                                    if (!repliedTo.replies) {
                                        repliedTo.replies = [];
                                    }
                                    angular.extend(comment.data, {
                                        ownerId: comment.data.author.id,
                                        ownerUrlId: comment.data.author.url_id,
                                        ownerFullName: comment.data.author.firstName + ' ' + comment.data.author.lastName,
                                        ownerAvatar: comment.data.author.avatar
                                    });

                                    repliedTo.replies.push(comment.data);
                                    //scope.comments.data.push(comment.data);
                                    scope.toggleReplyInput();
                                    // refresh parent data
                                    scope.parent.commentCount++;
                                    if (scope.parent.hasOwnProperty('unlist')) {
                                        DataService.getItem('Project', scope.parent.id, true, '', 2).then(function (a) {
                                            scope.parent = a.data;
                                            if (repliesLoaded) {
                                                repliedTo.repliesLoaded = true;
                                                oldReplies.push(comment);
                                                repliedTo.replies = oldReplies;
                                            }
                                        });
                                    } else {
                                        DataService.getItem('Critique', scope.parent.id, true, '', 2).then(function (a) {
                                            scope.parent = a.data;
                                            if (repliesLoaded) {
                                                repliedTo.repliesLoaded = true;
                                                oldReplies.push(comment);
                                                repliedTo.replies = oldReplies;
                                            }
                                        });
                                    }

                                    $rootScope.toastMessage('Reply posted!');
                                    scope.myReply = null;

                                    // register Action
                                    UtilsService.recordActivity(comment.data, 'reply');
                                }, function (error) {
                                    console.log('Failed to create new reply, with error code: ' + error.message);
                                });
                            }
                        })
                    }
                }
            }
        }])
        .directive('quickReplyBlock', ['$rootScope', 'UserActions', 'DataService', 'UtilsService', '_', function ($rootScope, UserActions, DataService, UtilsService, _) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: './src/directives/reply-comment.html',
                link: function (scope, el, attrs) {
                    scope.model = {
                        isLoggedIn: $rootScope.AppData.User,
                        isLoggedInData: $rootScope.AppData.UserData
                    };

                    scope.postReply = _.throttle(postReply, 1000);
                    function postReply() {
                        UserActions.checkAuth().then(function (res) {
                            if (res) {
                                DataService.save('Comment', {
                                    body: scope.myReply,
                                    parentCritique: scope.critique.id,
                                    author: scope.model.isLoggedIn.userId
                                }, false, true).then(function (comment) {
                                    scope.critique.commentCount++;
                                    angular.extend(comment.data, {
                                        ownerId: comment.data.author.id,
                                        ownerUrlId: comment.data.author.url_id,
                                        ownerFullName: comment.data.author.firstName + ' ' + comment.data.author.lastName,
                                        ownerAvatar: comment.data.author.avatar
                                    });

                                    scope.myReply = null;
                                    scope.showQuickReply = false;

                                    // register Action
                                    $rootScope.toastMessage('Quick Reply posted!');
                                    UtilsService.recordActivity(comment.data, 'reply');
                                }, function (error) {
                                    console.log('Failed to create new reply, with error code: ' + error.message);
                                });
                            }
                        })
                    }
                }
            }
        }])
        .directive('editCommentBlock', ['$rootScope', 'UserActions', 'DataService', 'UtilsService', '_', function ($rootScope, UserActions, DataService, UtilsService, _) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: './src/directives/edit-comment.html',
                link: function (scope, el, attrs) {
                    scope.editedBody = scope.editComment.body;
                    scope.updateComment = _.throttle(updateComment, 1000);
                    function updateComment() {
                        if (scope.editedBody === scope.editComment.body) {
                            scope.toggleEditCommentMode();
                            return scope.editComment;
                        }
                        UserActions.checkAuth().then(function (res) {
                            DataService.update('Comment', scope.editComment.id, {
                                body: scope.editedBody,
                                editedAt: moment().toDate()
                            }).then(function (comment) {
                                scope.toggleEditCommentMode();
                                return comment.data;
                            })
                        });
                    }
                }
            }
        }])
        .directive('focusOn', ['$timeout', function ($timeout) {
            return {
                restrict: 'A',
                link: function ($scope, $element, $attr) {
                    $scope.$watch($attr.focusOn, function (_focusVal) {
                        $timeout(function () {
                            _focusVal ? $element.focus() :
                                $element.blur();
                        });
                    });
                }
            }
        }])
        .directive('validateEmail', function () {
            var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,5})$/;

            return {
                require: 'ngModel',
                restrict: '',
                link: function (scope, elm, attrs, ctrl) {
                    // only apply the validator if ngModel is present and Angular has added the email validator
                    if (ctrl && ctrl.$validators.email) {

                        // this will overwrite the default Angular email validator
                        ctrl.$validators.email = function (modelValue) {
                            return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
                        };
                    }
                }
            };
        })
        .directive('myEnter', function () {
            return function (scope, element, attrs) {
                element.bind("keydown keypress", function (event) {
                    if (event.which === 13) {
                        scope.$apply(function () {
                            scope.$eval(attrs.myEnter);
                        });

                        event.preventDefault();
                    }
                });
            };
        })
        .directive('datepicker', ['$document', function ($document) {
            return {
                require: 'ngModel',
                restrict: 'A',
                scope: {format: "="},
                link: function (scope, el, attrs, ngModel) {
                    var FIREFOX = /Firefox/i.test(navigator.userAgent);
                    var IEXPLORER = $document.documentMode||false;

                    if (FIREFOX || IEXPLORER) {
                        jQuery(el).fdatepicker({format: scope.format || "mm-dd-yyyy"}).on('changeDate', function (ev) {
                            scope.$apply(function () {
                                ngModel.$setViewValue(ev.date);
                            });
                        })
                    }
                }
            }
        }])
        .directive('linkify', ['$filter', '$timeout', 'linkify', function ($filter, $timeout, linkify) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var type = attrs.linkify || 'normal';
                    $timeout(function () {
                        element.html(linkify[type](element.html()));
                    });
                }
            };
        }])
        .directive('broadstreetZone', ['$window', '$sce', function ($window, $sce) {
            return {
                restrict: 'E',
                templateUrl: './src/directives/broadstreet-zone.html',
                transclude: true,
                scope: { 
                    zone: "=",
                    width: "=",
                    height: "=",
                },
                link: function (scope, el, attrs) {
                    scope.link = $sce.trustAsResourceUrl('http://ad.broadstreetads.com/zdisplay/' + scope.zone + '.html');
                }
            }
        }]);
    angular.module('IndieWise.filters', [])
        .filter('truncate', function () {
            return function (text, length, end) {
                if (angular.isString(text)) {
                    if (isNaN(length))
                        length = 10;

                    if (end === undefined)
                        end = "...";

                    if (text.length <= length || text.length - end.length <= length) {
                        return text;
                    }
                    else {
                        return String(text).substring(0, length - end.length) + end;
                    }
                }
            };
        })
        .filter('secondsToDateTime', [function () {
            return function (seconds) {
                return new Date(1970, 0, 1).setSeconds(seconds);
            };
        }])
        .filter('linkify', function () {

            function linkify(_str, type) {
                if (!_str) {
                    return;
                }

                var _text = _str.replace(/(?:https?\:\/\/|www\.)+(?![^\s]*?")([\w.,@?!^=%&amp;:\/~+#-]*[\w@?!^=%&amp;\/~+#-])?/ig, function (url) {
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
        /*.filter('moment', function () {
            return function (input, momentFn /!*, param1, param2, ...param n *!/) {
                var args = Array.prototype.slice.call(arguments, 2),
                    momentObj = moment(input);
                return momentObj[momentFn].apply(momentObj, args);
            };
        })*/
})();