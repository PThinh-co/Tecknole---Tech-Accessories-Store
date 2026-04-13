<?php
session_start();
require_once '../../includes/db.php'; // Chỉnh lại path

$username = isset($_POST['username']) ? trim($_POST['username']) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

if (empty($username) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Vui lòng điền đầy đủ thông tin.']);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT id, username, password, fullname, email, role FROM tk_users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        
        if ($user['role'] !== 'admin' && $user['role'] !== 'super_admin') {
            echo json_encode(['success' => false, 'message' => 'Tài khoản không có quyền quản trị.']);
            exit;
        }

        if (password_verify($password, $user['password']) || $password === $user['password']) {
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_user_id'] = $user['id'];
            $_SESSION['admin_username'] = $user['username'];
            $_SESSION['admin_role'] = $user['role'];

            echo json_encode([
                'success' => true,
                'message' => 'Đăng nhập thành công.',
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'name' => $user['fullname'],
                    'email' => $user['email'],
                    'role' => $user['role'],
                    'is_admin' => true
                ]
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Sai mật khẩu.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Tài khoản không tồn tại.']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Lỗi hệ thống: ' . $e->getMessage()]);
}
