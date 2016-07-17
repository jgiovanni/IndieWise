<?php
/**
 * Created by PhpStorm.
 * User: Jerez
 * Date: 6/4/2016
 * Time: 4:01 AM
 */

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

//Path to autoload.php from current location
require_once '../vendor/autoload.php';


\Cloudinary::config(array(
    "cloud_name" => "indiewise",
    "api_key" => "199931534948115",
    "api_secret" => "BB0K3mPQYfFLLyqg4x0YgfAPj48"
));

