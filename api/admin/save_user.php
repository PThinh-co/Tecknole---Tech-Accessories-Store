<?php
session_start();
require_once '../../includes/db.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    http_response_code(403);
    exit(json_encode(['success' => false, 'message' => 'Unauthorized']));
}

$data = json_decode(file_get_contents('php://input'), true);

$id       = isset($data['id']) ? intval($data['id']) : 0;
$username = isset($data['username']) ? mysqli_real_escape_string($conn, $data['username']) : '';
$fullname = isset($data['fullname']) ? mysqli_real_escape_string($conn, $data['fullname']) : '';
$password = isset($data['password']) ? mysqli_real_escape_string($conn, $data['password']) : '';
$email    = isset($data['email']) ? mysqli_real_escape_string($conn, $data['email']) : '';
$phone    = isset($data['phone']) ? mysqli_real_escape_string($conn, $data['phone']) : '';
$role     = isset($data['role']) ? mysqli_real_escape_string($conn, $data['role']) : 'user';

if (!$id && (empty($username) || empty($fullname) || empty($password))) {
    echo json_encode(['success' => false, 'message' => 'Vui lòng cung cấp đủ Tên đăng nhập, Mật khẩu và Họ tên.']);
    exit;
}

try {
    if ($id > 0) {
        // UPDATE
        $sql = "UPDATE tk_users SET fullname='$fullname', email='$email', phone='$phone', role='$role'";
        if (!empty($password)) {
            $sql .= ", password='$password'";
        }
        if (!empty($username)) {
            $sql .= ", username='$username'";
        }
        $sql .= " WHERE id = $id";
    } else {
        // INSERT
        $sql = "INSERT INTO tk_users (username, fullname, password, email, phone, role) 
                VALUES ('$username', '$fullname', '$password', '$email', '$phone', '$role')";
    }
    
    if ($conn->query($sql)) {
        echo json_encode(['success' => true, 'id' => $id ?: $conn->insert_id]);
    } else {
        echo json_encode(['success' => false, 'message' => $conn->error]);
    }
} catch (mysqli_sql_exception $e) {
    if ($e->getCode() == 1062) {
        echo json_encode(['success' => false, 'message' => 'Lỗi: Tên đăng nhập hoặc Email này đã tồn tại trong hệ thống.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Lỗi hệ thống: ' . $e->getMessage()]);
    }
}
