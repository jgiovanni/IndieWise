<?php

function get_vine_thumbnail( $id )
{
    $vine = file_get_contents("http://vine.co/v/{$id}");
    preg_match('/property="og:image" content="(.*?)"/', $vine, $matches);

    return ($matches[1]) ? $matches[1] : false;
}
$id = explode('v/', $_GET['url'])[1];
echo get_vine_thumbnail($id);