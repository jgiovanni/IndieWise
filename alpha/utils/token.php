<?php
/**
 * Created by PhpStorm.
 * User: Jerez
 * Date: 11/6/2015
 * Time: 4:26 AM
 */

require_once __DIR__ . '/../vendor/autoload.php';

// Instantiate a new client, find your API keys here https://getstream.io/dashboard/
$client = new GetStream\Stream\Client('pftnxtwf4yuz', 'k563yw7srhjeubw6xbx26def8xta47ume75uqaaewh6k4qyzj4mr3cfcmbts6cf3');

// Set API endpoint location
$client->setLocation('us-east');

// Instantiate a feed object
$user_feed = $client->feed($_GET['type'], $_GET['id']);

//echo $_GET;

echo $user_feed->getToken();