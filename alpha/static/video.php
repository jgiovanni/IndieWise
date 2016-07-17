<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

define('REST_URL', 'https://api.backand.com:443');
require_once '../vendor/autoload.php';
use Httpful\Httpful;
use Httpful\Request;

$SITE_ROOT = "http://getindiewise.com/alpha/";
$ID = $_GET['id'];
$pageUrl = $SITE_ROOT . $ID;

$app_name = 'indiewise';
$token_type = "anonymoustoken";
$access_token = "6ef61886-faa0-4f42-bf4d-d827339accfe";

$response = \Httpful\Request::get(REST_URL . '/1/query/data/getProjectByUrlId?parameters=%7B"urlId":"'. $ID . '"%7D')
    ->addHeader('Accept', 'application/json')
    ->addHeader('Content-Type','application/json')
    ->addHeader('anonymoustoken', $access_token)
    ->addHeader('AppName', $app_name)
    ->send();

//print_r($response);
//exit();

$film = json_decode($response)[0];
$dataSet = [
    "name" => $film->name,
    "description" => $film->description,
    "thumbnail_url" => $film->thumbnail_url
];
$data = json_decode(json_encode($dataSet), FALSE);

?>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <meta charset="utf-8">
        <title>IndieWise: <?php echo $data->name; ?></title>

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

            <!-- Twitter summary card metadata -->
        <meta property="twitter:card" content="summary"/>
        <meta property="twitter:site" content="@indiewise"/>
        <meta property="twitter:title" content="<?php echo $data->name; ?>"/>
        <meta property="twitter:description" content="<?php echo $data->description; ?>"/>
        <meta property="twitter:image" content="<?php echo $data->thumbnail_url; ?>"/>
        <meta property="twitter:url" content="<?php echo $pageUrl; ?>"/>

            <!-- Facebook, Pinterest, Google Plus and others make use of open graph metadata -->
        <meta property="fb:app_id" content="150687055270744" />
        <meta property="og:site_name" content="IndieWise"/>
        <meta property="og:locale" content="en_US">
        <meta property="og:title" content="<?php echo $data->name; ?>"/>
        <meta property="og:type" content="video.other"/>
        <meta property="og:description" content="<?php echo $data->description; ?>"/>
        <meta property="og:image" content="<?php echo $data->thumbnail_url; ?>"/>
        <meta property="og:url" content="<?php echo $pageUrl; ?>"/>

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

        <script src="https://cdn.jsdelivr.net/g/underscorejs@1.8.3,js-sha1@0.3.0,jquery@1.11.2,momentjs@2.13.0,momentjs.timezone@0.5.4(moment-timezone-with-data.min.js)"></script>
        <script>

    </head>
    <body>
        <p><?php echo $data->description; ?></p>
        <img src="<?php echo $data->thumbnail_url; ?>">
    </body>
</html>
