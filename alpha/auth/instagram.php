<?php
/**
 * Created by PhpStorm.
 * User: Jerez
 * Date: 1/6/2016
 * Time: 9:00 PM
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

$params = [
    'client_id' => '7b1d007ff12644d6a9804af4f0a2e18c',
    'client_secret' => 'ae806d5834984dc69c89693fb74fc581',
    'grant_type' => 'authorization_code',
    'redirect_uri' => 'http://getindiewise.com',
    'code' => $data->code
];
$defaults = array(
    CURLOPT_URL => 'https://api.instagram.com/oauth/access_token',
    CURLOPT_POST => TRUE,
    CURLOPT_POSTFIELDS => $params,
    CURLOPT_RETURNTRANSFER => TRUE,

);
$ch = curl_init();
curl_setopt_array($ch, ($defaults));

$output = curl_exec($ch);
$output = json_decode($output);
curl_close($ch);
if (isset($output->access_token)) {
    $_SESSION['access_token'] = $output->access_token;

    //Check for User
    ParseClient::initialize('KkQqsTBaxOWqkoWjrPjz1CyL1iKmPRikVVG1Hwem', 'I176m4qxSQDO5DZoPBdRXp29JOizClrsUXwNFseT', 'vZi7KGAiTlAznqBCs2cTz7oOLlt06dqd0EV5q79q');

    $storage = new ParseSessionStorage();
    ParseClient::setStorage($storage);

    // logout any user
    ParseUser::logOut();

    //search for this user
    $query = ParseUser::query();
    $query->equalTo("instagramID", $output->user->id);
    $result = $query->first(true);

    // Generate Password
    $factory = new Factory;
    $generator = $factory->getMediumStrengthGenerator();
    $password = $generator->generateString(26, 'abcdefghijklmnopqrstuvwxyz234567');
    if (empty($result)) {
        try {
            // Signup
            $user = new ParseUser();
            $user->setUsername($output->user->username);
            if (isset($output->user->email))
                $user->setEmail($output->user->email);
            $user->setPassword($password);
            try {
                $user->signUp();

                if (isset($output->user->full_name)) {
                    $names = explode(' ', $output->user->full_name);
                    $user->set("first_name", current($names));
                    $user->set("last_name", end($names));
                }

                if (isset($output->user->bio))
                    $user->set("bio", $output->user->bio);
                $user->set("instagramID", $output->user->id);
                $user->set("instagram_access_token", $output->access_token);
                if (isset($output->user->website))
                    $user->set("website", $output->user->website);
                if (isset($output->user->profile_picture))
                    $user->set("avatar", $output->user->profile_picture);
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
            $result->set("instagram_access_token", $output->access_token);
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