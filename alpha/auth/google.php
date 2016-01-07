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
use Lcobucci\JWT\Builder;
use Parse\ParseClient;
use Parse\ParseUser;
use Parse\ParseSessionStorage;
use Parse\ParseException;
use RandomLib\Factory;

session_start();

$request_body = file_get_contents('php://input');
$data = json_decode($request_body);

$client = new Google_Client();
$client->setApplicationName("IndieWise");
$client->setDeveloperKey("AIzaSyA83WR8lz4KJPH_GtjC5B0VrFULHhBZ1Vw");
$client->setAuthConfigFile('../utils/client_secret_322274582930-4m1dueb708gvdic28n12e5dhqq121a6b.apps.googleusercontent.com.json');
$client->setScopes('email,https://www.googleapis.com/auth/plus.login,profile');
$client->setRedirectUri('http://' . $_SERVER['HTTP_HOST']);

/*
If we're logging out we just need to clear our
local access token in this case
*/
if (isset($_REQUEST['logout'])) {
    unset($_SESSION['access_token']);
}
/*
If we have a code back from the OAuth 2.0 flow,
we need to exchange that with the authenticate()
function. We store the resultant access token
bundle in the session, and redirect to ourself.
*/
if (isset($data->code)) {
    $client->authenticate($data->code);
    $_SESSION['access_token'] = $client->getAccessToken();
//    $redirect = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'];
//    header('Location: ' . filter_var($redirect, FILTER_SANITIZE_URL));
}

/*
If we have an access token, we can make
requests, else we generate an authentication URL.
*/
if (isset($_SESSION['access_token']) && $_SESSION['access_token']) {
    $client->setAccessToken($_SESSION['access_token']);
} else {
    $authUrl = $client->createAuthUrl();
}
/*
If we're signed in we can go ahead and retrieve
the ID token, which is part of the bundle of
data that is exchange in the authenticate step
- we only need to do a network call if we have
to retrieve the Google certificate to verify it,
and that can be cached.
*/
if ($client->getAccessToken()) {
    $_SESSION['access_token'] = $client->getAccessToken();
    $token_data = $client->verifyIdToken()->getAttributes();

    //Check for User
    ParseClient::initialize('KkQqsTBaxOWqkoWjrPjz1CyL1iKmPRikVVG1Hwem', 'I176m4qxSQDO5DZoPBdRXp29JOizClrsUXwNFseT', 'vZi7KGAiTlAznqBCs2cTz7oOLlt06dqd0EV5q79q');

    $storage = new ParseSessionStorage();
    ParseClient::setStorage( $storage );

    // logout any user
    ParseUser::logOut();

    //search for this user
    $query = ParseUser::query();
    $query->equalTo("googleID", $token_data['payload']['sub']);
    $result = $query->first(true);

    // Generate Password
    $factory = new Factory;
    $generator = $factory->getMediumStrengthGenerator();
    $password = $generator->generateString(26, 'abcdefghijklmnopqrstuvwxyz234567');
    if (empty($result)) {
        try {
            // Signup
            $user = new ParseUser();
            $user->setUsername($token_data['payload']['email']);
            $user->setEmail($token_data['payload']['email']);
            $user->setPassword($password);
            try {
                $user->signUp();

                $user->set("googleID", $token_data['payload']['sub']);
                if (is_object($client->getAccessToken()))
                    $user->set("google_access_token", $client->getAccessToken()->access_token);
                if (isset($token_data['payload']['picture']))
                    $user->set("avatar", $token_data['payload']['picture']);
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
            if (is_object($client->getAccessToken()))
                $result->set("google_access_token", $client->getAccessToken()->access_token);
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

function sendSessionToken($data)
{
    $token = (new Builder())->setIssuer('http://getindiewise.com')// Configures the issuer (iss claim)
    ->setAudience('http://getindiewise.com')// Configures the audience (aud claim)
    ->setIssuedAt(time())// Configures the time that the token was issue (iat claim)
    ->setNotBefore(time() + 60)// Configures the time that the token can be used (nbf claim)
    ->setExpiration(time() + 3600)// Configures the expiration time of the token (exp claim)
    ->set('sessionToken', $data)// Configures a new claim, called "uid"
    ->getToken(); // Retrieves the generated token

    echo $token;
    exit;
}


/*if (strpos($client_id, "googleusercontent") == false) {
    echo missingClientSecretsWarning();
    exit;
}*/