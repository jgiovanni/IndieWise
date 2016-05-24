<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Authorization, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, HEAD, OPTIONS');
require_once __DIR__ . '/vendor/autoload.php';

// Instantiate a new client, find your API keys here https://getstream.io/dashboard/
$client = new GetStream\Stream\Client('pftnxtwf4yuz', 'k563yw7srhjeubw6xbx26def8xta47ume75uqaaewh6k4qyzj4mr3cfcmbts6cf3');

// Set API endpoint location
$client->setLocation('us-east');

// Instantiate a feed object
$user_feed_all = $client->feed('user', 'all');

?>
<!DOCTYPE html>
<html lang="en" ng-app="IndieWise" class="no-js">
<head>
    <title ng-cloak>IndieWise: {{metadata.title}}</title>
    <base href="http://getindiewise.com/alpha/">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
    <meta name="robots" content="NONE">
    <meta property="fb:app_id" content="150687055270744"/>

    <!--Favicon-->
    <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png">
    <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32">
    <link rel="icon" type="image/png" href="/favicon-194x194.png" sizes="194x194">
    <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96">
    <link rel="icon" type="image/png" href="/android-chrome-192x192.png" sizes="192x192">
    <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16">
    <link rel="manifest" href="/manifest.json">
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#2b5797">
    <meta name="msapplication-TileImage" content="/mstile-144x144.png">
    <meta name="theme-color" content="#ffffff">

    <script src="https://cdn.jsdelivr.net/g/underscorejs@1.8.3,js-sha1@0.3.0,jquery@2.2.1,momentjs@2.13.0,momentjs.timezone@0.5.4(moment-timezone-with-data.min.js)"></script>
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <link rel="stylesheet" href='http://fonts.googleapis.com/css?family=Roboto:400,500,700,400italic'>
    <link rel="stylesheet" href="./app/bower_components/animate.css/animate.min.css"/>

    <!-- Elite Video Player -->
    <link rel="stylesheet" href="./app/eliteplayer/deploy/css/elite.css" type="text/css" media="screen"/>
    <link rel="stylesheet" href="./app/eliteplayer/deploy/css/elite-font-awesome.css" type="text/css">
    <link rel="stylesheet" href="./app/eliteplayer/deploy/css/jquery.mCustomScrollbar.css" type="text/css">
    <script src="./app/eliteplayer/deploy/js/froogaloop.js" type="text/javascript"></script>
    <script src="./app/eliteplayer/deploy/js/jquery.mCustomScrollbar.js" type="text/javascript"></script>
    <script src="./app/eliteplayer/deploy/js/THREEx.FullScreen.js"></script>
    <script type="text/javascript" src="./app/eliteplayer/deploy/js/videoPlayer.js"></script>
    <script type="text/javascript" src="./app/eliteplayer/deploy/js/Playlist.js"></script>
    <script type="text/javascript" src="./app/eliteplayer/deploy/js/ZeroClipboard.js"></script>

<!--    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/Allofthelights.js/2.0/jquery.allofthelights-min.js"></script>-->

    <!-- BeTube Styles-->
    <link rel="stylesheet" href="./assets/css/app.css">
    <link rel="stylesheet" href="./assets/css/theme.css">
    <link rel="stylesheet" href="./assets/css/font-awesome.min.css">
    <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800' type='text/css'>
    <link rel="stylesheet" type="text/css" href="./assets/layerslider/css/layerslider.css">
    <link rel="stylesheet" href="./assets/css/owl.carousel.min.css">
    <link rel="stylesheet" href="./assets/css/owl.theme.default.min.css">
    <link rel="stylesheet" href="./assets/css/jquery.kyco.easyshare.css">
    <link rel="stylesheet" href="./assets/css/responsive.css">
    <!-- Custom Styles  -->
    <link rel="stylesheet" href="./assets/app.css"/>

</head>

<body ng-controller="BodyCtrl as Body">

<div class="off-canvas-wrapper">
    <div class="off-canvas-wrapper-inner" data-off-canvas-wrapper>
        <!--header-->
        <div class="off-canvas position-left light-off-menu" id="offCanvas-responsive" data-off-canvas>
            <div class="off-menu-close">
                <h3>Menu</h3>
                <span data-toggle="offCanvas-responsive"><i class="fa fa-times"></i></span>
            </div>
            <ul class="vertical menu off-menu" data-responsive-menu="drilldown">
                <li>
                    <a ui-sref="home" ui-sref-active="active"><i class="fa fa-home"></i>Home</a>
                </li>
                <li><a ui-sref="browse" ui-sref-active="active"><i class="fa fa-th"></i>Browse</a></li>
            </ul>
            <div class="responsive-search">
                <form method="post">
                    <div class="input-group">
                        <input class="input-group-field" type="text" placeholder="Search Here">
                        <div class="input-group-button">
                            <button type="submit" name="search"><i class="fa fa-search"></i></button>
                        </div>
                    </div>
                </form>
            </div>
            <div class="off-social">
                <h6>Get Socialize</h6>
                <a class="secondary-button" href="https://www.facebook.com/getindiewise"><i class="fa fa-facebook"></i></a>
                <a class="secondary-button" href="https://twitter.com/getindiewise"><i class="fa fa-twitter"></i></a>
                <a class="secondary-button" href="https://www.instagram.com/getindiewise/"><i class="fa fa-instagram"></i></a>
            </div>
            <div class="top-button">
                <ul class="menu">
                    <li class="dropdown-login" ng-if="!AppData.User">
                        <a ui-sref="sign_in">login/Register</a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="off-canvas position-right light-off-menu" data-off-canvas id="NotificationsArea">
            <div class="off-menu-close">
                <h3>Notifications</h3>
                <span class="right-off-canvas-toggle"><i class="fa fa-times"></i></span>
            </div>
            <ul class="vertical menu off-menu" data-responsive-menu="drilldown" ng-include="Body.notificationsTemplate">
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
                                                    <input class="input-group-field" type="text" placeholder="Enter username">
                                                </div>
                                                <div class="input-group">
                                                    <span class="input-group-label"><i class="fa fa-lock"></i></span>
                                                    <input class="input-group-field" type="text" placeholder="Enter password">
                                                </div>
                                                <div class="checkbox">
                                                    <input id="check1" type="checkbox" name="check" value="check">
                                                    <label class="customLabel" for="check1">Remember me</label>
                                                </div>
                                                <input type="submit" name="submit" value="Login Now">
                                            </form>
                                            <p class="text-center">New here? <a class="newaccount" ui-sref="register">Create a new Account</a></p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section><!-- End Top -->
                <!--Navber-->
                <section id="navBar">
                    <nav class="sticky-container" data-sticky-container>
                        <div class="sticky topnav" data-sticky data-top-anchor="navBar" data-btm-anchor="footer-bottom:bottom" data-margin-top="0" data-margin-bottom="0" style="width: 100%; background: #fff;" data-sticky-on="large">
                            <div class="row">
                                <div class="large-12 columns">
                                    <div class="title-bar" data-responsive-toggle="beNav" data-hide-for="large">
                                        <button class="menu-icon" type="button" data-toggle="offCanvas-responsive"></button>
                                        <div class="title-bar-title"><img src="./assets/img/Logo_alt2_web_87x45.png" alt="logo"></div>
                                        <!--<div class="title-bar-right">
                                            <a class="fa fa-user fa-2x"></a>
                                            <a class="fa fa-bell fa-2x"></a>
                                        </div>-->
                                    </div>

                                    <div class="top-bar show-for-large" id="beNav" style="width: 100%;">
                                        <div class="top-bar-left  search-btn">
                                            <ul class="menu">
                                                <li class="menu-text">
                                                    <a ui-sref="home"><img src="./assets/img/Logo_alt2_web_87x45.png" alt="logo"></a>
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
                                                <li ng-if="AppData.User" class="search right-off-canvas-toggle">
                                                    <i class="fa fa-bell"></i>
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
                                            <ul class="menu vertical medium-horizontal" data-responsive-menu="drilldown medium-dropdown">
                                                <li ui-sref-active="active">
                                                    <a ui-sref="home"><i class="fa fa-home"></i>Home</a>
                                                </li>
                                                <li ui-sref-active="active"><a ui-sref="browse"><i class="fa fa-th"></i>Browse</a></li>
                                                <li ui-sref-active="active"><a ui-sref="latest"><i class="fa fa-bolt"></i>Latest</a></li>
<!--                                                <li ng-if="AppData.User"><a href="#"><i class="fa fa-user"></i>{{AppData.User.fullName}}</a></li>-->
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="search-bar" class="clearfix search-bar-light">
                                <form ng-submit="Body.startSearch(AppData.searchText)">
                                    <div class="search-input float-left">
                                        <angucomplete-alt id="members"
                                                          placeholder="Search"
                                                          pause="400"
                                                          selected-object="AppData.searchSelected"
                                                          remote-url="https://api.backand.com:443/1/objects/Search?pageSize=20&pageNumber=1&exclude=metadata%2C%20totalRows&search="
                                                          remote-url-data-field="data"
                                                          title-field="term"
                                                          input-class="form-control form-control-small"/>
<!--                                        <input type="search" ng-model="AppData.searchText" ng-keydown="Body.checkIfEnterKeyWasPressed($event)" placeholder="Search Here your video">-->
                                    </div>
                                    <div class="search-btn float-right text-right">
                                        <button class="button" type="submit">search now</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </nav>
                </section>
            </header><!-- End Header -->

            <ui-view ng-cloak></ui-view>

            <!-- footer -->
            <footer ng-cloak>
                <div class="row">
                    <div class="large-3 medium-6 columns">
                        <div class="widgetBox">
                            <div class="widgetTitle">
                                <h5>About IndieWise</h5>
                            </div>
                            <div class="textwidget">
                                The purpose of IndieWise is to allow for an open forum of independent filmmakers and artists who seek feedback on their work from peers and wish to also participate in the feedback and judging of other projects or works.
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
                                <div class="media-object">
                                    <div class="media-object-section">
                                        <div class="recent-img">
                                            <img src= "http://placehold.it/80x80" alt="recent">
                                            <a href="#" class="hover-posts">
                                                <span><i class="fa fa-play"></i></span>
                                            </a>
                                        </div>
                                    </div>
                                    <div class="media-object-section">
                                        <div class="media-content">
                                            <h6><a href="#">The lorem Ipsumbeen the industry's standard.</a></h6>
                                            <p><i class="fa fa-user"></i><span>admin</span><i class="fa fa-clock-o"></i><span>5 january 16</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="large-3 medium-6 columns">
                        <div class="widgetBox">
                            <div class="widgetTitle">
                                <h5>Tags</h5>
                            </div>
                            <div class="tagcloud">
                                <a href="#">3D Videos</a>
                                <a href="#">Videos</a>
                                <a href="#">HD</a>
                                <a href="#">Movies</a>
                                <a href="#">Sports</a>
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
                                        <input type="text" name="fname" ng-model="Body.notifyMe.fname" placeholder="First Name" required>
                                        <span class="form-error">
                                            Yo, you had better fill this out, it's required.
                                        </span>
                                    </div>
                                    <div class="input">
                                        <input type="text" name="lname" ng-model="Body.notifyMe.lname" placeholder="Last Name" required>
                                        <span class="form-error">
                                            Yo, you had better fill this out, it's required.
                                        </span>
                                    </div>
                                    <div class="input">
                                        <input type="email" name="email" ng-model="Body.notifyMe.email" placeholder="Email address" required >
                                        <span class="form-error">
                                          I'm required!
                                        </span>
                                    </div>
                                    <div class="input">
                                        <select name="country" ng-model="Body.notifyMe.country" required>
                                            <option selected>Select Country</option>
                                            <option value="AF">Afghanistan</option>
                                            <option value="AX">Åland Islands</option>
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
                                            <option value="CI">Côte d'Ivoire</option>
                                            <option value="HR">Croatia</option>
                                            <option value="CU">Cuba</option>
                                            <option value="CW">Curaçao</option>
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
                                            <option value="RE">Réunion</option>
                                            <option value="RO">Romania</option>
                                            <option value="RU">Russian Federation</option>
                                            <option value="RW">Rwanda</option>
                                            <option value="BL">Saint Barthélemy</option>
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
                                <div class="social-links">
                                    <h5>We're a Social Bunch</h5>
                                    <a class="secondary-button" href="https://www.facebook.com/getindiewise"><i class="fa fa-facebook"></i></a>
                                    <a class="secondary-button" href="https://twitter.com/getindiewise"><i class="fa fa-twitter"></i></a>
                                    <a class="secondary-button" href="https://www.instagram.com/getindiewise/"><i class="fa fa-instagram"></i></a>
                                </div>
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
                    <p>2015 - <?php echo date('Y');?> &copy; IndieWise</p>
                </div>
            </div>
        </div><!--end off canvas content-->
    </div><!--end off canvas wrapper inner-->
</div><!--end off canvas wrapper-->


<!--<div flex layout="column" tabIndex="-1" role="main" class="">

    <header>
        <md-toolbar layout="row" class="">
            <nav class="md-toolbar-tools nav-wrapper indigo">
                <a ui-sref="home" hide-xs class="" style="line-height: 12px;">
                    <img src="./assets/img/Logo_alt2_web_87x45.png" alt="IndieWise"/>
                </a>&nbsp;
                <a hide-gt-md class="button-collapse" ng-click="Body.toggleList()"><i class="material-icons">menu</i></a>
                <md-autocomplete class="" flex flex-gt-sm="33" md-selected-item="selectedItem" hide-xs hide-sm
                                 md-search-text="AppData.searchText"
                                 md-items="item in Body.getMatches(AppData.searchText)"
                                 md-item-text="item.attributes.name||item.attributes.term"
                                 md-selected-item-change="Body.startSearch(selectedItem)"
                                 ng-keydown="Body.checkIfEnterKeyWasPressed($event)" md-no-cache="true"
                                 placeholder="Search project name or user" md-min-length="2" md-input-minlength="2">
                    <md-item-template>
                        <span md-highlight-text="AppData.searchText" md-highlight-flags="^i">{{item.attributes.name||item.attributes.term}}</span>
                    </md-item-template>
                    <md-not-found>
                        No matches found.
                    </md-not-found>
                </md-autocomplete>
                <md-button hide-xs hide-sm class="md-icon-button" aria-label="Advanced Search" ui-sref="advanced-search">
                    <md-icon md-svg-icon="settings" class="white-text"></md-icon>
                    <md-tooltip md-direction="bottom">Advanced Search</md-tooltip>
                </md-button>
                <div flex align="right">
                    <ul class="right">
                        <li ng-if="!AppData.User">
                            <a class="md-accent md-hue-2" aria-label="Join" ui-sref="register">Join</a>
                        </li>
                        <li ng-if="AppData.User">
                            <a class="md-icon-button" aria-label="Messages" ui-sref="messages">
                                <md-icon md-svg-icon="message-outline" class="black-text" ng-if="!AppData.MessageNotifications.unseen"></md-icon>
                                <md-icon md-svg-icon="message-text" class="black-text" ng-if="AppData.MessageNotifications.unseen"></md-icon>
                                <span class="badge new" ng-if="AppData.MessageNotifications.unseen>0" ng-bind="AppData.MessageNotifications.unseen"></span>
                                <md-tooltip md-direction="bottom">Messages</md-tooltip>
                            </a>
                        </li>
                        <li ng-if="AppData.User">
                            <a class="md-icon-button" aria-label="Notifications" ng-click="Body.openNotificationsMenu()">
                                <md-icon md-svg-icon="notifications_none" ng-if="!AppData.RawNotifications.unseen"></md-icon>
                                <md-icon md-svg-icon="notifications_active" ng-if="AppData.RawNotifications.unseen"></md-icon>
                                <span class="badge new" ng-if="AppData.RawNotifications.unseen>0" ng-bind="AppData.RawNotifications.unseen"></span>
                                <md-tooltip md-direction="bottom">Notifications</md-tooltip>
                            </a>
                        </li>
                        <li>
                            <a ng-if="!AppData.User" class="md-accent" aria-label="Sign In" ui-sref="sign_in">Sign in</a>
                            <md-menubar ng-if="AppData.User">
                                <md-menu md-position-mode="target-right target">
                                    <a aria-label="Open phone interactions menu" class="action-link" style="line-height: 12px;" ng-click="$mdOpenMenu($event)">
                                        <img ng-src="{{AppData.UserData.avatar||'./assets/img/avatar-1.png'}}" class="circle responsive-img md-avatar"
                                             alt="{{AppData.UserData.firstName}} {{AppData.UserData.lastName}}" style="margin: 10px 0; height: 44px;"/>
                                    </a>

                                    <md-menu-content width="6">
                                        <md-menu-item style="height: auto">
                                            <md-list>
                                                <md-list-item class="md-2-line">
                                                    <img ng-src="{{AppData.UserData.avatar||'./assets/img/avatar-1.png'}}" class="md-avatar"
                                                         alt="{{AppData.UserData.firstName}} {{AppData.UserData.lastName}}"/>

                                                    <div class="md-list-item-text" layout="column">
                                                        <h3>{{AppData.UserData.firstName}}
                                                            {{AppData.UserData.lastName}}</h3>
                                                        <p>{{ item.notes }}</p>
                                                    </div>
                                                </md-list-item>
                                            </md-list>
                                        </md-menu-item>
                                        <md-menu-item>
                                            <md-button ui-sref="profile" class="black-text">
                                                Profile
                                            </md-button>
                                        </md-menu-item>
                                        <md-menu-item>
                                            <md-button ng-click="Body.doSignOut()" class="black-text">
                                                Sign Out
                                            </md-button>
                                        </md-menu-item>
                                    </md-menu-content>
                                </md-menu>
                            </md-menubar>
                        </li>
                    </ul>
                    <ul class="right hide-on-med-and-down">
                        <li ui-sref-active="active">
                            <a ui-sref="home">Home</a>
                        </li>
                        <li ui-sref-active="active">
                            <a ui-sref="browse" ui-sref-active="md-accent">Browse</a>
                        </li>
                        <li ui-sref-active="active">
                            <a class="md-icon-button" aria-label="Upload a video" ui-sref="upload">
                                <md-icon md-svg-icon="file_upload"></md-icon>
                                <md-tooltip md-direction="bottom">Upload a video</md-tooltip>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </md-toolbar>
    </header>
    <md-sidenav md-component-id="left" class="md-sidenav-left">
        <md-toolbar class="md-theme-light">
            <h1 class="md-toolbar-tools">
                <a ui-sref="home" class="" style="line-height: 12px;">
                    <img src="./assets/img/Logo_alt2_web_87x45.png" alt="IndieWise"/>
                </a>&nbsp;Menu
            </h1>
        </md-toolbar>
        <md-content>
            <md-list>
                <md-list-item class="">
                    <md-autocomplete flex="85" md-selected-item="selectedItem"
                                     md-search-text="AppData.searchText"
                                     md-items="item in Body.getMatches(AppData.searchText)"
                                     md-item-text="item.attributes.name||item.attributes.term"
                                     md-selected-item-change="Body.startSearch(selectedItem)"
                                     ng-keydown="Body.checkIfEnterKeyWasPressed($event)" md-no-cache="true"
                                     placeholder="Search project name or user" md-min-length="2" md-input-minlength="2">
                        <md-item-template>
                            <span md-highlight-text="AppData.searchText" md-highlight-flags="^i">{{item.attributes.name||item.attributes.term}}</span>
                        </md-item-template>
                        <md-not-found>
                            No matches found.
                        </md-not-found>
                    </md-autocomplete>
                    <md-button flex="15" class="md-icon-button" aria-label="Advanced Search" ui-sref="advanced-search">
                        <md-icon md-svg-icon="settings" class="white-text"></md-icon>
                        <md-tooltip md-direction="bottom">Advanced Search</md-tooltip>
                    </md-button>
                </md-list-item>
                <md-list-item ui-sref-active="active" ng-click="Body.toPage('home');Body.closeLeftMenu()">
                    Home
                </md-list-item>
                <md-list-item ui-sref-active="active" ng-click="Body.toPage('browse');Body.closeLeftMenu()">
                    Browse
                </md-list-item>
                <md-list-item ui-sref-active="active" ng-click="Body.toPage('upload');Body.closeLeftMenu()">
                    Upload
                </md-list-item>
            </md-list>
        </md-content>
    </md-sidenav>
    <main ui-view class="grey lighten-3"></main>


</div>
<md-sidenav class="md-sidenav-right md-whiteframe-1dp" md-component-id="right">
    <md-toolbar class="md-theme-light">
        <div class="md-toolbar-tools">
            <h3>Notifications</h3>
            <span flex></span>
            <md-button class="md-icon-button" ng-click="Body.markAllAsRead()" aria-label="Mark all as read">
                <md-icon md-svg-icon="eye"></md-icon>
                <md-tooltip md-direction="left">Mark all as read</md-tooltip>
            </md-button>
            <!--<md-button class="md-icon-button" aria-label="More">
                <md-icon md-svg-icon="more_vert"></md-icon>
            </md-button>--
        </div>
    </md-toolbar>
    <md-content>
        <md-progress-linear md-mode="{{AppData.RawNotifications.loaded}}" class="md-accent"></md-progress-linear>
        <md-list ng-include="Body.notificationsTemplate">
        </md-list>
    </md-content>
</md-sidenav>-->

<!--<script src="./app/bower_components/underscore/underscore-min.js"></script>-->
<!--<script src="./app/bower_components/momentjs/moment.js"></script>-->
<script src="./src/parse-1.6.12.min.js"></script>
<script src="./src/getstream-parse.min.js"></script>
<!--<script src="./app/bower_components/localforage/dist/localforage.min.js"></script>-->
<script src="./app/bower_components/getstream/dist/js_min/getstream.js"></script>
<!--<script src="./src/sha1.js"></script>-->
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
        add('//connect.facebook.net/en_US/all.js', 'facebook-jssdk');
    }(document, 'script'));
</script>

<!-- AngularJs Components -->
<script src="https://cdn.jsdelivr.net/g/angularjs@1.5.5(angular.min.js+angular-animate.min.js+angular-aria.min.js+angular-messages.min.js),angular.moment@1.0.0-beta.6,angular.flow@2.7.1(ng-flow-standalone.min.js),angular.material@1.1.0-rc1,localforage@1.4.0"></script>
<script src="./app/bower_components/ngAnimate-animate.css/animate.js"></script>
<script src="./app/bower_components/angular-foundation/mm-foundation-tpls.js"></script>
<script src="./app/bower_components/angucomplete-alt/dist/angucomplete-alt.min.js"></script>
<script src="./app/bower_components/cloudinary-core/cloudinary-core.min.js" type="text/javascript"></script>
<sciprt src="./app/bower_components/cloudinary_ng/js/angular.cloudinary.min.js" type="text/javascript"></sciprt>
<!--[if lte IE 9]>
<script src="//cdnjs.cloudflare.com/ajax/libs/Base64/0.3.0/base64.min.js"></script>
<![endif]-->
<!-- Backand SDK for Angular -->
<script src="//cdn.backand.net/backand/dist/1.8.6/backand.min.js"></script>
<!-- Backand Realtime -->
<!--<script src="https://api.backand.com:4000/socket.io/socket.io.js"></script>-->

<!-- BeTube script files -->
<!--<script src="bower_components/jquery/dist/jquery.js"></script>-->
<script src="./app/bower_components/what-input/what-input.js"></script>
<script src="./app/bower_components/foundation-sites/dist/foundation.js"></script>
<script src="./assets/js/jquery.showmore.src.js" type="text/javascript"></script>
<script src="./assets/js/app.js"></script>
<script src="./assets/layerslider/js/greensock.js" type="text/javascript"></script>
<!-- LayerSlider script files -->
<script src="./assets/layerslider/js/layerslider.transitions.js" type="text/javascript"></script>
<script src="./assets/layerslider/js/layerslider.kreaturamedia.jquery.js" type="text/javascript"></script>
<script src="./assets/js/owl.carousel.min.js"></script>
<script src="./assets/js/inewsticker.js" type="text/javascript"></script>
<script src="./assets/js/jquery.kyco.easyshare.js" type="text/javascript"></script>


<script src="./app/bower_components/angular-localforage/dist/angular-localForage.min.js"></script>
<script src="./app/bower_components/ng-videosharing-embed/build/ng-videosharing-embed.min.js"></script>
<script src="./app/bower_components/ui-router/release/angular-ui-router.min.js"></script>
<script src="./app/bower_components/angularjs-socialshare/dist/angular-socialshare.min.js"></script>
<!--<script src="./app/bower_components/ng-flow/dist/ng-flow-standalone.min.js"></script>-->
<script src="./src/parse-angular.js"></script>
<script src="./src/utils.js"></script>

<script src="./src/directives.js"></script>
<script src="./src/services.js"></script>
<script src="./src/controllers.js"></script>
<script src="./src/app.js"></script>


<script>
    window.getStreamToken = '<?php echo($user_feed_all->getReadonlyToken()); ?>' || null;
</script>
</body>
</html>
