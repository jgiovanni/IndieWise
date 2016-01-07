<?php
/**
 * Created by PhpStorm.
 * User: Jerez
 * Date: 1/6/2016
 * Time: 2:42 AM
 */

//Path to autoload.php from current location
require_once '../vendor/autoload.php';
//Parse\ParseClient::initialize('KkQqsTBaxOWqkoWjrPjz1CyL1iKmPRikVVG1Hwem', 'I176m4qxSQDO5DZoPBdRXp29JOizClrsUXwNFseT', 'vZi7KGAiTlAznqBCs2cTz7oOLlt06dqd0EV5q79q');

use Abraham\TwitterOAuth\TwitterOAuth;

define('CONSUMER_KEY', 'nnSvvHd86gBpxPwJaLGvzM2Mm');
define('CONSUMER_SECRET', 'TbzbhcsQIDzbNLPrDfyirstXTJXI71WANCISNjf4NImzXACHZq');
define('OAUTH_CALLBACK', '/alpha');


$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET);
$request_token = $connection->oauth('oauth/request_token', array('oauth_callback' => OAUTH_CALLBACK));
$url = $connection->url('oauth/authorize', array('oauth_token' => $request_token['oauth_token']));
echo $request_token['oauth_token'];