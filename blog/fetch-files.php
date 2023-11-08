<?php
$blogDir = './';  // The directory you want to search in
$directoriesWithIndexHTML = [];

function findIndexHTML($dir) {
    global $directoriesWithIndexHTML;
    $files = scandir($dir);
    foreach ($files as $file) {
        if ($file !== './' && $file !== '..') {
            $path = $dir . '/' . $file;
            if (is_dir($path)) {
                findIndexHTML($path);
            } elseif ($file === 'index.html') {
                $directoriesWithIndexHTML[] = $dir;
            }
        }
    }
}

findIndexHTML($blogDir);

header('Content-Type: application/json');
echo json_encode($directoriesWithIndexHTML);
?>
