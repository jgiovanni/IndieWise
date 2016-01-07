<?php
require_once '../vendor/autoload.php';
$SITE_ROOT = "http://getindiewise.com/alpha/";
$ID = $_GET['id'];
$pageUrl = $SITE_ROOT . 'screen/' . $ID;

Parse\ParseClient::initialize('KkQqsTBaxOWqkoWjrPjz1CyL1iKmPRikVVG1Hwem', 'I176m4qxSQDO5DZoPBdRXp29JOizClrsUXwNFseT', 'vZi7KGAiTlAznqBCs2cTz7oOLlt06dqd0EV5q79q');
use Parse\ParseException;
use Parse\ParseObject;
use Parse\ParseQuery;
use Parse\ParseUser;


// Get Film
$filmQuery = new ParseQuery("Film");
$filmQuery->includeKey(["owner", "type"]);
$filmQuery->notEqualTo("unlist", true);

try {
    $film = $filmQuery->get($ID);
    $dataSet = [
        "name" => $film->get("name"),
        "description" => $film->get("description"),
        "thumbnail_url" => $film->get("thumbnail_url"),
    ];
    $data = json_decode(json_encode($dataSet), FALSE);
    makePage($data, $pageUrl);
} catch (ParseException $ex) {
    echo $ex;
}

function makePage($data, $pageUrl) { ?>
    <!DOCTYPE html>
    <html>
    <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <meta charset="utf-8">
        <title><?php echo $data->name; ?></title>

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
    <body>
    <p><?php echo $data->description; ?></p>
    <img src="<?php echo $data->thumbnail_url; ?>">
    </body>
    </html>
<?php } ?>