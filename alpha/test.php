<?php
/**
 * Created by PhpStorm.
 * User: Jerez
 * Date: 5/27/2016
 * Time: 6:58 PM
 */
define('REST_URL', 'https://api.backand.com:443');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Authorization, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, HEAD, OPTIONS');
require_once __DIR__ . '/vendor/autoload.php';
use Httpful\Httpful;
use Httpful\Request;

$app_name = 'indiewise';
$response = \Httpful\Request::get(REST_URL . '/1/objects/Film?pageSize=20&pageNumber=1')
		->addHeader('Accept', 'application/json')
		->addHeader('Content-Type','application/json')
		->addHeader('Authorization', $token_type . ' ' . $access_token)
		->addHeader('AppName', $app_name)
		->send();


print_r($response);
