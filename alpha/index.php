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
<html lang="en" ng-app="IndieWise">
<head>
    <title>IndieWise: {{metadata.title}}</title>

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

    <base href="http://getindiewise.com/alpha/">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
    <meta name="robots" content="NONE">
    <meta property="fb:app_id" content="150687055270744"/>

    <!-- Compiled and minified CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.3/css/materialize.min.css">

    <!-- Compiled and minified JavaScript -->
    <script src="https://code.jquery.com/jquery-1.11.3.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.3/js/materialize.min.js"></script>

    <link rel='stylesheet' href='http://fonts.googleapis.com/css?family=Roboto:400,500,700,400italic'>
    <link rel="stylesheet" href="./app/bower_components/angular-material/angular-material.css"/>
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">

    <link rel="stylesheet" href="./assets/app.css"/>
    <link rel="stylesheet" href="./app/bower_components/animate.css/animate.min.css"/>
</head>

<body layout="row" ng-controller="BodyCtrl as Body" ng-cloak>

<div flex layout="column" tabIndex="-1" role="main" class="">

    <header>
        <md-toolbar layout="row" class="">
            <nav class="md-toolbar-tools nav-wrapper indigo">
                <a ui-sref="home" class="" style="line-height: 12px;">
                    <img src="./assets/img/Logo_alt2_web_87x45.png" alt="IndieWise"/>
                </a>&nbsp;
                <md-button class="menu hide-gt-sm" ng-click="Body.toggleList()" aria-label="Show Menu">
                    <md-icon md-svg-icon="menu"></md-icon>
                </md-button>
                <md-autocomplete class="" flex flex-gt-sm="33" md-selected-item="selectedItem"
                                 md-search-text="Body.searchText"
                                 md-items="item in Body.getMatches(Body.searchText)"
                                 md-item-text="item.attributes.name||item.attributes.term"
                                 md-selected-item-change="Body.startSearch(selectedItem)"
                                 ng-keydown="Body.checkIfEnterKeyWasPressed($event)" md-no-cache="true"
                                 placeholder="Search project name or user" md-min-length="2" md-input-minlength="2">
                    <md-item-template>
                        <span md-highlight-text="Body.searchText" md-highlight-flags="^i">{{item.attributes.name||item.attributes.term}}</span>
                    </md-item-template>
                    <md-not-found>
                        No matches found.
                    </md-not-found>
                </md-autocomplete>
                <div flex align="right">
                    <ul class="right">
                        <li ng-if="!AppData.User">
                            <a class="md-accent md-hue-2" aria-label="Join" ui-sref="register">Join</a>
                        </li>
                        <li>
                            <a ng-if="!AppData.User" class="md-accent" aria-label="Sign In" ui-sref="sign_in">Sign in</a>
                            <md-menubar ng-if="AppData.User">
                                <md-menu md-position-mode="target-right target">
                                    <a aria-label="Open phone interactions menu" class="action-link"
                                       ng-click="$mdOpenMenu($event)">Hi, {{AppData.User.attributes.first_name}}</a>
                                    <md-menu-content width="6">
                                        <md-menu-item style="height: auto">
                                            <md-list>
                                                <md-list-item class="md-2-line">
                                                    <img ng-if="!AppData.User.attributes.avatar"
                                                         src="./assets/img/avatar-1.png" class="md-avatar"
                                                         alt="{{AppData.User.attributes.first_name}} {{AppData.User.attributes.last_name}}"/>
                                                    <img ng-if="AppData.User.attributes.avatar"
                                                         ng-src="{{AppData.User.attributes.avatar}}" class="md-avatar"
                                                         alt="{{AppData.User.attributes.first_name}} {{AppData.User.attributes.last_name}}"/>

                                                    <div class="md-list-item-text" layout="column">
                                                        <h3>{{AppData.User.attributes.first_name}}
                                                            {{AppData.User.attributes.last_name}}</h3>

                                                        <p>{{ item.notes }}</p>
                                                    </div>
                                                </md-list-item>
                                            </md-list>
                                        </md-menu-item>
                                        <md-menu-item>
                                            <md-button ui-sref="profile" class="black-text">
                                                <!--<md-icon md-svg-icon="phone" md-menu-align-target></md-icon>-->
                                                Profile
                                            </md-button>
                                        </md-menu-item>
                                        <md-menu-item>
                                            <md-button ui-sref="messages" class="black-text">
                                                <!--<md-icon md-svg-icon="phone" md-menu-align-target></md-icon>-->
                                                Messages
                                            </md-button>
                                        </md-menu-item>
                                        <md-menu-item>
                                            <md-button ng-click="Body.doSignOut()" class="black-text">
                                                <!--<md-icon md-svg-icon="phone" md-menu-align-target></md-icon>-->
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
    <main>
        <div class="grey lighten-3">
            <md-sidenav md-component-id="left" class="md-sidenav-left">
                <md-toolbar class="md-theme-light">
                    <h1 class="md-toolbar-tools">Menu</h1>
                </md-toolbar>
                <md-content>
                    <md-list>
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
            <div ui-view class=""></div>
            <md-sidenav class="md-sidenav-right md-whiteframe-1dp" md-component-id="right">
                <md-toolbar class="md-theme-light">
                    <h1 class="md-toolbar-tools">Notifications</h1>
                </md-toolbar>
                <md-content>
                    <md-progress-linear md-mode="{{notifications.loaded}}" class="md-accent"></md-progress-linear>
                    <md-list ng-include="Body.notificationsTemplate">
                    </md-list>
                </md-content>
            </md-sidenav>
        </div>
    </main>

    <footer class="page-footer indigo" flex>
        <div class="footer-copyright">
            <div class="container">
                &copy; <?php echo date('Y'); ?> IndieWise

                <a class="grey-text text-lighten-4 right padding-left action-link" ui-sref="privacy">Privacy Policy</a>
                <a class="grey-text text-lighten-3 right padding-left action-link" ui-sref="advertise">Advertise</a>
                <a class="grey-text text-lighten-3 right padding-left action-link" ui-sref="tos">Terms of Service</a>
                <a class="grey-text text-lighten-3 right padding-left action-link" ui-sref="feedback">Feedback</a>
                <a class="grey-text text-lighten-3 right padding-left action-link" ui-sref="about">About</a>
            </div>
        </div>
    </footer>

</div>

<script src="./app/bower_components/underscore/underscore-min.js"></script>
<script src="./app/bower_components/momentjs/moment.js"></script>
<script src="./src/parse-1.6.12.min.js"></script>
<script src="./src/getstream-parse.js"></script>
<script src="./app/bower_components/localforage/dist/localforage.min.js"></script>
<script src="./app/bower_components/getstream/dist/js_min/getstream.js"></script>
<script src="./src/sha1.js"></script>
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
        // Twitter SDK
        add('//platform.twitter.com/widgets.js', 'twitter-wjs');
    }(document, 'script'));
</script>

<!-- AngularJs Components -->
<script src="./app/bower_components/angular/angular.js"></script>
<script src="./app/bower_components/angular-animate/angular-animate.js"></script>
<script src="./app/bower_components/ngAnimate-animate.css/animate.js"></script>
<script src="./app/bower_components/angular-messages/angular-messages.js"></script>
<script src="./app/bower_components/angular-aria/angular-aria.js"></script>
<script src="./app/bower_components/angular-moment/angular-moment.min.js"></script>
<!--[if lte IE 9]>
<script src="//cdnjs.cloudflare.com/ajax/libs/Base64/0.3.0/base64.min.js"></script>
<![endif]-->
<script src="//cdn.jsdelivr.net/satellizer/0.13.3/satellizer.min.js"></script>
<script src="./app/bower_components/angular-localforage/dist/angular-localForage.min.js"></script>
<script src="./app/bower_components/ng-videosharing-embed/build/ng-videosharing-embed.min.js"></script>
<script src="./app/bower_components/ui-router/release/angular-ui-router.min.js"></script>
<script src="./app/bower_components/angularjs-socialshare/dist/angular-socialshare.min.js"></script>
<script src="./app/bower_components/ng-flow/dist/ng-flow-standalone.min.js"></script>
<script type="text/javascript" src="./app/bower_components/angular-material/angular-material.js"></script>
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
