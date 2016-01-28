<?php
/**
 * Created by PhpStorm.
 * User: Jerez
 * Date: 1/6/2016
 * Time: 2:42 AM
 */
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

//Path to autoload.php from current location
require_once '../vendor/autoload.php';
use Abraham\TwitterOAuth\TwitterOAuth;
use Lcobucci\JWT\Builder;
use Parse\ParseClient;
use Parse\ParseUser;
use Parse\ParseSessionStorage;
use Parse\ParseException;
use RandomLib\Factory;

session_start();

$request_body = file_get_contents('php://input');
$data = json_decode($request_body);

define('CONSUMER_KEY', 'nnSvvHd86gBpxPwJaLGvzM2Mm');
define('CONSUMER_SECRET', 'TbzbhcsQIDzbNLPrDfyirstXTJXI71WANCISNjf4NImzXACHZq');
define('OAUTH_CALLBACK', 'http://getindiewise.com/alpha');

// Part 1 of 2: Initial request from Satellizer.
if (!isset($data->oauth_token) || !isset($data->oauth_verifier)) {
    $connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET);
    $request_token = $connection->oauth('oauth/request_token', array('oauth_callback' => OAUTH_CALLBACK));
    if ($request_token['oauth_callback_confirmed']) {
        $_SESSION['oauth_token'] = $request_token['oauth_token'];
        $_SESSION['oauth_token_secret'] = $request_token['oauth_token_secret'];
        //$url = $connection->url('oauth/authorize', array('oauth_token' => $request_token['oauth_token']));
        echo json_encode(['oauth_token' => $request_token['oauth_token']]);
        exit;
    }
} else {
// Part 2 of 2: Second request after Authorize app is clicked.


    $request_token = [];
    $request_token['oauth_token'] = $_SESSION['oauth_token'];
    $request_token['oauth_token_secret'] = $_SESSION['oauth_token_secret'];

    if (isset($data->oauth_token) && $request_token['oauth_token'] !== $data->oauth_token) {
        // Abort! Something is wrong.
        echo 'Abort! Something is wrong.';
        print_r($data);
        print_r($_SESSION);
        print_r($request_token);
        session_unset();
        exit;
    }

    $connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $request_token['oauth_token'], $request_token['oauth_token_secret']);
    $access_token = $connection->oauth("oauth/access_token", array("oauth_verifier" => $data->oauth_verifier));
    $_SESSION['access_token'] = $access_token;
    $connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token['oauth_token'], $access_token['oauth_token_secret']);
    $twitterUser = $connection->get("account/verify_credentials");

    //Check for User
    ParseClient::initialize('KkQqsTBaxOWqkoWjrPjz1CyL1iKmPRikVVG1Hwem', 'I176m4qxSQDO5DZoPBdRXp29JOizClrsUXwNFseT', 'vZi7KGAiTlAznqBCs2cTz7oOLlt06dqd0EV5q79q');

    $storage = new ParseSessionStorage();
    ParseClient::setStorage($storage);

    // logout any user
    ParseUser::logOut();

    //search for this user
    $query = ParseUser::query();
    $query->equalTo("twitterID", $twitterUser->id);
    $result = $query->first(true);

    // Generate Password
    $factory = new Factory;
    $generator = $factory->getMediumStrengthGenerator();
    $password = $generator->generateString(26, 'abcdefghijklmnopqrstuvwxyz234567');
    if (empty($result)) {
        try {
            // Signup
            $user = new ParseUser();
            $user->setUsername($twitterUser->screen_name);
//            if (isset($twitterUser->email))
//                $user->setEmail($twitterUser->email);
            $user->setPassword($password);
            try {
                $user->signUp();

                if (isset($twitterUser->name)) {
                    $names = explode(' ', $twitterUser->name);
                    $user->set("first_name", current($names)||$twitterUser->screen_name);
                    $user->set("last_name", end($names));
                }

                if (isset($twitterUser->description))
                    $user->set("bio", $twitterUser->description);
                $user->set("twitterID", $twitterUser->id);
//                $user->set("instagram_access_token", $output->access_token);
                if (isset($twitterUser->website))
                    $user->set("website", $twitterUser->entities->url->urls[0]->expanded_url);
                if (isset($twitterUser->profile_image_url_https))
                    $user->set("avatar", $twitterUser->profile_image_url_https);
                $user->save(true);

                $user = ParseUser::logIn($user->getUsername(), $password);
                sendSessionToken($user->getSessionToken());
            } catch (ParseException $ex) {
                // error in $ex->getMessage();
                http_response_code(409);
                echo json_encode([
                    "status" => "error",
                    "process" => "signup",
                    "message" => $ex->getMessage()
                ]);
                exit;
            }
        } catch (ParseException $ex) {
            // Password reset failed, check the exception message
            http_response_code(409);
            echo json_encode([
                "status" => "error",
                "process" => "search",
                "message" => $ex->getMessage()
            ]);
        }
    } else {
        // Login
        try {
            $result->setPassword($password);
//            $result->set("instagram_access_token", $output->access_token);
            $result->save(true);
            $user = ParseUser::logIn($result->getUsername(), $password);
            sendSessionToken($user->getSessionToken());
        } catch (ParseException $ex) {
            // error in $ex->getMessage();
            http_response_code(409);
            echo json_encode([
                "status" => "error",
                "process" => "login",
                "message" => $ex->getMessage()
            ]);
            exit;
        }
    }
}