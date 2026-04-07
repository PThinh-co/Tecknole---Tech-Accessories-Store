<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Smart Database Connection - Tự động nhận diện môi trường (Local / Server)
$is_local = false;
if (isset($_SERVER['SERVER_NAME']) && ($_SERVER['SERVER_NAME'] == 'localhost' || $_SERVER['SERVER_NAME'] == '127.0.0.1')) {
    $is_local = true;
}
if (php_sapi_name() == 'cli' || !isset($_SERVER['SERVER_NAME'])) {
    if (strpos(__FILE__, 'htdocs') !== false) {
        $is_local = true;
    }
}

if ($is_local) {
    $host = "localhost";
    $username = "root";
    $password = "";
    $database = "tecknole_db";
}
else {
    $host = "localhost";
    $username = "c05_nhahodau";
    $password = "6w5j5jZ5G6YI4tbw";
    $database = "c05_nhahodau";
}

$conn = mysqli_connect($host, $username, $password, $database);
if (!$conn) {
    if ($is_local) {
        die("<h3>Lỗi kết nối Local: Kiểm tra XAMPP và database 'tecknole_db'.</h3>");
    }
    else {
        die("Kết nối Database Hosting thất bại: " . mysqli_connect_error());
    }
}
mysqli_set_charset($conn, "utf8mb4");
?>
