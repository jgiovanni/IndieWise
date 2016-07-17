<?php
define('REST_URL', 'https://api.backand.com:443');

header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Authorization, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, HEAD, OPTIONS');
require_once __DIR__ . '/vendor/autoload.php';
?>
<!DOCTYPE html>
<html lang="en" ng-app="IndieWise" class="no-js">
<head>
    <title>IndieWise</title>
<!--    <title>IndieWise<: {{metadata.title}}</title>-->
    <base href="http://getindiewise.com/alpha/">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="robots" content="NONE">
    <meta property="fb:app_id" content="150687055270744"/>

    <!--Favicon - http://realfavicongenerator.net/ -->
    <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png?v=dLL8Gal3KG">
    <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-60x60.png?v=dLL8Gal3KG">
    <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png?v=dLL8Gal3KG">
    <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png?v=dLL8Gal3KG">
    <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png?v=dLL8Gal3KG">
    <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png?v=dLL8Gal3KG">
    <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png?v=dLL8Gal3KG">
    <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png?v=dLL8Gal3KG">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png?v=dLL8Gal3KG">
    <link rel="icon" type="image/png" href="/favicon-32x32.png?v=dLL8Gal3KG" sizes="32x32">
    <link rel="icon" type="image/png" href="/android-chrome-192x192.png?v=dLL8Gal3KG" sizes="192x192">
    <link rel="icon" type="image/png" href="/favicon-96x96.png?v=dLL8Gal3KG" sizes="96x96">
    <link rel="icon" type="image/png" href="/favicon-16x16.png?v=dLL8Gal3KG" sizes="16x16">
    <link rel="manifest" href="/manifest.json?v=dLL8Gal3KG">
    <link rel="mask-icon" href="/safari-pinned-tab.svg?v=dLL8Gal3KG" color="#5bbad5">
    <link rel="shortcut icon" href="/favicon.ico?v=dLL8Gal3KG">
    <meta name="msapplication-TileColor" content="#00aba9">
    <meta name="msapplication-TileImage" content="/mstile-144x144.png?v=dLL8Gal3KG">
    <meta name="theme-color" content="#ffffff">

    <script
        src="https://cdn.jsdelivr.net/g/underscorejs@1.8.3,js-sha1@0.3.0,jquery@1.11.2,momentjs@2.13.0,momentjs.timezone@0.5.4(moment-timezone-with-data.min.js),fastclick@1.0.6"></script>
    <script>
        // Underscore noConflict();
        var ___ = _.noConflict();
    </script>
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link rel="stylesheet" href='http://fonts.googleapis.com/css?family=Roboto:400,500,700,400italic'>
    <link rel="stylesheet" href="./app/bower_components/foundation-datepicker/css/foundation-datepicker.min.css"/>
    <link rel="stylesheet" href="./app/bower_components/animate.css/animate.min.css"/>

    <!-- Elite Video Player Scripts-->
    <script type="text/javascript" src="./app/eliteplayer/deploy/js/froogaloop.js"></script>
    <script type="text/javascript" src="./app/eliteplayer/deploy/js/jquery.mCustomScrollbar.js"></script>
    <script type="text/javascript" src="./app/eliteplayer/deploy/js/THREEx.FullScreen.js"></script>
    <script type="text/javascript" src="./app/eliteplayer/deploy/js/videoPlayer.js"></script>
    <script type="text/javascript" src="./app/eliteplayer/deploy/js/Playlist.js"></script>
    <script type="text/javascript" src="./app/eliteplayer/deploy/js/ZeroClipboard.js"></script>

<!--    <link rel="stylesheet" href="./app/bower_components/foundation-apps/dist/css/foundation-apps.min.css">-->

<!--    <script src="./app/bower_components/foundation-apps/dist/js/foundation-apps.min.js"></script>-->

<!--    <script src="./app/bower_components/foundation-apps/dist/js/foundation-apps-templates.min.js"></script>-->

    <!-- BeTube Styles-->
    <link rel="stylesheet" href="./assets/css/app.css">
    <link rel="stylesheet" href="./assets/css/theme.css">
    <link rel="stylesheet" href="./assets/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800" type="text/css">
    <link rel="stylesheet" href="./assets/layerslider/css/layerslider.css" type="text/css">
    <link rel="stylesheet" href="./assets/css/owl.carousel.min.css">
    <link rel="stylesheet" href="./assets/css/owl.theme.default.min.css">
    <link rel="stylesheet" href="./assets/css/jquery.kyco.easyshare.css">
    <link rel="stylesheet" href="./assets/css/responsive.css">
    <!-- Elite Video Player Styles-->
    <link rel="stylesheet" href="./app/eliteplayer/deploy/css/elite.css" type="text/css" media="screen"/>
    <link rel="stylesheet" href="./app/eliteplayer/deploy/css/elite-font-awesome.css" type="text/css">
    <link rel="stylesheet" href="./app/eliteplayer/deploy/css/jquery.mCustomScrollbar.css" type="text/css">
    <!-- Custom Styles  -->
    <link rel="stylesheet" href="./assets/app.css"/>

    <script src="//api.filepicker.io/v1/filepicker.js"></script>
    <script src="http://cdn.broadstreetads.com/init.js"></script>
</head>

<body ng-controller="BodyCtrl as Body">

<div class="off-canvas-wrapper">
    <div class="off-canvas-wrapper-inner" data-off-canvas-wrapper>
        <!--header-->
        <div class="off-canvas position-left light-off-menu" id="offCanvas-responsive" data-off-canvas data-close-on-click="false">
            <div class="off-menu-close">
                <h3>Menu</h3>
                <span data-toggle="offCanvas-responsive"><i class="fa fa-times"></i></span>
            </div>
            <ul class="vertical menu off-menu" off-canvas-nav>
                <li><a ui-sref="home" ui-sref-active="active" title="Home"><i class="fa fa-home"></i>Home</a></li>
                <li><a ui-sref="browse" ui-sref-active="active" title="Browse"><i class="fa fa-th"></i>Browse</a></li>
                <li><a ui-sref="latest" ui-sref-active="active" title="Home"><i class="fa fa-bolt"></i>Latest</a></li>
                <li ng-if="AppData.User"><a ui-sref="profile.about" ui-sref-active="active"><i class="fa fa-user"></i>Profile</a></li>
                <li ng-if="AppData.User"><a ui-sref="messages" ui-sref-active="active"><i class="fa fa-envelope"></i>Messages</a></li>
                <li><a ui-sref="profile.upload" ui-sref-active="active"><i class="fa fa-upload"></i>Upload</a></li>
            </ul>
            <div class="responsive-search">
                <form ng-submit="Body.startSearch(AppData.searchText)">
                    <div class="input-group">
                        <input class="input-group-field" ng-model="AppData.searchText" my-enter="Body.startSearch(AppData.searchText)" type="text" placeholder="Search Anything">

                        <div class="input-group-button">
                            <button type="submit" name="search"><i class="fa fa-search"></i></button>
                        </div>
                    </div>
                </form>
            </div>
            <div class="off-social">
                <h6>Get Social</h6>
                <a class="secondary-button" href="https://www.facebook.com/getindiewise"><i class="fa fa-facebook"></i></a>
                <a class="secondary-button" href="https://twitter.com/getindiewise"><i class="fa fa-twitter"></i></a>
                <a class="secondary-button" href="https://www.instagram.com/getindiewise/"><i class="fa fa-instagram"></i></a>
            </div>
            <div class="top-button">
                <ul class="menu" off-canvas-nav>
                    <li class="dropdown-login" ng-if="!AppData.User">
                        <a ui-sref="sign_in">login/Register</a>
                    </li>
                    <li class="dropdown-login" ng-if="AppData.User">
                        <a ng-click="Body.doSignOut();">logout</a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="off-canvas position-right light-off-menu" id="NotificationsArea" data-off-canvas data-close-on-click="false">
            <div class="off-menu-close">
                <h3>Notifications</h3>
                <span class="right-off-canvas-toggle"><i class="fa fa-times"></i></span>
            </div>
            <ul class="vertical menu off-menu notification-list">
                <li ng-repeat="notice in AppData.Notifications.list" ng-click="Body.markAsRead(notice)">
                    <a ng-show="::notice.verb === 'react'" ui-sref="video({url_id:notice.projectUrlId})">
                        <i class="notificon fa fa-smile-o"></i>&nbsp;Your video made <b>{{::notice.actorFullName}}</b> feel <b>{{::notice.reactionEmotion}}</b>.
                    </a>
                    <a ng-show="::notice.verb === 'nominate'" ui-sref="video({url_id:notice.projectUrlId})">
                        <i class="notificon fa fa-smile-o"></i>&nbsp;Your video made <b>{{::notice.actorFullName}}</b> feel <b>{{::notice.reactionEmotion}}</b>.
                    </a>
                    <a ng-show="::notice.verb === 'comment'" ui-sref="video_critique({video_url_id: notice.projectUrlId, url_id:notice.critiqueUrlId})">
                        <i class="notificon fa fa-comment"></i>&nbsp;<b>{{::notice.actorFullName}}</b> posted a comment on your critique.
                    </a>
                    <a ng-show="::notice.verb === 'reply'" ui-sref="video_critique({video_url_id: notice.projectUrlId, url_id:notice.critiqueUrlId})">
                        <i class="notificon fa fa-comment"></i>&nbsp;<b>{{::notice.actorFullName}}</b> replied to your comment.
                    </a>
                    <a ng-show="notice.verb === 'like'" ui-sref="video({url_id:notice.projectUrlId})">
                        <i class="notificon fa fa-thumbs-up"></i>&nbsp;<b>{{::notice.actorFullName}}</b> gave your video two thumbs up.
                    </a>
                    <a ng-show="notice.verb === 'unlike'" ui-sref="video({url_id:notice.projectUrlId})">
                        <i class="notificon fa fa-thumbs-down"></i>&nbsp;<b>{{::notice.actorFullName}}</b> gave your video two thumbs down.
                    </a>
                </li>
            </ul>
        </div>
        <div class="off-canvas-content" data-off-canvas-content>
            <header>
                <!-- Top -->
                <section id="top" class="topBar show-for-large" ng-cloak>
                    <div class="row">
                        <div class="medium-6 columns">
                            <div class="socialLinks">
                                <a href="https://www.facebook.com/getindiewise"><i class="fa fa-facebook-f"></i></a>
                                <a href="https://twitter.com/getindiewise"><i class="fa fa-twitter"></i></a>
                                <a href="https://www.instagram.com/getindiewise/"><i class="fa fa-instagram"></i></a>
                            </div>
                        </div>
                        <div class="medium-6 columns">
                            <div class="top-button">
                                <ul class="menu float-right">
                                    <!--<li ui-sref-active="active">
                                        <a ui-sref="upload">upload Video</a>
                                    </li>-->
                                    <li class="dropdown-login">
                                        <a ng-if="!AppData.User" ui-sref="sign_in">login/Register</a>
                                        <a ng-if="AppData.User" ng-click="Body.doSignOut();">logout</a>

                                        <div class="login-form">
                                            <h6 class="text-center">Great to have you back!</h6>

                                            <form method="post">
                                                <div class="input-group">
                                                    <span class="input-group-label"><i class="fa fa-user"></i></span>
                                                    <input class="input-group-field" type="text"
                                                           placeholder="Enter username">
                                                </div>
                                                <div class="input-group">
                                                    <span class="input-group-label"><i class="fa fa-lock"></i></span>
                                                    <input class="input-group-field" type="text"
                                                           placeholder="Enter password">
                                                </div>
                                                <div class="checkbox">
                                                    <input id="check1" type="checkbox" name="check" value="check">
                                                    <label class="customLabel" for="check1">Remember me</label>
                                                </div>
                                                <input type="submit" name="submit" value="Login Now">
                                            </form>
                                            <p class="text-center">New here? <a class="newaccount" ui-sref="register">Create
                                                    a new Account</a></p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
                <!-- End Top -->
                <!--Navber-->
                <section id="navBar">
                    <nav class="sticky-container" data-sticky-container>
                        <div class="sticky topnav" data-sticky data-top-anchor="navBar"
                             data-btm-anchor="footer-bottom:bottom" data-margin-top="0" data-margin-bottom="0"
                             style="width: 100%; background: #fff;" data-sticky-on="large">
                            <div class="row">
                                <div class="large-12 columns">
                                    <div class="title-bar" data-responsive-toggle="beNav" data-hide-for="large">
                                        <button class="menu-icon" type="button"
                                                data-toggle="offCanvas-responsive"></button>
                                        <div class="title-bar-title">
                                            <img src="./assets/img/Logo_alt2_web_87x45.png" alt="logo">
                                        </div>
                                        <div class="title-bar-right">
                                            <a ng-if="AppData.User" class="fa fa-bell menu-icon right-off-canvas-toggle"></a>
                                        </div>
                                    </div>

                                    <div class="top-bar show-for-large" id="beNav" style="width: 100%;">
                                        <div class="top-bar-left  search-btn">
                                            <ul class="menu">
                                                <li class="menu-text">
                                                    <a ui-sref="home">
                                                        <img src="./assets/img/Logo_alt2_web_87x45.png" alt="logo">
                                                    </a>
                                                </li>
                                                <li class="search end">
                                                    <i class="fa fa-search"></i>
                                                </li>
                                            </ul>
                                        </div>
                                        <div class="top-bar-right search-btn">
                                            <ul class="menu dropdown" dropdown-menu>
                                                <li ng-if="AppData.User" class="search" ui-sref="profile.about">
                                                    <i class="fa fa-user"></i>
                                                </li>
                                                <li ng-if="AppData.User" class="search right-off-canvas-toggle">
                                                    <i class="fa fa-bell-o" ng-show="AppData.Notifications.loaded === 'indeterminate' || !AppData.Notifications.unseen"></i>
                                                    <i class="fa fa-bell" ng-show="AppData.Notifications.unseen"></i>
                                                    <span ng-show="AppData.Notifications.unseen>0" class="alert badge">{{AppData.Notifications.unseen}}</span>
                                                </li>
                                                <li ng-if="AppData.User" class="search" ui-sref="messages">
                                                    <i class="fa fa-envelope"></i>
                                                </li>
                                                <li class="upl-btn end">
                                                    <a ui-sref="profile.upload">Upload Video</a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div class="top-bar-right">
                                            <ul class="menu vertical medium-horizontal"
                                                data-responsive-menu="drilldown medium-dropdown">
                                                <li ui-sref-active="active">
                                                    <a ui-sref="home"><i class="fa fa-home"></i>Home</a>
                                                </li>
                                                <li ui-sref-active="active"><a ui-sref="browse"><i class="fa fa-th"></i>Browse</a>
                                                </li>
                                                <li ui-sref-active="active"><a ui-sref="latest"><i
                                                            class="fa fa-bolt"></i>Latest</a></li>
                                                <!--                                                <li ng-if="AppData.User"><a href="#"><i class="fa fa-user"></i>{{AppData.User.fullName}}</a></li>-->
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="search-bar" class="clearfix search-bar-light">
                                <form ng-submit="Body.startSearch(AppData.searchText)">
                                    <div class="search-input float-left">
                                        <!--<angucomplete-alt id="members"
                                                          placeholder="Search"
                                                          pause="400"
                                                          selected-object="AppData.searchSelected"
                                                          remote-url="https://api.backand.com:443/1/objects/Search?pageSize=20&pageNumber=1&exclude=metadata%2C%20totalRows&search="
                                                          remote-url-data-field="data"
                                                          title-field="term"
                                                          input-class="form-control form-control-small"/>-->
                                        <input type="search" ng-model="AppData.searchText" my-enter="Body.startSearch(AppData.searchText)" placeholder="Search Anything">
                                    </div>
                                    <div class="search-btn float-right text-right">
                                        <button class="button" type="submit">search now</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </nav>
                </section>
            </header>
            <!-- End Header -->
            <!--<div class="callout alert-box warning" data-closable>
                <strong>Yo!</strong> We are experiencing technical difficulties, check back later!
                <button class="close-button" aria-label="Dismiss alert" type="button" data-close>
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>-->

            <div class="ui-view-container">
                <ui-view class="" ng-cloak></ui-view>
            </div>

            <!-- footer -->
            <footer ng-cloak>
                <div class="row">
                    <div class="large-3 medium-6 columns">
                        <div class="widgetBox">
                            <div class="widgetTitle">
                                <h5>About IndieWise</h5>
                            </div>
                            <div class="textwidget">
                                The purpose of IndieWise is to allow for an open platform of Independent Filmmakers,
                                Artists, and Art Lovers, who seek Objective Feedback on their work from peers, and wish
                                to also participate in providing feedback and judging other projects or works.
                            </div>
                            <hr>
                            <div class="">
                                <a class="tiny expanded button" ui-sref="privacy">Privacy Policy</a>
                                <a class="tiny expanded button" ui-sref="advertise">Advertise</a>
                                <a class="tiny expanded button" ui-sref="tos">Terms of Service</a>
                                <a class="tiny expanded button" ui-sref="contact">Contact</a>
                                <a class="tiny expanded button" ui-sref="about">About</a>
                            </div>
                        </div>
                    </div>
                    <div class="large-3 medium-6 columns">
                        <div class="widgetBox">
                            <div class="widgetTitle">
                                <h5>Recent Videos</h5>
                            </div>
                            <div class="widgetContent">
                                <div class="media-object" ng-repeat="video in Body.footerRecentVideos.data|limitTo:3">
                                    <div class="media-object-section">
                                        <div class="recent-img">
                                            <img ng-src="{{::video.thumbnail_url||'./assets/img/default_video_thumbnail.jpg'}}" alt="recent">
                                            <a ui-sref="video({url_id: video.url_id})" class="hover-posts">
                                                <span><i class="fa fa-play"></i></span>
                                            </a>
                                        </div>
                                    </div>
                                    <div class="media-object-section">
                                        <div class="media-content">
                                            <h6><a ui-sref="video({url_id: video.url_id})">{{::video.name|truncate:50}}</a></h6>

                                            <p>
                                                <i class="fa fa-user"></i><span><a ui-sref="user.about({url_id: video.ownerUrlId})">{{::video.ownerFullName}}</a></span>
                                                <i class="fa fa-clock-o"></i><span class="md-caption" am-time-ago="::video.createdAt"></span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="large-3 medium-6 columns">
                        <div class="widgetBox">
                            <div class="widgetTitle">
                                <h5>We're a Social Bunch</h5>
                            </div>
                            <div class="widgetContent">
                                <div class="social-links">
                                    <a class="secondary-button" href="https://www.facebook.com/getindiewise"><i
                                            class="fa fa-facebook"></i></a>
                                    <a class="secondary-button" href="https://twitter.com/getindiewise"><i
                                            class="fa fa-twitter"></i></a>
                                    <a class="secondary-button" href="https://www.instagram.com/getindiewise/"><i
                                            class="fa fa-instagram"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="large-3 medium-6 columns">
                        <div class="widgetBox">
                            <div class="widgetTitle">
                                <h5>Subscribe Now</h5>
                            </div>
                            <div class="widgetContent">
                                <form data-abide ng-submit="Body.newsletterRegister(Body.notifyMe)" name="notifyMe">
                                    <p>Subscribe to get exclusive videos</p>

                                    <div class="input">
                                        <input type="text" name="fname" ng-model="Body.notifyMe.fname"
                                               placeholder="First Name" required>
                                        <span class="form-error">
                                            Yo, you had better fill this out, it's required.
                                        </span>
                                    </div>
                                    <div class="input">
                                        <input type="text" name="lname" ng-model="Body.notifyMe.lname"
                                               placeholder="Last Name" required>
                                        <span class="form-error">
                                            Yo, you had better fill this out, it's required.
                                        </span>
                                    </div>
                                    <div class="input">
                                        <input type="email" name="email" ng-model="Body.notifyMe.email"
                                               placeholder="Email address" required>
                                        <span class="form-error">
                                          I'm required!
                                        </span>
                                    </div>
                                    <div class="input">
                                        <select name="country" ng-model="Body.notifyMe.country" required>
                                            <option selected>Select Country</option>
                                            <option value="AF">Afghanistan</option>
                                            <option value="AX">�land Islands</option>
                                            <option value="AL">Albania</option>
                                            <option value="DZ">Algeria</option>
                                            <option value="AS">American Samoa</option>
                                            <option value="AD">Andorra</option>
                                            <option value="AO">Angola</option>
                                            <option value="AI">Anguilla</option>
                                            <option value="AQ">Antarctica</option>
                                            <option value="AG">Antigua and Barbuda</option>
                                            <option value="AR">Argentina</option>
                                            <option value="AM">Armenia</option>
                                            <option value="AW">Aruba</option>
                                            <option value="AU">Australia</option>
                                            <option value="AT">Austria</option>
                                            <option value="AZ">Azerbaijan</option>
                                            <option value="BS">Bahamas</option>
                                            <option value="BH">Bahrain</option>
                                            <option value="BD">Bangladesh</option>
                                            <option value="BB">Barbados</option>
                                            <option value="BY">Belarus</option>
                                            <option value="BE">Belgium</option>
                                            <option value="BZ">Belize</option>
                                            <option value="BJ">Benin</option>
                                            <option value="BM">Bermuda</option>
                                            <option value="BT">Bhutan</option>
                                            <option value="BO">Bolivia, Plurinational State of</option>
                                            <option value="BQ">Bonaire, Sint Eustatius and Saba</option>
                                            <option value="BA">Bosnia and Herzegovina</option>
                                            <option value="BW">Botswana</option>
                                            <option value="BV">Bouvet Island</option>
                                            <option value="BR">Brazil</option>
                                            <option value="IO">British Indian Ocean Territory</option>
                                            <option value="BN">Brunei Darussalam</option>
                                            <option value="BG">Bulgaria</option>
                                            <option value="BF">Burkina Faso</option>
                                            <option value="BI">Burundi</option>
                                            <option value="KH">Cambodia</option>
                                            <option value="CM">Cameroon</option>
                                            <option value="CA">Canada</option>
                                            <option value="CV">Cape Verde</option>
                                            <option value="KY">Cayman Islands</option>
                                            <option value="CF">Central African Republic</option>
                                            <option value="TD">Chad</option>
                                            <option value="CL">Chile</option>
                                            <option value="CN">China</option>
                                            <option value="CX">Christmas Island</option>
                                            <option value="CC">Cocos (Keeling) Islands</option>
                                            <option value="CO">Colombia</option>
                                            <option value="KM">Comoros</option>
                                            <option value="CG">Congo</option>
                                            <option value="CD">Congo, the Democratic Republic of the</option>
                                            <option value="CK">Cook Islands</option>
                                            <option value="CR">Costa Rica</option>
                                            <option value="CI">C�te d'Ivoire</option>
                                            <option value="HR">Croatia</option>
                                            <option value="CU">Cuba</option>
                                            <option value="CW">Cura�ao</option>
                                            <option value="CY">Cyprus</option>
                                            <option value="CZ">Czech Republic</option>
                                            <option value="DK">Denmark</option>
                                            <option value="DJ">Djibouti</option>
                                            <option value="DM">Dominica</option>
                                            <option value="DO">Dominican Republic</option>
                                            <option value="EC">Ecuador</option>
                                            <option value="EG">Egypt</option>
                                            <option value="SV">El Salvador</option>
                                            <option value="GQ">Equatorial Guinea</option>
                                            <option value="ER">Eritrea</option>
                                            <option value="EE">Estonia</option>
                                            <option value="ET">Ethiopia</option>
                                            <option value="FK">Falkland Islands (Malvinas)</option>
                                            <option value="FO">Faroe Islands</option>
                                            <option value="FJ">Fiji</option>
                                            <option value="FI">Finland</option>
                                            <option value="FR">France</option>
                                            <option value="GF">French Guiana</option>
                                            <option value="PF">French Polynesia</option>
                                            <option value="TF">French Southern Territories</option>
                                            <option value="GA">Gabon</option>
                                            <option value="GM">Gambia</option>
                                            <option value="GE">Georgia</option>
                                            <option value="DE">Germany</option>
                                            <option value="GH">Ghana</option>
                                            <option value="GI">Gibraltar</option>
                                            <option value="GR">Greece</option>
                                            <option value="GL">Greenland</option>
                                            <option value="GD">Grenada</option>
                                            <option value="GP">Guadeloupe</option>
                                            <option value="GU">Guam</option>
                                            <option value="GT">Guatemala</option>
                                            <option value="GG">Guernsey</option>
                                            <option value="GN">Guinea</option>
                                            <option value="GW">Guinea-Bissau</option>
                                            <option value="GY">Guyana</option>
                                            <option value="HT">Haiti</option>
                                            <option value="HM">Heard Island and McDonald Islands</option>
                                            <option value="VA">Holy See (Vatican City State)</option>
                                            <option value="HN">Honduras</option>
                                            <option value="HK">Hong Kong</option>
                                            <option value="HU">Hungary</option>
                                            <option value="IS">Iceland</option>
                                            <option value="IN">India</option>
                                            <option value="ID">Indonesia</option>
                                            <option value="IR">Iran, Islamic Republic of</option>
                                            <option value="IQ">Iraq</option>
                                            <option value="IE">Ireland</option>
                                            <option value="IM">Isle of Man</option>
                                            <option value="IL">Israel</option>
                                            <option value="IT">Italy</option>
                                            <option value="JM">Jamaica</option>
                                            <option value="JP">Japan</option>
                                            <option value="JE">Jersey</option>
                                            <option value="JO">Jordan</option>
                                            <option value="KZ">Kazakhstan</option>
                                            <option value="KE">Kenya</option>
                                            <option value="KI">Kiribati</option>
                                            <option value="KP">Korea, Democratic People's Republic of</option>
                                            <option value="KR">Korea, Republic of</option>
                                            <option value="KW">Kuwait</option>
                                            <option value="KG">Kyrgyzstan</option>
                                            <option value="LA">Lao People's Democratic Republic</option>
                                            <option value="LV">Latvia</option>
                                            <option value="LB">Lebanon</option>
                                            <option value="LS">Lesotho</option>
                                            <option value="LR">Liberia</option>
                                            <option value="LY">Libya</option>
                                            <option value="LI">Liechtenstein</option>
                                            <option value="LT">Lithuania</option>
                                            <option value="LU">Luxembourg</option>
                                            <option value="MO">Macao</option>
                                            <option value="MK">Macedonia, the former Yugoslav Republic of</option>
                                            <option value="MG">Madagascar</option>
                                            <option value="MW">Malawi</option>
                                            <option value="MY">Malaysia</option>
                                            <option value="MV">Maldives</option>
                                            <option value="ML">Mali</option>
                                            <option value="MT">Malta</option>
                                            <option value="MH">Marshall Islands</option>
                                            <option value="MQ">Martinique</option>
                                            <option value="MR">Mauritania</option>
                                            <option value="MU">Mauritius</option>
                                            <option value="YT">Mayotte</option>
                                            <option value="MX">Mexico</option>
                                            <option value="FM">Micronesia, Federated States of</option>
                                            <option value="MD">Moldova, Republic of</option>
                                            <option value="MC">Monaco</option>
                                            <option value="MN">Mongolia</option>
                                            <option value="ME">Montenegro</option>
                                            <option value="MS">Montserrat</option>
                                            <option value="MA">Morocco</option>
                                            <option value="MZ">Mozambique</option>
                                            <option value="MM">Myanmar</option>
                                            <option value="NA">Namibia</option>
                                            <option value="NR">Nauru</option>
                                            <option value="NP">Nepal</option>
                                            <option value="NL">Netherlands</option>
                                            <option value="NC">New Caledonia</option>
                                            <option value="NZ">New Zealand</option>
                                            <option value="NI">Nicaragua</option>
                                            <option value="NE">Niger</option>
                                            <option value="NG">Nigeria</option>
                                            <option value="NU">Niue</option>
                                            <option value="NF">Norfolk Island</option>
                                            <option value="MP">Northern Mariana Islands</option>
                                            <option value="NO">Norway</option>
                                            <option value="OM">Oman</option>
                                            <option value="PK">Pakistan</option>
                                            <option value="PW">Palau</option>
                                            <option value="PS">Palestinian Territory, Occupied</option>
                                            <option value="PA">Panama</option>
                                            <option value="PG">Papua New Guinea</option>
                                            <option value="PY">Paraguay</option>
                                            <option value="PE">Peru</option>
                                            <option value="PH">Philippines</option>
                                            <option value="PN">Pitcairn</option>
                                            <option value="PL">Poland</option>
                                            <option value="PT">Portugal</option>
                                            <option value="PR">Puerto Rico</option>
                                            <option value="QA">Qatar</option>
                                            <option value="RE">R�union</option>
                                            <option value="RO">Romania</option>
                                            <option value="RU">Russian Federation</option>
                                            <option value="RW">Rwanda</option>
                                            <option value="BL">Saint Barth�lemy</option>
                                            <option value="SH">Saint Helena, Ascension and Tristan da Cunha</option>
                                            <option value="KN">Saint Kitts and Nevis</option>
                                            <option value="LC">Saint Lucia</option>
                                            <option value="MF">Saint Martin (French part)</option>
                                            <option value="PM">Saint Pierre and Miquelon</option>
                                            <option value="VC">Saint Vincent and the Grenadines</option>
                                            <option value="WS">Samoa</option>
                                            <option value="SM">San Marino</option>
                                            <option value="ST">Sao Tome and Principe</option>
                                            <option value="SA">Saudi Arabia</option>
                                            <option value="SN">Senegal</option>
                                            <option value="RS">Serbia</option>
                                            <option value="SC">Seychelles</option>
                                            <option value="SL">Sierra Leone</option>
                                            <option value="SG">Singapore</option>
                                            <option value="SX">Sint Maarten (Dutch part)</option>
                                            <option value="SK">Slovakia</option>
                                            <option value="SI">Slovenia</option>
                                            <option value="SB">Solomon Islands</option>
                                            <option value="SO">Somalia</option>
                                            <option value="ZA">South Africa</option>
                                            <option value="GS">South Georgia and the South Sandwich Islands</option>
                                            <option value="SS">South Sudan</option>
                                            <option value="ES">Spain</option>
                                            <option value="LK">Sri Lanka</option>
                                            <option value="SD">Sudan</option>
                                            <option value="SR">Suriname</option>
                                            <option value="SJ">Svalbard and Jan Mayen</option>
                                            <option value="SZ">Swaziland</option>
                                            <option value="SE">Sweden</option>
                                            <option value="CH">Switzerland</option>
                                            <option value="SY">Syrian Arab Republic</option>
                                            <option value="TW">Taiwan, Province of China</option>
                                            <option value="TJ">Tajikistan</option>
                                            <option value="TZ">Tanzania, United Republic of</option>
                                            <option value="TH">Thailand</option>
                                            <option value="TL">Timor-Leste</option>
                                            <option value="TG">Togo</option>
                                            <option value="TK">Tokelau</option>
                                            <option value="TO">Tonga</option>
                                            <option value="TT">Trinidad and Tobago</option>
                                            <option value="TN">Tunisia</option>
                                            <option value="TR">Turkey</option>
                                            <option value="TM">Turkmenistan</option>
                                            <option value="TC">Turks and Caicos Islands</option>
                                            <option value="TV">Tuvalu</option>
                                            <option value="UG">Uganda</option>
                                            <option value="UA">Ukraine</option>
                                            <option value="AE">United Arab Emirates</option>
                                            <option value="GB">United Kingdom</option>
                                            <option value="US">United States</option>
                                            <option value="UM">United States Minor Outlying Islands</option>
                                            <option value="UY">Uruguay</option>
                                            <option value="UZ">Uzbekistan</option>
                                            <option value="VU">Vanuatu</option>
                                            <option value="VE">Venezuela, Bolivarian Republic of</option>
                                            <option value="VN">Viet Nam</option>
                                            <option value="VG">Virgin Islands, British</option>
                                            <option value="VI">Virgin Islands, U.S.</option>
                                            <option value="WF">Wallis and Futuna</option>
                                            <option value="EH">Western Sahara</option>
                                            <option value="YE">Yemen</option>
                                            <option value="ZM">Zambia</option>
                                            <option value="ZW">Zimbabwe</option>

                                        </select>
                                    </div>
                                    <button class="button" type="submit">Sign up Now</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <a href="#" id="back-to-top" title="Back to top"><i class="fa fa-angle-double-up"></i></a>
            </footer>
            <!-- footer -->
            <div id="footer-bottom" ng-cloak>
                <div class="logo text-center">
                    <img src="./assets/img/Logo_alt2_web_87x45_white.png" alt="footer logo">
                </div>
                <div class="btm-footer-text text-center">
                    <p>2015 - <?php echo date('Y'); ?> &copy; IndieWise</p>
                </div>
            </div>
        </div>
        <!--end off canvas content-->
    </div>
    <!--end off canvas wrapper inner-->
</div>
<!--end off canvas wrapper-->

<div id="alerts" ng-cloak>
    <!--<div class="callout alert-box success">
        <strong>Yo!</strong> Alert Success
        <a href="#" class="close">?</a>
    </div>
    <div class="callout alert-box alert">
        <strong>Yo!</strong> Alert Alert
        <a href="#" class="close">?</a>
    </div>
    <div class="callout alert-box info">
        <strong>Yo!</strong> Alert Info
        <a href="#" class="close">?</a>
    </div>
    <div class="callout alert-box warning">
        <strong>Yo!</strong> Alert Warning
        <a href="#" class="close">?</a>
    </div>
    <div class="callout alert-box large">
        <strong>Yo!</strong> Large Alert
        <a href="#" class="close">?</a>
    </div>
    <div class="callout alert-box small">
        <strong>Yo!</strong> Small Alert
        <a href="#" class="close">?</a>
    </div>


    -->
</div>

<!-- Async Social SDKs -->
<div id="fb-root"></div>
<script type="text/javascript">
    (function (doc, script) {
        var js,
            fjs = doc.getElementsByTagName(script)[0],
            add = function (url, id) {
                if (doc.getElementById(id)) {
                    return;
                }
                js = doc.createElement(script);
                js.src = url;
                id && (js.id = id);
                fjs.parentNode.insertBefore(js, fjs);
            };
        // Facebook SDK
        add('//connect.facebook.net/en_US/sdk.js', 'facebook-jssdk');
    }(document, 'script'));
</script>

<!-- AngularJs Components -->
<script src="./app/bower_components/lodash/lodash.js"></script>
<script src="./app/bower_components/foundation-datepicker/js/foundation-datepicker.min.js"></script>
<script
    src="https://cdn.jsdelivr.net/g/angularjs@1.5.5(angular.js+angular-animate.min.js+angular-aria.min.js+angular-messages.min.js),angular.moment@1.0.0-beta.6,localforage@1.4.0,angular.translate@2.11.0"></script>
<script src="./app/bower_components/angular-filepicker/dist/angular_filepicker.min.js"></script>
<script src="./app/bower_components/ng-flow/dist/ng-flow-standalone.js"></script>
<script src="./app/bower_components/ngAnimate-animate.css/animate.js"></script>
<script src="./app/bower_components/angular-foundation-6/dist/angular-foundation.js"></script>
<script src="./app/bower_components/angucomplete-alt/dist/angucomplete-alt.min.js"></script>
<script src="./app/bower_components/cloudinary-core/cloudinary-core.min.js" type="text/javascript"></script>
<script src="./app/bower_components/angular-material/angular-material.min.js"></script>
<script src="./app/bower_components/cloudinary_ng/js/angular.cloudinary.min.js" type="text/javascript"></script>
<script src="./app/bower_components/angular-localforage/dist/angular-localForage.min.js"></script>
<script src="./app/bower_components/ng-videosharing-embed/build/ng-videosharing-embed.min.js"></script>
<script src="./app/bower_components/angular-google-analytics/dist/angular-google-analytics.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/1.0.0-alpha.5/angular-ui-router.min.js"></script>
<!--[if lte IE 9]>
<script src="//cdnjs.cloudflare.com/ajax/libs/Base64/0.3.0/base64.min.js"></script>
<![endif]-->
<!-- Backand SDK for Angular -->
<script src="./app/bower_components/angularbknd-sdk/dist/backand.min.js"></script>
<!-- Backand Realtime -->
<script src="https://api.backand.com:4000/socket.io/socket.io.js"></script>

<!-- BeTube script files -->
<script src="./app/bower_components/what-input/what-input.js"></script>
<script src="./app/bower_components/foundation-sites/dist/foundation.js"></script>
<script src="./assets/js/jquery.showmore.src.js" type="text/javascript"></script>
<script src="./assets/js/app.js"></script>
<script src="./assets/layerslider/js/greensock.js" type="text/javascript"></script>
<!-- LayerSlider script files -->
<script src="./assets/layerslider/js/layerslider.transitions.js" type="text/javascript"></script>
<script src="./assets/layerslider/js/layerslider.kreaturamedia.jquery.js" type="text/javascript"></script>
<script src="./assets/js/owl.carousel.min.js"></script>
<!--<script src="./assets/js/inewsticker.js" type="text/javascript"></script>-->
<!--<script src="./assets/js/jquery.kyco.easyshare.js" type="text/javascript"></script>-->

<script src="./app/bower_components/angular-socialshare/dist/angular-socialshare.min.js"></script>
<script src="./src/utils.js"></script>

<script src="./src/directives.js"></script>
<script src="./src/services.js"></script>
<script src="./src/controllers.js"></script>
<script src="./src/app.js"></script>

</body>
</html>
