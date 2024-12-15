<?php
$servername = "localhost";
$username = "root";
$password = getenv('DB_Pwd') ?: "";
$dbname = "dwp_final";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("連接失敗: " . $conn->connect_error);
}
?>
