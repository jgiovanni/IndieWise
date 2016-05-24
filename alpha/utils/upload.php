<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

//Path to autoload.php from current location
require_once '../vendor/autoload.php';

$tempDir = __DIR__ . DIRECTORY_SEPARATOR . 'temp';
if (!file_exists($tempDir)) {
    mkdir($tempDir);
}
$filesDir = __DIR__ . DIRECTORY_SEPARATOR . 'files';
if (!file_exists($filesDir)) {
    mkdir($filesDir);
}

// Include MailChimp API
require('../vendor/flowjs/flow-php-server/src/Flow/Autoloader.php');
use Flow\Autoloader;
use Flow\Config;
use Flow\Request;
use Flow\Basic;

Flow\Autoloader::register();

if (1 == mt_rand(1, 100)) {
    \Flow\Uploader::pruneChunks('./$tempDir');
}

$config = new Flow\Config();
$config->setTempDir($tempDir);
$file = new \Flow\File($config);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($file->checkChunk()) {
        header("HTTP/1.1 200 Ok");
    } else {
        header("HTTP/1.1 204 No Content");
        return;
    }
} else {
    if ($file->validateChunk()) {
        $file->saveChunk();
    } else {
        // error, invalid chunk upload request, retry
        header("HTTP/1.1 400 Bad Request");
        return;
    }
}
if ($file->validateFile()) {
    // This is final chunk, upload complete
    // Image Optimizations
    $request = new Flow\Request();
    $thumb = new Imagick($file->getChunkPath(1));

    $thumb->resizeImage(200,200,Imagick::FILTER_LANCZOS ,1, true);
    $thumb->cropThumbnailImage(200, 200);
    $thumb->writeImage($file->getChunkPath(1));

    //$thumb->destroy();

    if ($file->save($filesDir . DIRECTORY_SEPARATOR . $request->getFileName())) {
        // File upload was completed
        echo json_encode([
            'success' => true,
            'file' => $file,
            'files' => $_FILES,
            'get' => $_GET,
            'post' => $_POST
        ]);
        exit();
    }
} else {
    // This is not a final chunk, continue to upload
}