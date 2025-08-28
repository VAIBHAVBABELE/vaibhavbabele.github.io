<?php
// config.php
// Database connection

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "if0_38581364_gaming_website_db";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
