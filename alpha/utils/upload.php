<?php
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

$config = new Flow\Config();
$config->setTempDir($tempDir);
/*$file = new \Flow\File($config);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($file->checkChunk()) {
        header("HTTP/1.1 200 Ok");
    } else {
        header("HTTP/1.1 204 No Content");
        return ;
    }
} else {
    if ($file->validateChunk()) {
        $file->saveChunk();
    } else {
        // error, invalid chunk upload request, retry
        header("HTTP/1.1 400 Bad Request");
        return ;
    }
}
if ($file->validateFile() && $file->save($filesDir . DIRECTORY_SEPARATOR . $file->getIdentifier())) {
    // File upload was completed
    echo json_encode([
        'success' => true,
        'file' => $file,
        'files' => $_FILES,
        'get' => $_GET,
        'post' => $_POST
    ]);
} else {
    // This is not a final chunk, continue to upload
}*/
$request = new Flow\Request();
if (Flow\Basic::save($filesDir . DIRECTORY_SEPARATOR . $request->getFileName(), $config, $request)) {
    // file saved successfully and can be accessed at './final_file_destination'
    echo json_encode([
        'success' => true,
        //'file' => $filesDir . DIRECTORY_SEPARATOR . $request->getFileName(),
        'files' => $_FILES,
        'get' => $_GET,
        'post' => $_POST,
        //optional
        //'flowTotalSize' => isset($_FILES['file']) ? $_FILES['file']['size'] : $_GET['flowTotalSize'],
        //'flowIdentifier' => isset($_FILES['file']) ? $_FILES['file']['name'] . '-' . $_FILES['file']['size'] : $_GET['flowIdentifier'],
        //'flowFilename' => isset($_FILES['file']) ? $_FILES['file']['name'] : $_GET['flowFilename'],
        //'flowRelativePath' => isset($_FILES['file']) ? $_FILES['file']['tmp_name'] : $_GET['flowRelativePath'],
        //'flowRelativePath' => isset($_FILES['file']) ? $_FILES['file']['tmp_name'] : $_GET['flowRelativePath']
 ]);
} else {
    // This is not a final chunk or request is invalid, continue to upload.
}

// Just imitate that the file was stored.
/*echo json_encode([
    'success' => true,
    'files' => $_FILES,
    'get' => $_GET,
    'post' => $_POST,
    //optional
    'flowTotalSize' => isset($_FILES['file']) ? $_FILES['file']['size'] : $_GET['flowTotalSize'],
    'flowIdentifier' => isset($_FILES['file']) ? $_FILES['file']['name'] . '-' . $_FILES['file']['size']
        : $_GET['flowIdentifier'],
    'flowFilename' => isset($_FILES['file']) ? $_FILES['file']['name'] : $_GET['flowFilename'],
    'flowRelativePath' => isset($_FILES['file']) ? $_FILES['file']['tmp_name'] : $_GET['flowRelativePath']
]);*/